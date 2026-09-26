/* Forever Shaman Toolkit: which level cap is live, which level this visitor is viewing,
   and small storage helpers shared by every page. Load it before the page's own script. */
(function () {
  "use strict";
  var CAP_KEY = "forever-shaman20:cap";          // the live cap, last time we asked the server
  var LVL_KEY = "forever-shaman20:lvl";          // the level this visitor chose to view
  var PREVIEW_KEY = "forever-shaman20:preview";  // this tab previews level 30 before it goes live

  function get(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function set(store, k, v) {
    try {
      if (v === null || v === undefined) window[store].removeItem(k);
      else window[store].setItem(k, String(v));
      return true;
    } catch (e) { return false; }
  }

  var cap = get("localStorage", CAP_KEY) === "30" ? 30 : 20;
  var m = /[?&]preview=(30|off)(?:&|$)/.exec(location.search);
  if (m) set("sessionStorage", PREVIEW_KEY, m[1] === "off" ? null : "30");
  var preview = get("sessionStorage", PREVIEW_KEY) === "30";

  var listeners = [];
  function fire() {
    for (var i = 0; i < listeners.length; i++) {
      try { listeners[i](); } catch (e) { /* keep going */ }
    }
  }
  function max() { return cap >= 30 || preview ? 30 : 20; }
  function level() {
    var v = Number(get("localStorage", LVL_KEY));
    if (v !== 20 && v !== 30) v = max();
    return Math.min(v, max());
  }

  window.SITE = {
    get cap() { return cap; },
    get preview() { return preview && cap < 30; },
    max: max,
    level: level,
    levels: function () { return max() >= 30 ? [20, 30] : [20]; },
    setLevel: function (v) {
      v = Number(v) === 30 ? 30 : 20;
      set("localStorage", LVL_KEY, v);
      fire();
    },
    onChange: function (fn) { listeners.push(fn); },
    get: function (k) { return get("localStorage", k); },
    set: function (k, v) { return set("localStorage", k, v); },
    getJSON: function (k) {
      try { var raw = get("localStorage", k); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    }
  };

  // Ask the server which cap is live (the answer is cached at the edge for about a minute).
  try {
    window.fetch("/api/config", { credentials: "same-origin" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || j.fallback) return;
        var c = Number(j.cap) === 30 ? 30 : 20;
        if (c !== cap) {
          cap = c;
          set("localStorage", CAP_KEY, c);
          fire();
        }
      })
      .catch(function () { /* keep the last known cap */ });
  } catch (e) { /* old browser */ }
})();
