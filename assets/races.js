/* Shaman Forever TL;DR: the race picker every page shows near the top.
   Load it after site.js. Pages call window.racePickerHTML() when they draw, and any radio named
   "race" (outside a read-only shared view) switches the race for every page on this site. */
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  var CSS = ""
    + ".rp{margin:0;padding:0;border:0;min-width:0;display:grid;gap:8px;container-type:inline-size;container-name:rp}"
    + ".rp-title{margin:0;font-family:var(--font-mono);font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}"
    + ".rp-groups{display:grid;gap:8px}"
    // Each faction group is its own size container, so its four-across Horde row (below) can turn
    // on for a group that's wide even when the picker as a whole isn't (the stacked layout).
    + ".rp-group{display:grid;grid-template-columns:minmax(0,1fr);gap:4px;min-width:0;container-type:inline-size}"
    + ".rp-fac{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--fc)}"
    + ".rp-group[data-fac=a]{--fc:var(--alliance,#2458B3);--fs:var(--alliance-soft,#DDE7F8)}"
    + ".rp-group[data-fac=h]{--fc:var(--horde,#A3262A);--fs:var(--horde-soft,#F6DEDD)}"
    // One Alliance race and four Horde races: the lone Dwarf button spans the full row instead of
    // sitting one-third or one-quarter width with empty space beside it, and the Horde four sit two
    // by two until their group has room for a single row of four (see the container rule below).
    + ".rp-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}"
    + ".rp-group[data-count=\"1\"] .rp-opts{grid-template-columns:minmax(0,1fr)}"
    + "@container (min-width:420px){.rp-group[data-count=\"4\"] .rp-opts{grid-template-columns:repeat(4,minmax(0,1fr))}}"
    // Once the picker itself has room, put the two faction groups side by side on one row instead
    // of stacked: Alliance gets a fifth of the width and Horde the rest, so with Horde's four across
    // (forced here, since its own column may still fall just short of the rule above) all five
    // buttons land at (nearly) the same width. Named so this queries .rp itself, not the nearer
    // .rp-group container.
    + "@container rp (min-width:520px){.rp-groups{grid-template-columns:1fr 4fr}.rp-group[data-count=\"4\"] .rp-opts{grid-template-columns:repeat(4,minmax(0,1fr))}}"
    + ".rp-opt{position:relative;display:grid;cursor:pointer;min-width:0}"
    + ".rp-opt input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}"
    + ".rp-body{display:grid;justify-items:center;align-content:center;gap:0;padding:6px 4px;border:1px solid var(--line);border-radius:10px;background:var(--surface);text-align:center;transition:background .12s,border-color .12s}"
    + ".rp-name{font-size:14.5px;font-weight:500;line-height:1.2;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}"
    + ".rp-sub{font-size:11.5px;line-height:1.2;color:var(--ink-3);white-space:nowrap}"
    + ".rp-opt:hover .rp-body{border-color:var(--fc)}"
    + ".rp-opt input:checked + .rp-body{border-color:var(--fc);background:var(--fs)}"
    + ".rp-opt input:checked + .rp-body .rp-name{color:var(--fc);font-weight:700}"
    + ".rp-opt input:focus-visible + .rp-body{outline:2px solid var(--focus,var(--accent));outline-offset:2px}"
    + ".rp-opt input:disabled{cursor:default}"
    + ".rp-opt input:disabled:not(:checked) + .rp-body{opacity:.55}"
    + ".rp-hint{margin:0;font-size:13.5px;line-height:1.4;color:var(--warn,#9A5B00)}"
    + ".rp.is-big .rp-groups{gap:16px}"
    + ".rp.is-big .rp-group{grid-template-columns:minmax(0,1fr)}"
    + ".rp.is-big .rp-body{padding:12px 6px 10px;border-radius:14px}"
    + ".rp.is-big .rp-name{font-family:var(--font-display);font-size:19px;font-weight:400}"
    + ".rp.is-big .rp-opt input:checked + .rp-body .rp-name{font-weight:400}"
    + ".rp.is-big .rp-sub{font-size:12.5px}"
    + ".rp.is-big .rp-fac{font-size:12px}";

  (function injectCSS() {
    if (document.getElementById("rp-css")) return;
    var s = document.createElement("style");
    s.id = "rp-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  })();

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  var uid = 0;
  // opts: { race, readOnly, big, title, hint, subs }
  window.racePickerHTML = function (opts) {
    opts = opts || {};
    var cur = opts.race || S.race();
    var ro = !!opts.readOnly;
    var tid = "rp-title-" + (++uid);
    var subs = opts.subs || {};
    var groups = ["a", "h"].map(function (f) {
      var races = S.RACE_ORDER.filter(function (k) { return S.RACES[k].fac === f; });
      return '<div class="rp-group" data-fac="' + f + '" data-count="' + races.length + '"><span class="rp-fac">' + esc(S.FACTION[f]) + '</span><div class="rp-opts">'
        + races.map(function (k) {
          var r = S.RACES[k];
          // The compact picker keeps every button one line tall; the big one has room for a second line.
          var sub = subs[k] != null ? subs[k] : (opts.big && r.sub ? r.sub : "");
          return '<label class="rp-opt"><input type="radio" name="race" value="' + k + '"' + (k === cur ? " checked" : "") + (ro ? " disabled" : "")
            + ' aria-label="' + esc(r.name + (r.sub ? " (" + r.sub + ")" : "") + ", " + S.FACTION[f]) + '">'
            + '<span class="rp-body"><span class="rp-name">' + esc(r.name) + "</span>" + (sub ? '<span class="rp-sub">' + esc(sub) + "</span>" : "") + "</span></label>";
        }).join("") + "</div></div>";
    }).join("");
    var hint = "";
    if (!ro && !S.racePicked()) hint = opts.hint || ("Showing " + S.RACES[cur].name + ". Pick yours: it changes your trainers, quests and routes.");
    return '<div class="rp' + (opts.big ? " is-big" : "") + '" role="radiogroup" aria-labelledby="' + tid + '">'
      + '<p class="rp-title" id="' + tid + '">' + esc(opts.title || (ro ? "Their race" : "Your race")) + "</p>"
      + '<div class="rp-groups">' + groups + "</div>"
      + (hint ? '<p class="rp-hint">' + esc(hint) + "</p>" : "")
      + "</div>";
  };

  function pickRace(t) {
    if (!t || t.name !== "race" || t.disabled || !S.RACES[t.value]) return;
    var v = t.value;
    // Record the pick for the owner's stats. Pages with progress send a fuller summary right after.
    try { if (window.shamanTrack) window.shamanTrack("state", { race: v }); } catch (err) { /* stats are optional */ }
    S.setRace(v);
    // Pages redraw when the race changes, so put focus back on the new choice.
    var again = document.querySelector('input[name="race"][value="' + v + '"]:not([disabled])');
    if (again && again !== document.activeElement) { try { again.focus({ preventScroll: true }); } catch (err) { again.focus(); } }
  }
  document.addEventListener("change", function (e) { pickRace(e.target); });
  // The default race's radio renders pre-checked before anyone has picked (see racePickerHTML
  // above), so clicking that same option doesn't change its checked state and never fires
  // "change" natively. Without this, a visitor happy with the default could never dismiss the
  // "Showing X" hint. Catch that one case here; every other pick still goes through "change"
  // (including keyboard arrow-key selection, which never fires "click").
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || t.name !== "race" || t.tagName !== "INPUT" || t.disabled || !S.RACES[t.value]) return;
    if (!S.racePicked() && t.value === S.race()) pickRace(t);
  });
})();
