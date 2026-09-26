// Records a page view, a progress summary, or a visitor's chosen name.
// Stores no IP addresses: only a random ID the browser made, plus what's listed below.
const {
  PAGES, SPECS, PROFS, VID_RE, KEEP_DAYS,
  pipeline, dayKey, header, parseUA, cleanName, clampInt, readBody, sameOrigin, forgetVisitor
} = require("./_lib");

const TYPES = new Set(["view", "state", "name", "forget"]);
const PER_MINUTE = 40;

// Adds the progress fields for a tool page. Returns a small summary for the activity feed, or null.
function progress(page, d, vkey, now, cmds) {
  if (!d || typeof d !== "object") return null;
  const spec = SPECS[d.spec] ? d.spec : "";
  if (page === "checklist") {
    const total = clampInt(d.total, 0, 500);
    const done = Math.min(clampInt(d.done, 0, 500), total);
    cmds.push(["HSET", vkey, "ck_done", done, "ck_total", total, "ck_spec", spec, "ck_at", now]);
    return { spec, done, total };
  }
  if (page === "gear") {
    const total = clampInt(d.total, 0, 100);
    const have = Math.min(clampInt(d.have, 0, 100), total);
    const profs = Array.from(new Set((Array.isArray(d.profs) ? d.profs : []).filter((p) => PROFS[p]))).slice(0, 4);
    cmds.push(["HSET", vkey, "gear_have", have, "gear_total", total, "gear_spec", spec, "gear_profs", profs.join(","), "gear_at", now]);
    return { spec, have, total, profs };
  }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  if (!sameOrigin(req)) return res.status(403).json({ ok: false });

  const body = readBody(req);
  const vid = body ? String(body.vid || "") : "";
  const type = body ? String(body.type || "") : "";
  const page = body ? String(body.page || "") : "";
  if (!VID_RE.test(vid) || !TYPES.has(type) || !PAGES[page]) return res.status(400).json({ ok: false });

  try {
    const now = Date.now();
    const minuteKey = "rl:" + vid + ":" + Math.floor(now / 60000);
    const [count] = await pipeline([["INCR", minuteKey], ["EXPIRE", minuteKey, 120]]);
    if (Number(count) > PER_MINUTE) return res.status(429).json({ ok: false });

    if (type === "forget") {
      await forgetVisitor(vid, now);
      return res.status(204).end();
    }

    const ua = parseUA(req.headers["user-agent"]);
    const vkey = "v:" + vid;
    const cmds = [
      ["SADD", "visitors", vid],
      ["HSETNX", vkey, "first", now],
      ["HSET", vkey, "last", now, "device", ua.device, "os", ua.os, "browser", ua.browser,
        "country", header(req, "x-vercel-ip-country", 2), "region", header(req, "x-vercel-ip-country-region", 8),
        "city", header(req, "x-vercel-ip-city", 60)]
    ];
    const event = { t: now, v: vid, e: type, p: page };

    if (type === "view") {
      const day = dayKey(now);
      cmds.push(
        ["HINCRBY", vkey, "views", 1], ["HINCRBY", vkey, "views_" + page, 1],
        ["HINCRBY", "pv", page, 1],
        ["HINCRBY", "dv:" + day, vid, 1], ["EXPIRE", "dv:" + day, (KEEP_DAYS + 1) * 86400]
      );
      let ref = "";
      try {
        const raw = String(body.ref || "").slice(0, 200);
        if (raw) {
          const host = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw).hostname.toLowerCase();
          const own = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().split(":")[0].toLowerCase();
          if (host && host !== own && /^[a-z0-9.-]+$/.test(host)) ref = host.slice(0, 80);
        }
      } catch (e) { ref = ""; }
      if (ref) cmds.push(["HSETNX", vkey, "ref", ref]);
      const name = cleanName(body.name);
      if (name) cmds.push(["HSET", vkey, "name", name]);
      progress(page, body.data, vkey, now, cmds);
    } else if (type === "state") {
      const x = progress(page, body.data, vkey, now, cmds);
      if (!x) return res.status(400).json({ ok: false });
      event.x = x;
    } else if (type === "name") {
      const name = cleanName(body.name);
      cmds.push(name ? ["HSET", vkey, "name", name] : ["HDEL", vkey, "name"]);
      event.x = { set: !!name };
    }

    cmds.push(["LPUSH", "events", JSON.stringify(event)], ["LTRIM", "events", 0, 299]);
    await pipeline(cmds);
    return res.status(204).end();
  } catch (err) {
    return res.status(err && err.code === "NO_DB" ? 503 : 500).json({ ok: false });
  }
};
