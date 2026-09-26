// Tells every page which level cap is live. The site owner changes it from /admin.
const { pipeline, pairs } = require("./_lib");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.setHeader("Cache-Control", "no-store");
    return res.status(405).json({ ok: false });
  }
  try {
    const [cfg] = await pipeline([["HGETALL", "config"]]);
    const c = pairs(cfg);
    // Cached on Vercel's edge for a short while, so a change reaches everyone within a minute or two.
    // Browsers always ask again (the edge header never reaches them).
    res.setHeader("Vercel-CDN-Cache-Control", "max-age=30, stale-while-revalidate=60");
    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    return res.status(200).json({ cap: Number(c.cap) === 30 ? 30 : 20 });
  } catch (err) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ cap: 20, fallback: true });
  }
};
