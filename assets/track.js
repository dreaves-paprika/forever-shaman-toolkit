/* Forever Shaman Toolkit: simple first-party visit stats and the optional name box.
   Sends: a random browser ID, the page opened, a short progress summary and, if given, a name.
   The server adds rough location and device type. No cookies, and no IP addresses are stored. */
(function () {
  "use strict";
  var VID_KEY = "forever-shaman20:vid";
  var OFF_KEY = "forever-shaman20:notrack";
  var NAME_KEY = "forever-shaman20:name";
  var ENDPOINT = "/api/track";
  var PAGE = document.documentElement.getAttribute("data-page") || "home";

  function get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v) {
    try {
      if (v === null || v === undefined || v === "") window.localStorage.removeItem(k);
      else window.localStorage.setItem(k, v);
      return true;
    } catch (e) { return false; }
  }

  function randomId() {
    try {
      if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID().replace(/-/g, "");
      var a = new Uint8Array(16);
      window.crypto.getRandomValues(a);
      var s = "";
      for (var i = 0; i < a.length; i++) s += ("0" + a[i].toString(16)).slice(-2);
      return s;
    } catch (e) {
      var t = "";
      for (var j = 0; j < 32; j++) t += Math.floor(Math.random() * 16).toString(16);
      return t;
    }
  }
  var memoryId = null;
  function vid() {
    var v = get(VID_KEY);
    if (v && /^[a-z0-9]{12,40}$/i.test(v)) return v;
    v = randomId();
    if (put(VID_KEY, v)) return v;
    memoryId = memoryId || v;
    return memoryId;
  }
  function counting() { return get(OFF_KEY) !== "1"; }
  function myName() { return (get(NAME_KEY) || "").slice(0, 40); }

  function send(payload, force) {
    if (!force && !counting()) return;
    payload.vid = vid();
    payload.page = PAGE;
    var body = JSON.stringify(payload);
    try {
      window.fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true,
        credentials: "same-origin"
      }).catch(function () { /* stats are best-effort */ });
    } catch (e) {
      try { navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" })); } catch (e2) { /* ignore */ }
    }
  }

  var pending = null;
  var timer = 0;
  function flush() {
    clearTimeout(timer);
    if (!pending) return;
    send({ type: "state", data: pending });
    pending = null;
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("pagehide", flush);

  function referrer() {
    try {
      if (!document.referrer) return "";
      var u = new URL(document.referrer);
      return u.host === location.host ? "" : u.hostname;
    } catch (e) { return ""; }
  }

  var viewed = false;
  var commands = {
    view: function (data) {
      if (viewed) return;
      viewed = true;
      send({ type: "view", ref: referrer(), name: myName() || undefined, data: data || undefined });
    },
    state: function (data) {
      if (!data) return;
      pending = data;
      clearTimeout(timer);
      timer = setTimeout(flush, 4000);
    }
  };

  function run(args) {
    var fn = commands[args[0]];
    if (fn) { try { fn(args[1]); } catch (e) { /* never break the page */ } }
  }
  var queued = window.shamanTrackQ || [];
  window.shamanTrack = function () { run(arguments); };
  window.shamanTrackQ = [];
  for (var q = 0; q < queued.length; q++) run(queued[q]);

  /* ---------- the optional name box ---------- */
  var CSS = ""
    + ".st-who{display:grid;gap:10px;color:var(--ink-2)}"
    + ".st-who p{margin:0;max-width:72ch}"
    + ".st-who-title{font-weight:700;color:var(--ink)}"
    + ".st-who-form{display:flex;flex-wrap:wrap;gap:8px;align-items:center}"
    + ".st-who-form label{flex:1 1 100%;color:var(--ink)}"
    + ".st-who input{flex:1 1 180px;max-width:300px;min-width:0;height:40px;padding:0 12px;border:1px solid var(--line-strong);border-radius:10px;background:var(--surface);color:var(--ink);font:inherit;font-size:16px}"
    + ".st-who input::placeholder{color:var(--ink-3)}"
    + ".st-btn{height:40px;padding:0 16px;border:1px solid var(--line-strong);border-radius:10px;background:var(--surface);color:var(--ink);font:inherit;font-size:15px;font-weight:500;cursor:pointer}"
    + ".st-btn:hover{border-color:var(--accent)}"
    + ".st-btn-primary{background:var(--accent);border-color:var(--accent);color:var(--surface)}"
    + ".st-link{display:inline;padding:0;border:0;background:none;color:var(--accent);font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}"
    + ".st-who :focus-visible{outline:2px solid var(--focus,var(--accent));outline-offset:2px}"
    + ".st-who-fine{font-size:.92em;color:var(--ink-3)}"
    + ".st-who-note{font-size:.92em;color:var(--ink-2)}"
    + ".st-who-note:empty{margin-top:-10px}";

  function injectCSS() {
    if (document.getElementById("st-who-css")) return;
    var s = document.createElement("style");
    s.id = "st-who-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  var uid = 0;
  function render(box, note) {
    box.textContent = "";
    box.className = (box.className.replace(/\bst-who\b/g, "") + " st-who").trim();
    var name = myName();

    if (!counting()) {
      var off = el("p");
      off.appendChild(document.createTextNode("Visits from this browser aren’t counted in the site’s stats. "));
      var back = el("button", { type: "button", "class": "st-link" }, "Count me again");
      back.addEventListener("click", function () {
        put(OFF_KEY, null);
        viewed = false;
        commands.view();
        renderAll("You’re counted again.");
      });
      off.appendChild(back);
      box.appendChild(off);
    } else if (name) {
      var named = el("p");
      named.appendChild(document.createTextNode("You’re on the list as "));
      named.appendChild(el("strong", null, name));
      named.appendChild(document.createTextNode(". "));
      var change = el("button", { type: "button", "class": "st-link" }, "Change");
      change.addEventListener("click", function () { renderForm(box, name); });
      var remove = el("button", { type: "button", "class": "st-link" }, "Remove my name");
      remove.addEventListener("click", function () {
        put(NAME_KEY, null);
        send({ type: "name", name: "" });
        renderAll("Your name is removed.");
      });
      named.appendChild(change);
      named.appendChild(document.createTextNode(" · "));
      named.appendChild(remove);
      box.appendChild(named);
    } else {
      renderForm(box, "");
      return;
    }
    finish(box, note);
  }

  function renderForm(box, current) {
    box.textContent = "";
    var id = "st-who-name-" + (++uid);
    var form = el("form", { "class": "st-who-form", novalidate: "" });
    var label = el("label", { "for": id });
    label.appendChild(el("span", { "class": "st-who-title" }, "Add your name"));
    label.appendChild(document.createTextNode(" (optional), so the friend who shared this can see you’re using it."));
    var input = el("input", { id: id, type: "text", maxlength: "40", autocomplete: "nickname", placeholder: "Your name or character", value: current });
    var save = el("button", { type: "submit", "class": "st-btn st-btn-primary" }, "Save");
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(save);
    if (current) {
      var cancel = el("button", { type: "button", "class": "st-btn" }, "Cancel");
      cancel.addEventListener("click", function () { render(box); });
      form.appendChild(cancel);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value.replace(/[\u0000-\u001f\u007f<>]/g, "").replace(/\s+/g, " ").trim().slice(0, 40);
      if (!v) { input.focus(); return; }
      put(NAME_KEY, v);
      send({ type: "name", name: v });
      renderAll("Thanks, " + v + ".");
    });
    box.appendChild(form);
    finish(box, "");
    if (current) input.focus();
  }

  function finish(box, note) {
    if (counting()) {
      var fine = el("p", { "class": "st-who-fine" });
      fine.appendChild(document.createTextNode("About stats: this site notes which pages you open, your build and how far along you are, plus your rough location and device type, so its owner can see who uses it. No ads, nothing sold, and IP addresses aren’t stored. "));
      var stop = el("button", { type: "button", "class": "st-link" }, "Don’t count me");
      stop.addEventListener("click", function () {
        flush();
        send({ type: "forget" }, true);
        put(OFF_KEY, "1");
        renderAll("Done. This browser isn’t counted, and its past visits are removed.");
      });
      fine.appendChild(stop);
      box.appendChild(fine);
    }
    var live = el("p", { "class": "st-who-note", role: "status", "aria-live": "polite" });
    box.appendChild(live);
    if (note) setTimeout(function () { live.textContent = note; }, 30);
  }

  function renderAll(note) {
    var boxes = document.querySelectorAll("[data-whoami]");
    for (var i = 0; i < boxes.length; i++) render(boxes[i], note);
  }

  function mountNew() {
    var boxes = document.querySelectorAll("[data-whoami]:not([data-st-mounted])");
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].setAttribute("data-st-mounted", "1");
      render(boxes[i]);
    }
  }

  function start() {
    injectCSS();
    mountNew();
    // The tool pages redraw their footers, so fill any new name box that appears.
    if (window.MutationObserver) {
      var queuedMount = false;
      new MutationObserver(function () {
        if (queuedMount) return;
        queuedMount = true;
        (window.requestAnimationFrame || setTimeout)(function () { queuedMount = false; mountNew(); });
      }).observe(document.body, { childList: true, subtree: true });
    }
    window.addEventListener("storage", function (e) {
      if (e.key === NAME_KEY || e.key === OFF_KEY) renderAll();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
