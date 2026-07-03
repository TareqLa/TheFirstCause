/* ============================================================
   DIE ERSTE URSACHE — shared interactions
   ============================================================ */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Starfield ---------- */
  var canvas = document.getElementById("stars");
  if (canvas && !reducedMotion) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var shooting = [];
    var w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }

    function initStars() {
      stars = [];
      var count = Math.min(260, Math.floor((w * h) / 4200));
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.15 + 0.25,
          base: Math.random() * 0.55 + 0.25,
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.0012 + 0.0004,
          drift: Math.random() * 0.02 + 0.005,
          gold: Math.random() < 0.12
        });
      }
    }

    function maybeShoot() {
      if (Math.random() < 0.004 && shooting.length < 2) {
        shooting.push({
          x: Math.random() * w * 0.8 + w * 0.1,
          y: Math.random() * h * 0.35,
          vx: -(Math.random() * 5 + 4),
          vy: Math.random() * 2.4 + 1.6,
          life: 1
        });
      }
    }

    var last = 0;
    function frame(t) {
      var dt = Math.min(t - last, 50);
      last = t;
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.phase += s.speed * dt;
        s.y += s.drift * (dt / 16.7) * 0.15;
        if (s.y > h + 2) s.y = -2;
        var a = s.base + Math.sin(s.phase) * 0.3;
        if (a < 0.05) a = 0.05;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? "rgba(224, 195, 130," + a + ")"
          : "rgba(226, 232, 245," + a + ")";
        ctx.fill();
      }

      maybeShoot();
      for (var j = shooting.length - 1; j >= 0; j--) {
        var m = shooting[j];
        m.x += m.vx * (dt / 16.7);
        m.y += m.vy * (dt / 16.7);
        m.life -= 0.012 * (dt / 16.7);
        if (m.life <= 0) { shooting.splice(j, 1); continue; }
        var grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 9, m.y - m.vy * 9);
        grad.addColorStop(0, "rgba(240, 230, 200," + 0.75 * m.life + ")");
        grad.addColorStop(1, "rgba(240, 230, 200, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * 9, m.y - m.vy * 9);
        ctx.stroke();
      }

      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  /* ---------- Reading progress ---------- */
  var fill = document.querySelector(".progress-track span");
  var nav = document.querySelector(".topnav");
  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (fill) fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Journey memory (localStorage) ---------- */
  var ROMANS = ["", "I", "II", "III", "IV", "V", "VI"];
  var TOTAL_STATIONS = 6;

  /* Language-aware bits: German lives at the root, other languages in
     subfolders (e.g. /en/) with localized chapter filenames. */
  var lang = (document.documentElement.getAttribute("lang") || "de").slice(0, 2);
  var CH_PREFIXES = { de: "kapitel-", en: "chapter-", es: "capitulo-" };
  var CH_PREFIX = CH_PREFIXES[lang] || CH_PREFIXES.de;
  var CH_RE = /(?:kapitel|chapter|capitulo)-(\d)/;

  var STR = {
    de: {
      completed: "✓ Abgeschlossen",
      resumeDone: "Du hast die Reise vollendet — Station VI erneut besuchen",
      resumeContinue: "Setze deine Reise fort · Station ",
      pill: 'Weiterlesen, wo du warst <span class="arrow">↓</span>'
    },
    en: {
      completed: "✓ Completed",
      resumeDone: "You’ve completed the journey — revisit Station VI",
      resumeContinue: "Continue your journey · Station ",
      pill: 'Continue where you left off <span class="arrow">↓</span>'
    },
    es: {
      completed: "✓ Completado",
      resumeDone: "Has completado el viaje — vuelve a visitar la Estación VI",
      resumeContinue: "Continúa tu viaje · Estación ",
      pill: 'Sigue donde lo dejaste <span class="arrow">↓</span>'
    }
  };
  var T = STR[lang] || STR.de;

  /* Progress is tracked per language so the editions never cross-link. */
  var KEY_SUFFIX = lang === "de" ? "" : "." + lang;
  var KEY_DONE = "ersteUrsache.done" + KEY_SUFFIX;
  var KEY_POS = "ersteUrsache.pos" + KEY_SUFFIX;

  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function load(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
  }

  var done = load(KEY_DONE, []);
  var pos = load(KEY_POS, null);
  var match = location.pathname.match(CH_RE);
  var chapter = match ? parseInt(match[1], 10) : 0;

  function chapterFromHref(href) {
    var m = (href || "").match(CH_RE);
    return m ? parseInt(m[1], 10) : 0;
  }

  /* Mark completed stations in top nav + side dots (all pages) */
  document.querySelectorAll(".nav-stations a, .side-dots a").forEach(function (a) {
    var c = chapterFromHref(a.getAttribute("href"));
    if (c && done.indexOf(c) !== -1) a.classList.add("is-done");
  });

  /* ----- Landing page: journey map state + resume banner ----- */
  document.querySelectorAll(".station[data-chapter]").forEach(function (st) {
    var c = parseInt(st.getAttribute("data-chapter"), 10);
    var node = st.querySelector(".station-node");
    var eyebrow = st.querySelector(".station-eyebrow");
    if (done.indexOf(c) !== -1) {
      node.classList.add("is-done");
      node.textContent = "✓";
      if (eyebrow && !eyebrow.querySelector(".station-state")) {
        var tag = document.createElement("span");
        tag.className = "station-state";
        tag.textContent = T.completed;
        eyebrow.appendChild(tag);
      }
    } else if (pos && pos.c === c) {
      node.classList.add("is-current");
    }
  });

  var banner = document.getElementById("resumeBanner");
  if (banner) {
    if (done.length >= TOTAL_STATIONS) {
      banner.innerHTML = '<a class="resume-link" href="' + CH_PREFIX + '6.html">' +
        '<span class="resume-mark">✦</span> ' + T.resumeDone +
        ' <span class="arrow">→</span></a>';
      banner.hidden = false;
    } else if (pos && pos.c >= 1 && pos.c <= TOTAL_STATIONS) {
      banner.innerHTML = '<a class="resume-link" href="' + CH_PREFIX + pos.c + '.html">' +
        '<span class="resume-mark">✦</span> ' + T.resumeContinue + ROMANS[pos.c] +
        ' <span class="arrow">→</span></a>';
      banner.hidden = false;
    }
  }

  /* ----- Chapter pages: save position, mark completion, resume pill ----- */
  if (chapter) {
    var saveTimer = null;
    window.addEventListener("scroll", function () {
      if (saveTimer) return;
      saveTimer = setTimeout(function () {
        saveTimer = null;
        store(KEY_POS, { c: chapter, y: Math.round(window.scrollY), t: Date.now() });
      }, 400);
    }, { passive: true });
    if (!pos || pos.c !== chapter) {
      store(KEY_POS, { c: chapter, y: 0, t: Date.now() });
    }

    /* Completed when the end-of-chapter card comes into view */
    var endCard = document.querySelector(".next-chapter");
    if (endCard && "IntersectionObserver" in window) {
      var doneIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          if (done.indexOf(chapter) === -1) {
            done.push(chapter);
            store(KEY_DONE, done);
            document.querySelectorAll(".nav-stations a, .side-dots a").forEach(function (a) {
              if (chapterFromHref(a.getAttribute("href")) === chapter) a.classList.add("is-done");
            });
          }
          doneIO.disconnect();
        });
      }, { threshold: 0.4 });
      doneIO.observe(endCard);
    }

    /* Resume pill: returning reader with a saved position further down */
    if (pos && pos.c === chapter && pos.y > 900 && window.scrollY < 300) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "resume-pill";
      pill.innerHTML = T.pill;
      document.body.appendChild(pill);
      var savedY = pos.y;
      requestAnimationFrame(function () { pill.classList.add("is-shown"); });
      var hidePill = function () {
        pill.classList.remove("is-shown");
        setTimeout(function () { pill.remove(); }, 500);
      };
      pill.addEventListener("click", function () {
        window.scrollTo({ top: savedY, behavior: "smooth" });
        hidePill();
      });
      var pillScroll = function () {
        if (window.scrollY > savedY - 200) {
          hidePill();
          window.removeEventListener("scroll", pillScroll);
        }
      };
      window.addEventListener("scroll", pillScroll, { passive: true });
      setTimeout(hidePill, 14000);
    }
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
