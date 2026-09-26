// Everything the admin page shows, plus two admin actions. Requires the ADMIN_KEY passphrase.
const { TZ, VID_RE, pipeline, lastDays, pairs, safeEqual, readBody, cleanName, forgetVisitor } = require("./_lib");

const MAX_VISITORS = 2000;

// The admin page sends the passphrase base64-encoded so any characters work in a header.
function givenKey(req) {
  let b = req.headers["x-admin-key-b64"];
  if (Array.isArray(b)) b = b[0];
  if (b) {
    try { return Buffer.from(String(b), "base64").toString("utf8"); } catch (e) { return ""; }
  }
  let k = req.headers["x-admin-key"];
  if (Array.isArray(k)) k = k[0];
  return k ? String(k) : "";
}

function authorized(req) {
  const given = givenKey(req).trim();
  return !!given && safeEqual(given, String(process.env.ADMIN_KEY).trim());
}

async function read(res) {
  const now = Date.now();
  const days = lastDays(30, now);
  const cmds = [["SMEMBERS", "visitors"], ["HGETALL", "pv"], ["LRANGE", "events", 0, 199]];
  days.forEach((d) => cmds.push(["HGETALL", "dv:" + d]));
  const out = await pipeline(cmds);

  const ids = (Array.isArray(out[0]) ? out[0] : []).slice(0, MAX_VISITORS);
  const profiles = ids.length ? await pipeline(ids.map((id) => ["HGETALL", "v:" + id])) : [];
  const visitors = ids
    .map((id, i) => Object.assign(pairs(profiles[i]), { id: id }))
    .filter((v) => v.first || v.last);

  const series = days.map((d, i) => {
    const byVisitor = pairs(out[3 + i]);
    const ids = Object.keys(byVisitor);
    return { day: d, ids: ids, views: ids.reduce((sum, k) => sum + (Number(byVisitor[k]) || 0), 0) };
  });
  const union = (list) => new Set([].concat.apply([], list.map((s) => s.ids))).size;
  const views = pairs(out[1]);
  Object.keys(views).forEach((k) => { views[k] = Math.max(0, Number(views[k]) || 0); });

  const events = (Array.isArray(out[2]) ? out[2] : [])
    .map((s) => { try { return JSON.parse(s); } catch (e) { return null; } })
    .filter(Boolean);

  return res.status(200).json({
    ok: true,
    now: now,
    tz: TZ,
    totals: { visitors: visitors.length, views: views, today: series[series.length - 1].ids.length, last7: union(series.slice(-7)), last30: union(series) },
    series: series.map((s) => ({ day: s.day, visitors: s.ids.length, views: s.views })),
    visitors: visitors,
    events: events
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Robots-Tag", "noindex");
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false });
  }
  if (!process.env.ADMIN_KEY) return res.status(503).json({ ok: false, error: "no_admin_key" });
  if (!authorized(req)) {
    await new Promise((r) => setTimeout(r, 600));
    return res.status(401).json({ ok: false, error: "bad_key" });
  }

  try {
    if (req.method === "GET") return await read(res);

    const body = readBody(req) || {};
    const vid = String(body.vid || "");
    if (!VID_RE.test(vid)) return res.status(400).json({ ok: false, error: "bad_request" });

    if (body.action === "label") {
      const [exists] = await pipeline([["SISMEMBER", "visitors", vid]]);
      if (!Number(exists)) return res.status(404).json({ ok: false, error: "not_found" });
      const label = cleanName(body.label);
      await pipeline([label ? ["HSET", "v:" + vid, "label", label] : ["HDEL", "v:" + vid, "label"]]);
      return res.status(200).json({ ok: true, label: label });
    }
    if (body.action === "forget") {
      await forgetVisitor(vid, Date.now());
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, error: "bad_request" });
  } catch (err) {
    if (err && err.code === "NO_DB") return res.status(503).json({ ok: false, error: "no_db" });
    return res.status(500).json({ ok: false, error: "server" });
  }
};
