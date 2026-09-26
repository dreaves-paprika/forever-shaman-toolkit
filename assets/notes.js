/* Forever Shaman Toolkit: "Note to admin". Any button with data-note opens a small form that sends
   the site's admin a note: a better option, something that's wrong, or an idea.
   Buttons can add context with data-note-slot, data-note-label, data-note-item, data-note-about
   and data-note-kind. A page can also set window.shamanNoteContext() to return { lvl, spec, about }.
   Load it in the <head> so the button styles are there before the page draws. */
(function () {
  "use strict";
  var ENDPOINT = "/api/note";
  var VID_KEY = "forever-shaman20:vid";
  var OFF_KEY = "forever-shaman20:notrack";
  var NAME_KEY = "forever-shaman20:name";
  var MAX = 1000;
  var PAGE_LABEL = { home: "Home page", checklist: "Checklist", gear: "Gear guide", dungeons: "Dungeon planner", party: "Party board" };
  var SPEC_LABEL = { enh: "Enhancement", ele: "Elemental", resto: "Restoration" };
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
  function page() { return document.documentElement.getAttribute("data-page") || "home"; }

  var CSS = ""
    + ".nt-open{display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 8px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--ink-2);font:inherit;font-size:13.5px;line-height:1.3;cursor:pointer;white-space:nowrap}"
    + ".nt-open:hover{border-color:var(--accent);color:var(--ink)}"
    + ".nt-open svg,.nt-link svg{flex:none;width:14px;height:14px}"
    + ".nt-link{display:inline-flex;align-items:center;gap:6px;padding:0;border:0;background:none;color:var(--accent);font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}"
    + ".nt-open:focus-visible,.nt-link:focus-visible,.nt :focus-visible{outline:2px solid var(--focus,var(--accent));outline-offset:2px}"
    + ".nt{width:min(540px,calc(100vw - 24px));max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);margin:auto;padding:0;border:1px solid var(--line);border-radius:18px;background:var(--surface);color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.28);overflow:auto;overscroll-behavior:contain}"
    + ".nt::backdrop{background:rgba(10,15,20,.55)}"
    + ".nt-in{display:grid;gap:14px;padding:20px 22px 22px}"
    + ".nt-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}"
    + ".nt-title{margin:0;font-size:20px;font-weight:700;line-height:1.25}"
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
    + ".nt-actions{display:flex;flex-wrap:wrap;gap:8px}"
    + ".nt-btn{height:42px;padding:0 18px;border:1px solid var(--line-strong);border-radius:10px;background:var(--surface);color:var(--ink);font:inherit;font-size:15.5px;font-weight:500;cursor:pointer}"
    + ".nt-btn:hover{border-color:var(--accent)}"
    + ".nt-btn-primary{background:var(--accent);border-color:var(--accent);color:var(--surface)}"
    + ".nt-btn:disabled{opacity:.6;cursor:default}"
    + ".nt-done{display:grid;gap:10px;justify-items:start}"
    + ".nt-done p{margin:0;color:var(--ink-2)}"
    + ".nt-done .nt-title{display:flex;align-items:center;gap:10px}"
    + ".nt-done .nt-title svg{width:24px;height:24px;color:var(--ok,#2C7A4B)}"
    + "@media (max-width:480px){.nt-in{padding:16px 16px 18px}.nt-title{font-size:18px}}";

  var ICON_NOTE = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 3.5h12a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4 3v-3H4A1.5 1.5 0 0 1 2.5 13V5A1.5 1.5 0 0 1 4 3.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M6 7.5h8M6 10.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var ICON_X = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Pages draw their buttons with this, so every note button looks and reads the same.
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

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  (function injectCSS() {
    if (document.getElementById("nt-css")) return;
    var s = document.createElement("style");
    s.id = "nt-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  })();

  var dlg = null;
  var ctx = null;
  var opener = null;
  var drafts = {};
  var sending = false;

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "nt";
    dlg.setAttribute("aria-labelledby", "nt-title");
    dlg.setAttribute("aria-describedby", "nt-about");
    document.body.appendChild(dlg);
    dlg.addEventListener("click", function (e) {
      // A tap on the dimmed area outside the box closes it. The draft is kept.
      if (e.target === dlg) {
        var r = dlg.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) close();
      }
    });
    dlg.addEventListener("close", function () {
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
    dlg.addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-nt-close]") : null;
      if (b) close();
    });
  }

  function key() { return ctx ? [ctx.page, ctx.slot, ctx.about, ctx.label].join("|") : ""; }

  function aboutText(c) {
    var parts = [PAGE_LABEL[c.page] || "This site"];
    if (c.label) parts.push(c.label);
    if (c.about) parts.push(c.about);
    var build = [c.lvl ? "Level " + c.lvl : "", SPEC_LABEL[c.spec] || ""].filter(Boolean).join(" ");
    if (build) parts.push(build);
    return parts.join(" · ") + (c.item ? " · current pick: " + c.item : "");
  }

  function formHTML() {
    var kind = ctx.kind || "better";
    var hint = (KINDS.filter(function (x) { return x[0] === kind; })[0] || KINDS[0])[2];
    var name = (get(NAME_KEY) || "").slice(0, 40);
    var draft = drafts[key()] || "";
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
      + '<p class="nt-fine">Only the site’s admin sees notes. With your note they see your name, if you add one, and what it’s about.</p>'
      + '<p class="nt-msg" id="nt-msg" role="alert"></p>'
      + '<div class="nt-actions"><button type="submit" class="nt-btn nt-btn-primary" id="nt-send">Send note</button><button type="button" class="nt-btn" data-nt-close>Cancel</button></div>'
      + "</form>";
  }

  function doneHTML() {
    return '<div class="nt-in nt-done"><h2 class="nt-title" id="nt-title">' + ICON_OK + "Sent. Thanks!</h2>"
      + '<p id="nt-about">The admin will take a look. If it’s a fix, it shows up on the site once it’s made.</p>'
      + '<button type="button" class="nt-btn" id="nt-ok" data-nt-close>Close</button></div>';
  }

  function openFor(btn) {
    if (!dlg) build();
    opener = btn;
    var d = btn.dataset || {};
    var extra = {};
    try { if (typeof window.shamanNoteContext === "function") extra = window.shamanNoteContext() || {}; } catch (e) { extra = {}; }
    ctx = {
      page: page(),
      slot: d.noteSlot || "",
      label: d.noteLabel || "",
      item: d.noteItem || "",
      about: d.noteAbout || extra.about || "",
      kind: d.noteKind || (d.noteSlot || d.noteAbout ? "better" : "wrong"),
      lvl: Number(extra.lvl) || 0,
      spec: extra.spec || ""
    };
    sending = false;
    dlg.innerHTML = formHTML();
    if (typeof dlg.showModal === "function") dlg.showModal();
    else dlg.setAttribute("open", "");
    var t = document.getElementById("nt-text");
    if (t) {
      t.focus();
      t.setSelectionRange(t.value.length, t.value.length);
    }
  }

  function close() {
    if (!dlg || sending) return;
    if (typeof dlg.close === "function" && dlg.open) dlg.close();
    else { dlg.removeAttribute("open"); if (opener) opener.focus(); }
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
      ctx: { lvl: ctx.lvl, spec: ctx.spec, slot: ctx.slot, label: ctx.label, item: ctx.item, about: ctx.about },
      website: trap ? trap.value : ""
    };
    // Browsers that chose "Don't count me" send their note without the browser ID.
    var vid = get(VID_KEY);
    if (get(OFF_KEY) !== "1" && vid && /^[a-z0-9]{12,40}$/i.test(vid)) body.vid = vid;
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

  document.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest ? e.target.closest("[data-note]") : null;
    if (!btn) return;
    e.preventDefault();
    openFor(btn);
  });
})();
