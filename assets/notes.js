/* Shaman Forever TL;DR: "Note to admin", and replies to those notes.
   Any button with data-note opens a small form that sends the site's admin a note: a better option,
   something that's wrong, or an idea. Buttons can add context with data-note-slot, data-note-label,
   data-note-item, data-note-about and data-note-kind. A page can also set window.shamanNoteContext()
   to return { lvl, spec, race, about }.
   Each note sent from this browser leaves a receipt here (its number and a private token), so the
   browser can check for the admin's reply. "Your notes" lists them; a one-time notice appears when
   the admin replies or changes a note's status.
   Load it in the <head> so the button styles are there before the page draws. */
(function () {
  "use strict";
  var ENDPOINT = "/api/note";
  var VID_KEY = "forever-shaman20:vid";
  var OFF_KEY = "forever-shaman20:notrack";
  var NAME_KEY = "forever-shaman20:name";
  var STORE_KEY = "forever-shaman20:notes:v1";
  var MAX = 1000;
  var KEEP = 30;
  var CHECK_EVERY = 120000;
  var FIRST = "new|0";
  var PAGE_LABEL = { home: "Home page", checklist: "Checklist", gear: "Gear guide", dungeons: "Dungeon planner", party: "Party board" };
  var PAGE_THE = { home: "the home page", checklist: "the checklist", gear: "the gear guide", dungeons: "the dungeon planner", party: "the party board" };
  var SPEC_LABEL = { enh: "Enhancement", ele: "Elemental", resto: "Restoration" };
  var RACE_LABEL = { dwarf: "Dwarf", orc: "Orc", tauren: "Tauren", troll: "Troll", skyborne: "Skyborne" };
  var KIND_SHORT = { better: "Better option", wrong: "Something’s wrong", idea: "Idea", other: "Note" };
  var STATUS_SHORT = { new: "Sent", looking: "Looking into it", done: "Done", gone: "Closed" };
  var KINDS = [
    ["better", "A better option", "Which item, quest or route is better, and why? Where does it come from?"],
    ["wrong", "Something’s wrong", "What’s wrong, and what did you expect to see?"],
    ["idea", "An idea", "What would make this more useful?"]
  ];
  var ERR = {
    too_short: "Add a few more words first.",
    busy: "That’s a lot of notes in a short time. Try again in an hour.",
    full: "The admin’s inbox is full right now. Try again in a few days.",
    offline: "Couldn’t send. Check your connection and try again.",
    failed: "Couldn’t send that. Try again in a moment."
  };

  function get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) {
    try {
      if (v === null || v === undefined) window.localStorage.removeItem(k);
      else window.localStorage.setItem(k, v);
      return true;
    } catch (e) { return false; }
  }
  function page() { return document.documentElement.getAttribute("data-page") || "home"; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  function shortDate(ms) {
    try { return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric" }); } catch (e) { return ""; }
  }

  /* ---------- receipts for notes sent from this browser ---------- */
  function loadStore() {
    var st = null;
    try { st = JSON.parse(get(STORE_KEY) || "null"); } catch (e) { st = null; }
    if (!st || typeof st !== "object" || !Array.isArray(st.list)) st = { v: 1, list: [], seen: {}, told: {}, checkedAt: 0 };
    if (!st.seen || typeof st.seen !== "object") st.seen = {};
    if (!st.told || typeof st.told !== "object") st.told = {};
    st.list = st.list.filter(function (n) { return n && /^[1-9][0-9]{0,8}$/.test(String(n.id)) && /^[a-f0-9]{24}$/.test(String(n.tk)); });
    return st;
  }
  function saveStore(st) {
    st.list.sort(function (a, b) { return (b.t || 0) - (a.t || 0); });
    if (st.list.length > KEEP) st.list = st.list.slice(0, KEEP);
    var keep = {};
    st.list.forEach(function (n) { keep[n.id] = 1; });
    Object.keys(st.seen).forEach(function (k) { if (!keep[k]) delete st.seen[k]; });
    Object.keys(st.told).forEach(function (k) { if (!keep[k]) delete st.told[k]; });
    return put(STORE_KEY, JSON.stringify(st));
  }
  // What a note looks like right now; a change means the admin did something with it.
  function stamp(n) { return n.gone ? "gone" : (n.status || "new") + "|" + (n.reply_at || 0); }
  function isUpdate(n, st) { return stamp(n) !== (st.seen[n.id] || FIRST); }

  var checking = null;
  function check(force) {
    var st = loadStore();
    if (!st.list.length) return Promise.resolve(st);
    if (!force && Date.now() - (st.checkedAt || 0) < CHECK_EVERY) return Promise.resolve(st);
    if (checking) return checking;
    var asked = {};
    var receipts = st.list.map(function (n) { asked[n.id] = 1; return { id: n.id, tk: n.tk }; });
    checking = window.fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ check: receipts }),
      credentials: "same-origin"
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      var fresh = loadStore();
      if (j && j.ok && Array.isArray(j.notes)) {
        var byId = {};
        j.notes.forEach(function (x) { byId[x.id] = x; });
        fresh.list.forEach(function (n) {
          var x = byId[n.id];
          if (x) {
            n.status = x.status; n.status_at = x.status_at || 0;
            n.reply = x.reply || ""; n.reply_at = x.reply_at || 0;
            n.gone = false;
          } else if (asked[n.id]) {
            n.gone = true; // the admin deleted it
          }
        });
        fresh.checkedAt = Date.now();
        saveStore(fresh);
      }
      checking = null;
      return fresh;
    }).catch(function () {
      checking = null;
      return loadStore();
    });
    return checking;
  }

  function updateText(list) {
    if (list.length > 1) return "The admin updated " + list.length + " of your notes.";
    var n = list[0];
    var about = n.topic ? " about " + n.topic : "";
    if (n.gone) return "The admin closed your note" + about + ".";
    if (n.reply && (n.reply_at || 0) >= (n.status_at || 0)) return "The admin replied to your note" + about + ".";
    if (n.status === "done") return "Your note" + about + " is marked done.";
    if (n.status === "looking") return "The admin is looking into your note" + about + ".";
    return "The admin updated your note" + about + ".";
  }

  /* ---------- styles ---------- */
  var CSS = ""
    + ".nt-open{display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 8px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--ink-2);font:inherit;font-size:13.5px;line-height:1.3;cursor:pointer;white-space:nowrap}"
    + ".nt-open:hover{border-color:var(--accent);color:var(--ink)}"
    + ".nt-open svg,.nt-link svg{flex:none;width:14px;height:14px}"
    + ".nt-link{display:inline-flex;align-items:center;gap:6px;padding:0;border:0;background:none;color:var(--accent);font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}"
    + ".nt-sep{color:var(--ink-3)}"
    + ".nt-badge{display:inline-block;margin-left:2px;padding:1px 8px;border-radius:999px;background:var(--accent);color:var(--surface);font-size:12px;font-weight:700;line-height:1.5;text-decoration:none}"
    + ".nt-open:focus-visible,.nt-link:focus-visible,.nt :focus-visible,.nt-toast :focus-visible{outline:2px solid var(--focus,var(--accent));outline-offset:2px}"
    + ".nt{width:min(540px,calc(100vw - 24px));max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);margin:auto;padding:0;border:1px solid var(--line);border-radius:18px;background:var(--surface);color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:auto;overscroll-behavior:contain}"
    + ".nt::backdrop{background:rgba(10,15,20,.55)}"
    + ".nt-in{display:grid;gap:14px;padding:20px 22px 22px}"
    + ".nt-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}"
    + ".nt-title{margin:0;font-size:20px;font-weight:700;line-height:1.25}"
    + ".nt-title:focus{outline:none}"
    + ".nt-about{margin:4px 0 0;font-size:14.5px;color:var(--ink-3)}"
    + ".nt-x{flex:none;display:grid;place-items:center;width:36px;height:36px;margin:-6px -8px 0 0;border:0;border-radius:10px;background:none;color:var(--ink-2);cursor:pointer}"
    + ".nt-x:hover{background:var(--surface-2,rgba(127,127,127,.12))}"
    + ".nt-x svg{width:18px;height:18px}"
    + ".nt fieldset{margin:0;padding:0;border:0;min-width:0}"
    + ".nt legend{padding:0;margin-bottom:8px;font-weight:500;font-size:15px}"
    + ".nt-kinds{display:flex;flex-wrap:wrap;gap:8px}"
    + ".nt-kind{position:relative;cursor:pointer}"
    + ".nt-kind input{position:absolute;opacity:0;width:100%;height:100%;inset:0;margin:0;cursor:pointer}"
    + ".nt-kind span{display:block;padding:7px 13px;border:1px solid var(--line-strong);border-radius:999px;font-size:14.5px;color:var(--ink-2)}"
    + ".nt-kind input:checked + span{border-color:var(--accent);background:var(--accent);color:var(--surface)}"
    + ".nt-kind input:focus-visible + span{outline:2px solid var(--focus,var(--accent));outline-offset:2px}"
    + ".nt-field{display:grid;gap:6px}"
    + ".nt-field label{font-weight:500;font-size:15px}"
    + ".nt-field label small{font-weight:400;color:var(--ink-3)}"
    + ".nt textarea,.nt-name{width:100%;min-width:0;padding:10px 12px;border:1px solid var(--line-strong);border-radius:10px;background:var(--surface);color:var(--ink);font:inherit;font-size:16px;line-height:1.45}"
    + ".nt textarea{min-height:120px;resize:vertical}"
    + ".nt-name{height:42px;padding-block:0;max-width:320px}"
    + ".nt textarea::placeholder,.nt-name::placeholder{color:var(--ink-3)}"
    + ".nt-count{justify-self:end;margin:-2px 0 0;font-size:13px;color:var(--ink-3);font-variant-numeric:tabular-nums}"
    + ".nt-trap{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}"
    + ".nt-fine{margin:0;font-size:14px;color:var(--ink-3)}"
    + ".nt-msg{margin:0;font-size:15px;color:var(--danger,#B42318)}"
    + ".nt-msg:empty{display:none}"
    + ".nt-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px}"
    + ".nt-actions .nt-link{margin-left:auto}"
    + ".nt-btn{height:42px;padding:0 18px;border:1px solid var(--line-strong);border-radius:10px;background:var(--surface);color:var(--ink);font:inherit;font-size:15.5px;font-weight:500;cursor:pointer}"
    + ".nt-btn:hover{border-color:var(--accent)}"
    + ".nt-btn-primary{background:var(--accent);border-color:var(--accent);color:var(--surface)}"
    + ".nt-btn:disabled{opacity:.6;cursor:default}"
    + ".nt-done{justify-items:start}"
    + ".nt-done p{margin:0;color:var(--ink-2)}"
    + ".nt-done .nt-title{display:flex;align-items:center;gap:10px}"
    + ".nt-done .nt-title svg{width:24px;height:24px;color:var(--ok,#2C7A4B)}"
    + ".nt-list{list-style:none;margin:0;padding:0;display:grid;gap:10px}"
    + ".nt-li{display:grid;gap:6px;padding:12px 14px;border:1px solid var(--line);border-radius:12px}"
    + ".nt-li.is-update{border-color:var(--accent)}"
    + ".nt-li-head{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;font-size:14px;color:var(--ink-2)}"
    + ".nt-li-date{margin-left:auto;font-size:13px;color:var(--ink-3)}"
    + ".nt-chip{display:inline-flex;align-items:center;gap:6px;padding:2px 10px;border-radius:999px;background:var(--surface-2,rgba(127,127,127,.12));color:var(--ink);font-size:13px;font-weight:700}"
    + ".nt-chip::before{content:\"\";width:7px;height:7px;border-radius:50%;background:var(--ink-3)}"
    + ".nt-chip.s-looking::before{background:var(--accent)}"
    + ".nt-chip.s-done::before{background:var(--ok,#2C7A4B)}"
    + ".nt-updated{font-size:12.5px;font-weight:700;color:var(--accent)}"
    + ".nt-li-text{margin:0;font-size:15px;color:var(--ink);white-space:pre-wrap;overflow-wrap:anywhere}"
    + ".nt-reply{padding:9px 12px;border-left:3px solid var(--accent);border-radius:0 10px 10px 0;background:var(--surface-2,rgba(127,127,127,.1))}"
    + ".nt-reply-head{margin:0 0 2px;font-size:13px;font-weight:700;color:var(--ink-2)}"
    + ".nt-reply-text{margin:0;font-size:15px;color:var(--ink);white-space:pre-wrap;overflow-wrap:anywhere}"
    + ".nt-empty{margin:0;color:var(--ink-2)}"
    + ".nt-toast{position:fixed;z-index:40;left:50%;bottom:16px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;width:max-content;max-width:calc(100vw - 24px);padding:9px 8px 9px 14px;border:1px solid var(--line-strong);border-radius:14px;background:var(--surface);color:var(--ink);box-shadow:0 12px 32px rgba(0,0,0,.22);font-size:15px;line-height:1.35}"
    + ".nt-toast:empty{display:none}"
    + ".nt-toast > svg{flex:none;width:18px;height:18px;color:var(--accent)}"
    + ".nt-toast-text{min-width:0}"
    + ".nt-toast .nt-link{white-space:nowrap;font-weight:500}"
    + ".nt-toast-x{flex:none;display:grid;place-items:center;width:34px;height:34px;border:0;border-radius:8px;background:none;color:var(--ink-2);cursor:pointer}"
    + ".nt-toast-x:hover{background:var(--surface-2,rgba(127,127,127,.12))}"
    + ".nt-toast-x svg{width:16px;height:16px}"
    + "@media (max-width:520px){.nt-in{padding:16px 16px 18px}.nt-title{font-size:18px}.nt-toast{left:12px;right:12px;bottom:12px;transform:none;width:auto;flex-wrap:wrap}.nt-toast-text{flex:1 1 60%}}";

  var ICON_NOTE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3.5h12a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H4A1.5 1.5 0 0 1 2.5 13V5A1.5 1.5 0 0 1 4 3.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 7.5h8M6 10.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var ICON_X = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  (function injectCSS() {
    if (document.getElementById("nt-css")) return;
    var s = document.createElement("style");
    s.id = "nt-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  })();

  /* ---------- buttons and footers the pages draw ---------- */
  window.shamanNoteButton = function (opts) {
    opts = opts || {};
    var attrs = "";
    ["slot", "label", "item", "about", "kind"].forEach(function (k) {
      if (opts[k]) attrs += " data-note-" + k + '="' + esc(opts[k]) + '"';
    });
    var subject = opts.label || opts.about || "";
    var aria = subject ? ' aria-label="Note to admin about ' + esc(subject) + '"' : "";
    return '<button type="button" class="' + (opts.link ? "nt-link" : "nt-open") + '" data-note' + attrs + aria + ">" + ICON_NOTE + esc(opts.text || "Note to admin") + "</button>";
  };

  function footInner(prompt) {
    var st = loadStore();
    var count = st.list.length;
    var updates = st.list.filter(function (n) { return isUpdate(n, st); }).length;
    return (prompt ? esc(prompt) + " " : "") + window.shamanNoteButton({ link: true, text: "Send a note to the admin" })
      + (count
        ? '<span class="nt-sep" aria-hidden="true"> · </span><button type="button" class="nt-link" data-note-mine>Your notes (' + count + ")"
          + (updates ? ' <span class="nt-badge">' + updates + (updates === 1 ? " update" : " updates") + "</span>" : "") + "</button>"
        : "");
  }
  // "Spotted a mistake? Send a note to the admin · Your notes (2)" for the bottom of a page.
  window.shamanNoteFooter = function (prompt) {
    return '<p class="nt-foot" data-note-footer="' + esc(prompt || "") + '">' + footInner(prompt || "") + "</p>";
  };
  function refreshFooters() {
    var els = document.querySelectorAll(".nt-foot[data-note-footer]");
    for (var i = 0; i < els.length; i++) els[i].innerHTML = footInner(els[i].getAttribute("data-note-footer"));
  }

  /* ---------- the dialog ---------- */
  var dlg = null;
  var ctx = null;
  var opener = null;
  var drafts = {};
  var sending = false;
  var mode = "";

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "nt";
    dlg.setAttribute("aria-labelledby", "nt-title");
    dlg.setAttribute("aria-describedby", "nt-about");
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) {
      // A tap on the dimmed area outside the box closes it. Any draft is kept.
      if (e.target === dlg) {
        var r = dlg.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) close();
        return;
      }
      var t = e.target.closest ? e.target.closest("button") : null;
      if (!t) return;
      if (t.hasAttribute("data-nt-close")) close();
      else if (t.hasAttribute("data-note-new")) openForm({ page: page(), kind: "wrong" }, opener);
    });
    dlg.addEventListener("close", function () {
      mode = "";
      if (opener && document.contains(opener)) { try { opener.focus({ preventScroll: true }); } catch (e) { opener.focus(); } }
    });
    dlg.addEventListener("cancel", function (e) { if (sending) e.preventDefault(); });
    dlg.addEventListener("input", function (e) {
      if (e.target.id === "nt-text") {
        drafts[key()] = e.target.value;
        var c = document.getElementById("nt-count");
        if (c) c.textContent = e.target.value.length + " / " + MAX;
      }
    });
    dlg.addEventListener("change", function (e) {
      if (e.target.name === "nt-kind") {
        var k = KINDS.filter(function (x) { return x[0] === e.target.value; })[0];
        var t = document.getElementById("nt-text");
        if (k && t) t.setAttribute("placeholder", k[2]);
        ctx.kind = e.target.value;
      }
    });
    dlg.addEventListener("submit", function (e) {
      e.preventDefault();
      send();
    });
  }
  function show() {
    if (dlg.open) return;
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
  }
  function close() {
    if (!dlg || sending) return;
    if (typeof dlg.close === "function" && dlg.open) dlg.close();
    else { dlg.removeAttribute("open"); mode = ""; if (opener) opener.focus(); }
  }

  function key() { return ctx ? [ctx.page, ctx.slot, ctx.about, ctx.label].join("|") : ""; }
  function aboutText(c) {
    var parts = [PAGE_LABEL[c.page] || "This site"];
    if (c.label) parts.push(c.label);
    if (c.about) parts.push(c.about);
    var build = [c.lvl ? "Level " + c.lvl : "", RACE_LABEL[c.race] || "", SPEC_LABEL[c.spec] || ""].filter(Boolean).join(" ");
    if (build) parts.push(build);
    return parts.join(" · ") + (c.item ? " · current pick: " + c.item : "");
  }
  function topicFor(c) {
    if (c.label) return c.page === "gear" ? "the " + c.label + " slot" : c.label;
    if (c.about) return c.about;
    return PAGE_THE[c.page] || "the site";
  }

  function formHTML() {
    var kind = ctx.kind || "better";
    var hint = (KINDS.filter(function (x) { return x[0] === kind; })[0] || KINDS[0])[2];
    var name = (get(NAME_KEY) || "").slice(0, 40);
    var draft = drafts[key()] || "";
    var mine = loadStore().list.length;
    return '<form class="nt-in" novalidate>'
      + '<div class="nt-top"><div><h2 class="nt-title" id="nt-title">Note to admin</h2><p class="nt-about" id="nt-about">About: ' + esc(aboutText(ctx)) + "</p></div>"
      + '<button type="button" class="nt-x" data-nt-close aria-label="Close">' + ICON_X + "</button></div>"
      + '<fieldset><legend>What kind of note?</legend><div class="nt-kinds">'
      + KINDS.map(function (k) {
        return '<label class="nt-kind"><input type="radio" name="nt-kind" value="' + k[0] + '"' + (k[0] === kind ? " checked" : "") + "><span>" + esc(k[1]) + "</span></label>";
      }).join("")
      + "</div></fieldset>"
      + '<div class="nt-field"><label for="nt-text">Your note</label>'
      + '<textarea id="nt-text" rows="5" maxlength="' + MAX + '" placeholder="' + esc(hint) + '">' + esc(draft) + "</textarea>"
      + '<p class="nt-count" id="nt-count" aria-hidden="true">' + draft.length + " / " + MAX + "</p></div>"
      + '<div class="nt-field"><label for="nt-name">Your name <small>(optional)</small></label>'
      + '<input class="nt-name" id="nt-name" type="text" maxlength="40" autocomplete="nickname" value="' + esc(name) + '"></div>'
      + '<input class="nt-trap" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">'
      + '<p class="nt-fine">Only the site’s admin sees notes. With your note they see your name, if you add one, and what it’s about. Their reply shows up under “Your notes” at the bottom of each page.</p>'
      + '<p class="nt-msg" id="nt-msg" role="alert"></p>'
      + '<div class="nt-actions"><button type="submit" class="nt-btn nt-btn-primary" id="nt-send">Send note</button><button type="button" class="nt-btn" data-nt-close>Cancel</button>'
      + (mine ? '<button type="button" class="nt-link" data-note-mine>Your notes (' + mine + ")</button>" : "") + "</div>"
      + "</form>";
  }

  function doneHTML() {
    return '<div class="nt-in nt-done"><h2 class="nt-title" id="nt-title">' + ICON_OK + "Sent. Thanks!</h2>"
      + '<p id="nt-about">The admin will take a look. When they reply or mark it done, you’ll see it under “Your notes” at the bottom of each page.</p>'
      + '<div class="nt-actions"><button type="button" class="nt-btn" id="nt-ok" data-nt-close>Close</button><button type="button" class="nt-link" data-note-mine>Your notes</button></div></div>';
  }

  function listHTML(st, updated) {
    if (!st.list.length) return '<p class="nt-empty">You haven’t sent any notes from this browser yet.</p>';
    return '<ol class="nt-list">' + st.list.map(function (n) {
      var status = n.gone ? "gone" : (STATUS_SHORT[n.status] ? n.status : "new");
      var isNew = !!updated[n.id];
      return '<li class="nt-li s-' + status + (isNew ? " is-update" : "") + '">'
        + '<div class="nt-li-head"><span class="nt-chip s-' + status + '">' + esc(STATUS_SHORT[status]) + "</span>"
        + (isNew ? '<span class="nt-updated">Updated</span>' : "")
        + "<span>" + esc((KIND_SHORT[n.kind] || "Note") + (n.topic ? " · " + n.topic : "")) + "</span>"
        + '<span class="nt-li-date">' + esc(shortDate(n.t)) + "</span></div>"
        + (n.excerpt ? '<p class="nt-li-text">' + esc(n.excerpt) + "</p>" : "")
        + (n.reply && !n.gone ? '<div class="nt-reply"><p class="nt-reply-head">Reply from the admin' + (n.reply_at ? " · " + esc(shortDate(n.reply_at)) : "") + '</p><p class="nt-reply-text">' + esc(n.reply) + "</p></div>" : "")
        + "</li>";
    }).join("") + "</ol>";
  }
  function mineHTML(st, updated) {
    return '<div class="nt-in">'
      + '<div class="nt-top"><div><h2 class="nt-title" id="nt-title" tabindex="-1">Your notes</h2><p class="nt-about" id="nt-about">Notes sent from this browser, newest first. The admin’s replies show up here.</p></div>'
      + '<button type="button" class="nt-x" data-nt-close aria-label="Close">' + ICON_X + "</button></div>"
      + '<div class="nt-mine-body">' + listHTML(st, updated) + "</div>"
      + '<p class="nt-fine" id="nt-mine-when" role="status" aria-live="polite">' + (st.list.length ? "Checking for replies…" : "") + "</p>"
      + '<div class="nt-actions"><button type="button" class="nt-btn nt-btn-primary" data-note-new>Write a new note</button><button type="button" class="nt-btn" data-nt-close>Close</button></div>'
      + "</div>";
  }

  function openFor(btn) {
    var d = btn.dataset || {};
    openForm({
      page: page(),
      slot: d.noteSlot || "",
      label: d.noteLabel || "",
      item: d.noteItem || "",
      about: d.noteAbout || "",
      kind: d.noteKind || (d.noteSlot || d.noteAbout ? "better" : "wrong")
    }, btn);
  }
  function openForm(c, from) {
    if (!dlg) build();
    hideToast();
    opener = from || opener;
    var extra = {};
    try { if (typeof window.shamanNoteContext === "function") extra = window.shamanNoteContext() || {}; } catch (e) { extra = {}; }
    ctx = {
      page: c.page || page(),
      slot: c.slot || "",
      label: c.label || "",
      item: c.item || "",
      about: c.about || extra.about || "",
      kind: c.kind || "wrong",
      lvl: Number(extra.lvl) || 0,
      spec: extra.spec || "",
      race: extra.race || (window.SITE && window.SITE.racePicked && window.SITE.racePicked() ? window.SITE.race() : "")
    };
    mode = "form";
    sending = false;
    dlg.innerHTML = formHTML();
    show();
    var t = document.getElementById("nt-text");
    if (t) {
      t.focus();
      t.setSelectionRange(t.value.length, t.value.length);
    }
  }

  function openMine(from) {
    if (!dlg) build();
    hideToast();
    if (!dlg.open) opener = from || document.activeElement;
    mode = "mine";
    sending = false;
    var st = loadStore();
    var updated = {};
    st.list.forEach(function (n) { if (isUpdate(n, st)) updated[n.id] = 1; });
    dlg.innerHTML = mineHTML(st, updated);
    show();
    var title = document.getElementById("nt-title");
    if (title) title.focus();
    if (!st.list.length) return;
    check(true).then(function (fresh) {
      if (mode !== "mine" || !dlg.open) return;
      fresh.list.forEach(function (n) { if (isUpdate(n, fresh)) updated[n.id] = 1; });
      var body = dlg.querySelector(".nt-mine-body");
      if (body) body.innerHTML = listHTML(fresh, updated);
      var when = document.getElementById("nt-mine-when");
      if (when) when.textContent = fresh.checkedAt && Date.now() - fresh.checkedAt < 5000 ? "Up to date." : "Couldn’t check for new replies just now. Showing what this browser saw last.";
      // Opening the list counts as seeing every update in it.
      fresh.list.forEach(function (n) { fresh.seen[n.id] = stamp(n); fresh.told[n.id] = stamp(n); });
      saveStore(fresh);
      refreshFooters();
    });
  }

  function send() {
    if (sending) return;
    var textEl = document.getElementById("nt-text");
    var nameEl = document.getElementById("nt-name");
    var msg = document.getElementById("nt-msg");
    var btn = document.getElementById("nt-send");
    var trap = dlg.querySelector("input[name=website]");
    var text = textEl.value.trim();
    if (text.length < 3) {
      msg.textContent = text ? ERR.too_short : "Write your note first.";
      textEl.focus();
      return;
    }
    var body = {
      text: text,
      kind: ctx.kind,
      page: ctx.page,
      name: nameEl.value.trim().slice(0, 40),
      ctx: { lvl: ctx.lvl, spec: ctx.spec, race: ctx.race, slot: ctx.slot, label: ctx.label, item: ctx.item, about: ctx.about },
      website: trap ? trap.value : ""
    };
    // Browsers that chose "Don't count me" send their note without the browser ID.
    var vid = get(VID_KEY);
    if (get(OFF_KEY) !== "1" && vid && /^[a-z0-9]{12,40}$/i.test(vid)) body.vid = vid;
    var sentCtx = ctx;
    sending = true;
    msg.textContent = "";
    btn.disabled = true;
    btn.textContent = "Sending…";
    window.fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin"
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { status: r.status, json: j || {} }; });
    }).then(function (r) {
      sending = false;
      if (r.status === 201 && r.json.ok) {
        delete drafts[key()];
        if (r.json.id && r.json.tk) {
          var st = loadStore();
          st.list.push({
            id: r.json.id, tk: r.json.tk, t: Date.now(), kind: sentCtx.kind, topic: topicFor(sentCtx),
            excerpt: text.slice(0, 240), status: "new", status_at: 0, reply: "", reply_at: 0
          });
          st.seen[r.json.id] = FIRST;
          st.told[r.json.id] = FIRST;
          saveStore(st);
          refreshFooters();
        }
        mode = "done";
        dlg.innerHTML = doneHTML();
        var ok = document.getElementById("nt-ok");
        if (ok) ok.focus();
        return;
      }
      btn.disabled = false;
      btn.textContent = "Send note";
      msg.textContent = ERR[r.json.error] || (r.status === 429 ? ERR.busy : ERR.failed);
    }).catch(function () {
      sending = false;
      btn.disabled = false;
      btn.textContent = "Send note";
      msg.textContent = ERR.offline;
    });
  }

  /* ---------- the one-time notice ---------- */
  var toastEl = null;
  function toast(text) {
    hideToast();
    toastEl = document.createElement("div");
    toastEl.className = "nt-toast";
    toastEl.setAttribute("role", "status");
    document.body.appendChild(toastEl);
    // Filled a moment later so screen readers announce it.
    setTimeout(function () {
      if (!toastEl) return;
      toastEl.innerHTML = ICON_NOTE + '<span class="nt-toast-text">' + esc(text) + "</span>"
        + '<button type="button" class="nt-link" data-note-mine>See your notes</button>'
        + '<button type="button" class="nt-toast-x" aria-label="Dismiss">' + ICON_X + "</button>";
    }, 60);
  }
  function hideToast() {
    if (toastEl && toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    toastEl = null;
  }
  function lookForUpdates() {
    check(false).then(function (st) {
      refreshFooters();
      var fresh = st.list.filter(function (n) { return isUpdate(n, st) && st.told[n.id] !== stamp(n); });
      if (!fresh.length) return;
      fresh.forEach(function (n) { st.told[n.id] = stamp(n); });
      saveStore(st);
      toast(updateText(fresh));
    });
  }

  /* ---------- wiring ---------- */
  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var mine = t.closest("[data-note-mine]");
    if (mine) { e.preventDefault(); openMine(mine.closest(".nt") ? null : mine); return; }
    var x = t.closest(".nt-toast-x");
    if (x) { hideToast(); return; }
    var btn = t.closest("[data-note]");
    if (btn) { e.preventDefault(); openFor(btn); }
  });
  window.addEventListener("storage", function (e) { if (e.key === STORE_KEY) refreshFooters(); });
  function start() {
    refreshFooters();
    lookForUpdates();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
