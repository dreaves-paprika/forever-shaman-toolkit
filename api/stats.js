// Everything the admin page shows, plus the admin actions (level cap, labels, removals).
// Requires the ADMIN_KEY passphrase.
const { TZ, VID_RE, pipeline, lastDays, pairs, safeEqual, readBody, cleanName, forgetVisitor } = require("./_lib");

const MAX_VISITORS = 2000;

// What the admin page gets for a note. The private token stays on the server.
function forAdmin(note, id) {
  const out = Object.assign({}, note, { id: Number(id), canReply: !!note.tk });
  delete out.tk;
  return out;
}

// Replies keep their line breaks, like notes.
function replyText(v) {
  return String(v == null ? "" : v)
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 500);
}

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
  const cmds = [["SMEMBERS", "visitors"], ["HGETALL", "pv"], ["LRANGE", "events", 0, 199], ["HGETALL", "config"], ["SCARD", "party"], ["HGETALL", "notes"]];
  days.forEach((d) => cmds.push(["HGETALL", "dv:" + d]));
  const out = await pipeline(cmds);
  const OFF = 6;

  const ids = (Array.isArray(out[0]) ? out[0] : []).slice(0, MAX_VISITORS);
  const profiles = ids.length ? await pipeline(ids.map((id) => ["HGETALL", "v:" + id])) : [];
  const visitors = ids
    .map((id, i) => Object.assign(pairs(profiles[i]), { id: id }))
    .filter((v) => v.first || v.last);

  const series = days.map((d, i) => {
    const byVisitor = pairs(out[OFF + i]);
    const ids = Object.keys(byVisitor);
    return { day: d, ids: ids, views: ids.reduce((sum, k) => sum + (Number(byVisitor[k]) || 0), 0) };
  });
  const union = (list) => new Set([].concat.apply([], list.map((s) => s.ids))).size;
  const views = pairs(out[1]);
  Object.keys(views).forEach((k) => { views[k] = Math.max(0, Number(views[k]) || 0); });

  const events = (Array.isArray(out[2]) ? out[2] : [])
    .map((s) => { try { return JSON.parse(s); } catch (e) { return null; } })
    .filter(Boolean);

  const rawNotes = pairs(out[5]);
  const notes = Object.keys(rawNotes)
    .map((id) => { try { return forAdmin(JSON.parse(rawNotes[id]), id); } catch (e) { return null; } })
    .filter(Boolean)
    .sort((a, b) => b.t - a.t);

  return res.status(200).json({
    ok: true,
    now: now,
    tz: TZ,
    totals: { visitors: visitors.length, views: views, today: series[series.length - 1].ids.length, last7: union(series.slice(-7)), last30: union(series), party: Number(out[4]) || 0 },
    config: { cap: Number(pairs(out[3]).cap) === 30 ? 30 : 20, at: Number(pairs(out[3]).cap_at) || 0 },
    series: series.map((s) => ({ day: s.day, visitors: s.ids.length, views: s.views })),
    visitors: visitors,
    events: events,
    notes: notes
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
    if (body.action === "config") {
      // The level cap every visitor sees. Pages pick it up within a minute or two.
      const cap = Number(body.cap) === 30 ? 30 : 20;
      const at = Date.now();
      await pipeline([["HSET", "config", "cap", cap, "cap_at", at]]);
      return res.status(200).json({ ok: true, config: { cap: cap, at: at } });
    }
    if (body.action === "note_status" || body.action === "note_delete" || body.action === "note_reply") {
      const id = String(Math.floor(Number(body.id)) || "");
      if (!/^[1-9][0-9]{0,8}$/.test(id)) return res.status(400).json({ ok: false, error: "bad_request" });
      if (body.action === "note_delete") {
        await pipeline([["HDEL", "notes", id]]);
        return res.status(200).json({ ok: true });
      }
      const STATUSES = { new: 1, looking: 1, done: 1 };
      const status = STATUSES[body.status] ? body.status : null;
      if (body.action === "note_status" && !status) return res.status(400).json({ ok: false, error: "bad_request" });
      const [raw] = await pipeline([["HGET", "notes", id]]);
      if (!raw) return res.status(404).json({ ok: false, error: "not_found" });
      let note;
      try { note = JSON.parse(raw); } catch (e) { return res.status(500).json({ ok: false, error: "server" }); }
      const now = Date.now();
      if (body.action === "note_reply") {
        // An empty reply takes the reply away. The sender sees the change next time they check.
        const reply = replyText(body.reply);
        if (reply) note.reply = reply;
        else delete note.reply;
        note.reply_at = now;
      }
      if (status) {
        note.status = status;
        note.status_at = now;
      }
      await pipeline([["HSET", "notes", id, JSON.stringify(note)]]);
      return res.status(200).json({ ok: true, note: forAdmin(note, id) });
    }
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
    if (body.action === "unparty") {
      // Takes someone off the party board without touching their stats. They can join again.
      await pipeline([["HDEL", "v:" + vid, "party"], ["SREM", "party", vid]]);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ ok: false, error: "bad_request" });
  } catch (err) {
    if (err && err.code === "NO_DB") return res.status(503).json({ ok: false, error: "no_db" });
    return res.status(500).json({ ok: false, error: "server" });
  }
};
