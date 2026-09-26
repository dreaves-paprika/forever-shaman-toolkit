// Notes visitors send to the site's admin: a better item, something that's wrong, or an idea.
// Only the admin page reads them (through /api/stats with the passphrase).
// Each note gets a private token. The browser that sent it keeps the number and token as a
// receipt, and uses them to check for the admin's reply. Nobody else can read a note's status.
const crypto = require("crypto");
const { PAGES, SPECS, VID_RE, pipeline, cleanName, readBody, sameOrigin } = require("./_lib");

const KINDS = { better: 1, wrong: 1, idea: 1, other: 1 };
const MAX_NOTES = 1000;     // the inbox stops taking notes past this, until the admin clears some
const PER_BROWSER_HOUR = 8;
const SITE_HOUR = 60;
const CHECKS_PER_MINUTE = 600;
const MAX_RECEIPTS = 30;
const ID_RE = /^[1-9][0-9]{0,8}$/;
const TOKEN_RE = /^[a-f0-9]{24}$/;

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

// A browser asking what happened to the notes it sent.
async function checkReceipts(list, res) {
  const want = list.slice(0, MAX_RECEIPTS)
    .map((r) => ({ id: String(r && r.id != null ? r.id : ""), tk: String((r && r.tk) || "") }))
    .filter((r) => ID_RE.test(r.id) && TOKEN_RE.test(r.tk));
  if (!want.length) return res.status(200).json({ ok: true, notes: [] });
  const minute = Math.floor(Date.now() / 60000);
  const out = await pipeline([
    ["INCR", "rlc:" + minute], ["EXPIRE", "rlc:" + minute, 120],
    ["HMGET", "notes"].concat(want.map((r) => r.id))
  ]);
  if (Number(out[0]) > CHECKS_PER_MINUTE) return res.status(429).json({ ok: false, error: "busy" });
  const raws = Array.isArray(out[2]) ? out[2] : [];
  const now = Date.now();
  const found = [];
  const writes = [];
  want.forEach((r, i) => {
    let nt = null;
    try { nt = raws[i] ? JSON.parse(raws[i]) : null; } catch (e) { nt = null; }
    if (!nt || !nt.tk || nt.tk !== r.tk) return;
    found.push({ id: Number(r.id), status: nt.status || "new", status_at: nt.status_at || 0, reply: nt.reply || "", reply_at: nt.reply_at || 0 });
    // Lets the admin see that their update reached this browser.
    const changed = Math.max(nt.status_at || 0, nt.reply_at || 0);
    if (changed && (nt.seen_at || 0) < changed) {
      nt.seen_at = now;
      writes.push(["HSET", "notes", r.id, JSON.stringify(nt)]);
    }
  });
  if (writes.length) await pipeline(writes);
  return res.status(200).json({ ok: true, notes: found });
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

  if (Array.isArray(body.check)) {
    try {
      return await checkReceipts(body.check, res);
    } catch (err) {
      return res.status(err && err.code === "NO_DB" ? 503 : 500).json({ ok: false, error: "server" });
    }
  }

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
    status: "new",
    tk: crypto.randomBytes(12).toString("hex")
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
    return res.status(201).json({ ok: true, id: note.id, tk: note.tk });
  } catch (err) {
    return res.status(err && err.code === "NO_DB" ? 503 : 500).json({ ok: false, error: "server" });
  }
};
