// Records a page view, a progress summary, a visitor's chosen name, or joining the party board.
// Stores no IP addresses: only a random ID the browser made, plus what's listed below.
const {
  PAGES, SPECS, PROFS, VID_RE, KEEP_DAYS,
  pipeline, dayKey, header, parseUA, cleanName, clampInt, cleanRace, readBody, sameOrigin, forgetVisitor, pairs
} = require("./_lib");

const TYPES = new Set(["view", "state", "name", "forget", "party"]);
const PER_MINUTE = 40;
const ITEM_RE = /^[a-z0-9]{2,24}$/;
const ENCH_RE = /^[A-Za-z0-9]{2,24}$/;

function level(v) { return Number(v) === 30 ? 30 : 20; }

// Adds the progress fields for a tool page. Returns a small summary for the activity feed, or null.
function progress(page, d, vkey, now, cmds) {
  if (!d || typeof d !== "object") return null;
  const spec = SPECS[d.spec] ? d.spec : "";
  const lvl = level(d.lvl);
  const race = cleanRace(d.race);
  if (race) cmds.push(["HSET", vkey, "race", race]);
  // A summary without totals (say, just the race someone picked) records only the race.
  if (page === "checklist" && d.total != null) {
    const total = clampInt(d.total, 0, 500);
    const done = Math.min(clampInt(d.done, 0, 500), total);
    const totems = Array.from(new Set(String(d.totems || "").split("").filter((c) => "efwa".indexOf(c) >= 0))).join("");
    cmds.push(["HSET", vkey, "ck_done", done, "ck_total", total, "ck_spec", spec, "ck_lvl", lvl, "ck_totems", totems, "ck_race", race, "ck_at", now]);
    return { spec, done, total, lvl, race };
  }
  if (page === "gear" && d.total != null) {
    const total = clampInt(d.total, 0, 100);
    const have = Math.min(clampInt(d.have, 0, 100), total);
    const profs = Array.from(new Set((Array.isArray(d.profs) ? d.profs : []).filter((p) => PROFS[p]))).slice(0, 4);
    const own = Array.from(new Set((Array.isArray(d.own) ? d.own : []).map(String).filter((k) => ITEM_RE.test(k)))).slice(0, 60);
    // Which enchant or kit is on each owned item, as "item~enchant" pairs.
    const enchTotal = clampInt(d.enchTotal, 0, 30);
    const enchDone = Math.min(clampInt(d.enchDone, 0, 30), enchTotal);
    const ench = [];
    if (d.ench && typeof d.ench === "object" && !Array.isArray(d.ench)) {
      Object.keys(d.ench).slice(0, 30).forEach((k) => {
        const v = String(d.ench[k]);
        if (ITEM_RE.test(k) && ENCH_RE.test(v)) ench.push(k + "~" + v);
      });
    }
    cmds.push(["HSET", vkey, "gear_have", have, "gear_total", total, "gear_spec", spec, "gear_lvl", lvl, "gear_profs", profs.join(","), "gear_own", own.join(","),
      "gear_ench_done", enchDone, "gear_ench_total", enchTotal, "gear_ench", ench.join("."), "gear_race", race, "gear_at", now]);
    return { spec, have, total, lvl, profs, race, enchDone, enchTotal };
  }
  if (race) return { race };
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
      if (name) cmds.push(["HSET", vkey, "name", name]);
      else cmds.push(["HDEL", vkey, "name", "party"], ["SREM", "party", vid]);
      event.x = { set: !!name };
    } else if (type === "party") {
      const on = body.on === true;
      if (on) {
        // Joining needs a name, so the board never shows an anonymous row.
        let name = cleanName(body.name);
        if (!name) {
          const [known] = await pipeline([["HGET", vkey, "name"]]);
          name = cleanName(known);
        }
        if (!name) return res.status(409).json({ ok: false, error: "need_name" });
        cmds.push(["HSET", vkey, "name", name, "party", 1], ["SADD", "party", vid]);
      } else {
        cmds.push(["HDEL", vkey, "party"], ["SREM", "party", vid]);
      }
      event.x = { on: on };
    }

    cmds.push(["LPUSH", "events", JSON.stringify(event)], ["LTRIM", "events", 0, 299]);
    if (type === "view") {
      // Tell the page whether this browser is on the party board, so it stays in step if the
      // owner took them off it or their stats were removed.
      const at = cmds.length;
      cmds.push(["HGET", vkey, "party"]);
      const out = await pipeline(cmds);
      return res.status(200).json({ ok: true, party: out[at] === "1" || out[at] === 1 });
    }
    await pipeline(cmds);
    return res.status(204).end();
  } catch (err) {
    return res.status(err && err.code === "NO_DB" ? 503 : 500).json({ ok: false });
  }
};
