// Notes visitors send to the site's admin: a better item, something that's wrong, or an idea.
// Only the admin page reads them (through /api/stats with the passphrase).
const { PAGES, SPECS, VID_RE, pipeline, cleanName, readBody, sameOrigin } = require("./_lib");

const KINDS = { better: 1, wrong: 1, idea: 1, other: 1 };
const MAX_NOTES = 1000;     // the inbox stops taking notes past this, until the admin clears some
const PER_BROWSER_HOUR = 8;
const SITE_HOUR = 60;

// One line of short text, no control characters.
function clip(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
// The note itself keeps its line breaks.
function noteText(v) {
  return String(v == null ? "" : v)
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1000);
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }
  if (!sameOrigin(req)) return res.status(403).json({ ok: false });

  const body = readBody(req);
  if (!body) return res.status(400).json({ ok: false, error: "bad_request" });
  // A field people never see. Bots that fill in every box get a polite answer and nothing is kept.
  if (body.website) return res.status(201).json({ ok: true });

  const text = noteText(body.text);
  if (text.length < 3) return res.status(400).json({ ok: false, error: "too_short" });
  const vid = VID_RE.test(String(body.vid || "")) ? String(body.vid) : "";
  const c = body.ctx && typeof body.ctx === "object" && !Array.isArray(body.ctx) ? body.ctx : {};
  const note = {
    t: Date.now(),
    kind: KINDS[body.kind] ? body.kind : "other",
    page: PAGES[body.page] ? body.page : "home",
    text: text,
    name: cleanName(body.name),
    vid: vid,
    lvl: Number(c.lvl) === 30 ? 30 : Number(c.lvl) === 20 ? 20 : 0,
    spec: SPECS[c.spec] ? c.spec : "",
    slot: clip(c.slot, 24).replace(/[^a-z0-9-]/gi, "").toLowerCase(),
    label: clip(c.label, 40),
    item: clip(c.item, 80),
    about: clip(c.about, 80),
    status: "new"
  };

  try {
    const hour = Math.floor(note.t / 3600000);
    const checks = [["INCR", "rln:all:" + hour], ["EXPIRE", "rln:all:" + hour, 7200], ["HLEN", "notes"]];
    if (vid) checks.push(["INCR", "rln:" + vid + ":" + hour], ["EXPIRE", "rln:" + vid + ":" + hour, 7200]);
    const out = await pipeline(checks);
    if (Number(out[0]) > SITE_HOUR || (vid && Number(out[3]) > PER_BROWSER_HOUR)) {
      return res.status(429).json({ ok: false, error: "busy" });
    }
    if (Number(out[2]) >= MAX_NOTES) return res.status(507).json({ ok: false, error: "full" });

    const [id] = await pipeline([["INCR", "notes:seq"]]);
    note.id = Number(id);
    const cmds = [["HSET", "notes", String(note.id), JSON.stringify(note)]];
    if (vid) {
      // Shows up in the admin's activity feed next to the visitor's other visits.
      const event = { t: note.t, v: vid, e: "note", p: note.page, x: { kind: note.kind, label: note.label || note.about } };
      cmds.push(["LPUSH", "events", JSON.stringify(event)], ["LTRIM", "events", 0, 299]);
    }
    await pipeline(cmds);
    return res.status(201).json({ ok: true, id: note.id });
  } catch (err) {
    return res.status(err && err.code === "NO_DB" ? 503 : 500).json({ ok: false, error: "server" });
  }
};
