// The party board: only people who chose to join it, and only what they agreed to show.
// No IDs, locations or devices leave this endpoint.
const { SPECS, PROFS, pipeline, pairs } = require("./_lib");

const ITEM_RE = /^[a-z0-9]{2,24}$/;

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.setHeader("Cache-Control", "no-store");
    return res.status(405).json({ ok: false });
  }
  try {
    const [ids] = await pipeline([["SMEMBERS", "party"]]);
    const list = (Array.isArray(ids) ? ids : []).slice(0, 200);
    const rows = list.length ? await pipeline(list.map((id) => ["HGETALL", "v:" + id])) : [];
    const now = Date.now();
    const members = [];
    rows.forEach((raw) => {
      const v = pairs(raw);
      if (v.party !== "1" || !v.name) return;
      const ck = Number(v.ck_total) > 0 ? {
        lvl: Number(v.ck_lvl) === 30 ? 30 : 20,
        done: Number(v.ck_done) || 0,
        total: Number(v.ck_total) || 0,
        totems: String(v.ck_totems || "").replace(/[^efwa]/g, ""),
        spec: SPECS[v.ck_spec] ? v.ck_spec : ""
      } : null;
      const gear = Number(v.gear_total) > 0 ? {
        lvl: Number(v.gear_lvl) === 30 ? 30 : 20,
        have: Number(v.gear_have) || 0,
        total: Number(v.gear_total) || 0,
        spec: SPECS[v.gear_spec] ? v.gear_spec : "",
        profs: String(v.gear_profs || "").split(",").filter((p) => PROFS[p]),
        own: String(v.gear_own || "").split(",").filter((k) => ITEM_RE.test(k)).slice(0, 60)
      } : null;
      const last = Number(v.last) || 0;
      // Round "last seen" to the hour so the board doesn't show anyone's exact activity.
      members.push({ name: String(v.name).slice(0, 40), ck: ck, gear: gear, last: last ? Math.floor(last / 3600000) * 3600000 : 0, active: last > now - 15 * 60000 });
    });
    members.sort((a, b) => b.last - a.last || a.name.localeCompare(b.name));
    // A short cache on Vercel's edge keeps a tab left open from running up database reads.
    // Browsers always ask again (the edge header never reaches them).
    res.setHeader("Vercel-CDN-Cache-Control", "max-age=30, stale-while-revalidate=60");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    return res.status(200).json({ ok: true, members: members });
  } catch (err) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(err && err.code === "NO_DB" ? 503 : 500).json({ ok: false });
  }
};
