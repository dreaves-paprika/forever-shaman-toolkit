// Shared helpers for the API routes. Files starting with "_" are not deployed as routes.
const crypto = require("crypto");

// Day boundaries for the stats (visits "today", the 30-day chart).
const TZ = process.env.STATS_TZ || "America/Chicago";
const PAGES = { home: "home page", checklist: "checklist", gear: "gear guide", dungeons: "dungeon planner", party: "party board" };
const SPECS = { enh: "Enhancement", ele: "Elemental", resto: "Restoration" };
const PROFS = { lw: "Leatherworking", tail: "Tailoring", eng: "Engineering", ench: "Enchanting" };
const VID_RE = /^[a-z0-9]{12,40}$/i;
const KEEP_DAYS = 120;

function redisConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/+$/, ""), token } : null;
}

// Runs several Redis commands in one request through Upstash's REST API.
async function pipeline(commands) {
  const cfg = redisConfig();
  if (!cfg) {
    const err = new Error("The stats database isn't connected to this project.");
    err.code = "NO_DB";
    throw err;
  }
  const res = await fetch(cfg.url + "/pipeline", {
    method: "POST",
    headers: { Authorization: "Bearer " + cfg.token, "Content-Type": "application/json" },
    body: JSON.stringify(commands.map((c) => c.map((part) => String(part))))
  });
  if (!res.ok) throw new Error("Stats database answered " + res.status);
  const out = await res.json();
  if (!Array.isArray(out)) throw new Error("Unexpected answer from the stats database");
  return out.map((r) => (r && Object.prototype.hasOwnProperty.call(r, "result") ? r.result : null));
}

// YYYY-MM-DD for a moment, in the stats time zone.
function dayKey(ms) {
  const parts = {};
  new Intl.DateTimeFormat("en-US", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
    .formatToParts(new Date(ms))
    .forEach((p) => { parts[p.type] = p.value; });
  return parts.year + "-" + parts.month + "-" + parts.day;
}

// The last n calendar days, oldest first, ending today. Steps in UTC so daylight saving can't skip a day.
function lastDays(n, now) {
  const [y, m, d] = dayKey(now).split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const out = [];
  for (let i = n - 1; i >= 0; i--) out.push(new Date(base - i * 86400000).toISOString().slice(0, 10));
  return out;
}

function pairs(arr) {
  const o = {};
  if (Array.isArray(arr)) for (let i = 0; i + 1 < arr.length; i += 2) o[arr[i]] = arr[i + 1];
  else if (arr && typeof arr === "object") Object.assign(o, arr);
  return o;
}

function header(req, name, max) {
  let v = req.headers[name];
  if (Array.isArray(v)) v = v[0];
  if (!v) return "";
  try { v = decodeURIComponent(String(v)); } catch (e) { v = String(v); }
  return v.replace(/[\u0000-\u001f<>]/g, "").slice(0, max || 60);
}

function parseUA(ua) {
  ua = String(ua || "");
  let device = "Desktop";
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) device = "Tablet";
  else if (/Mobi|iPhone|iPod|Android.*Mobile|Windows Phone/i.test(ua)) device = "Phone";
  let os = "Other";
  if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/CrOS/i.test(ua)) os = "ChromeOS";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  let browser = "Other";
  if (/Edg(e|A|iOS)?\//i.test(ua)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(ua)) browser = "Opera";
  else if (/SamsungBrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/Firefox\/|FxiOS/i.test(ua)) browser = "Firefox";
  else if (/Chrome\/|CriOS/i.test(ua)) browser = "Chrome";
  else if (/Safari\//i.test(ua)) browser = "Safari";
  return { device, os, browser };
}

function cleanName(v) {
  return String(v || "").replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
}

function clampInt(v, min, max) {
  const n = Math.round(Number(v));
  if (!isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function readBody(req) {
  let body = req.body;
  if (Buffer.isBuffer(body)) body = body.toString("utf8");
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  return body && typeof body === "object" && !Array.isArray(body) ? body : null;
}

// Blocks other websites from posting into the stats. Requests without an Origin header are allowed.
function sameOrigin(req) {
  let origin = req.headers.origin;
  if (Array.isArray(origin)) origin = origin[0];
  if (!origin) return true;
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().toLowerCase();
  try { return new URL(origin).host.toLowerCase() === host; } catch (e) { return false; }
}

// Removes one visitor and everything counted for them.
async function forgetVisitor(vid, now) {
  const [profile, events] = await pipeline([["HGETALL", "v:" + vid], ["LRANGE", "events", 0, -1]]);
  const p = pairs(profile);
  const cmds = [["SREM", "visitors", vid], ["SREM", "party", vid], ["DEL", "v:" + vid]];
  Object.keys(PAGES).forEach((page) => {
    const n = Number(p["views_" + page]) || 0;
    if (n > 0) cmds.push(["HINCRBY", "pv", page, -n]);
  });
  lastDays(KEEP_DAYS + 1, now).forEach((d) => cmds.push(["HDEL", "dv:" + d, vid]));
  const seen = new Set();
  (Array.isArray(events) ? events : []).forEach((s) => {
    if (seen.has(s)) return;
    try { if (JSON.parse(s).v === vid) { seen.add(s); cmds.push(["LREM", "events", 0, s]); } } catch (e) { /* skip */ }
  });
  await pipeline(cmds);
}

module.exports = {
  TZ, PAGES, SPECS, PROFS, VID_RE, KEEP_DAYS,
  pipeline, dayKey, lastDays, pairs, header, parseUA, cleanName, clampInt, safeEqual, readBody, sameOrigin, forgetVisitor
};
