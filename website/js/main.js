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
  var CH_PREFIXES = {
    de: "kapitel-", en: "chapter-", es: "capitulo-",
    pt: "capitulo-", fr: "chapitre-", it: "capitolo-", hi: "adhyay-"
  };
  var CH_PREFIX = CH_PREFIXES[lang] || CH_PREFIXES.de;
  var CH_RE = /(?:kapitel|chapter|capitulo|capitolo|chapitre|adhyay)-(\d)/;

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
    },
    pt: {
      completed: "✓ Concluído",
      resumeDone: "Você completou a viagem — revisite a Estação VI",
      resumeContinue: "Continue sua viagem · Estação ",
      pill: 'Continue de onde parou <span class="arrow">↓</span>'
    },
    fr: {
      completed: "✓ Terminé",
      resumeDone: "Tu as terminé le voyage — revisite l’Étape VI",
      resumeContinue: "Continue ton voyage · Étape ",
      pill: 'Reprends où tu t’es arrêté <span class="arrow">↓</span>'
    },
    it: {
      completed: "✓ Completato",
      resumeDone: "Hai completato il viaggio — rivisita la Tappa VI",
      resumeContinue: "Continua il tuo viaggio · Tappa ",
      pill: 'Riprendi da dove eri rimasto <span class="arrow">↓</span>'
    },
    hi: {
      completed: "✓ पूर्ण",
      resumeDone: "आपने यात्रा पूरी कर ली — पड़ाव VI फिर से देखें",
      resumeContinue: "अपनी यात्रा जारी रखें · पड़ाव ",
      pill: 'जहाँ छोड़ा था वहीं से जारी रखें <span class="arrow">↓</span>'
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

  /* ----- Chapter pages: orientation + progress chip ----- */
  var STATION_LABEL = {
    de: "Station {n} von VI",
    en: "Station {n} of VI",
    es: "Estación {n} de VI",
    pt: "Estação {n} de VI",
    fr: "Étape {n} sur VI",
    it: "Tappa {n} di VI",
    hi: "पड़ाव {n} / VI"
  };
  var TOC_LABEL = {
    de: "In diesem Kapitel", en: "In this chapter", es: "En este capítulo",
    pt: "Neste capítulo", fr: "Dans ce chapitre", it: "In questo capitolo", hi: "इस अध्याय में"
  };
  var CHIP_LABEL = {
    de: "Deine Reise", en: "Your journey", es: "Tu viaje",
    pt: "Sua viagem", fr: "Ton voyage", it: "Il tuo viaggio", hi: "आपकी यात्रा"
  };
  var CHIP_ARIA = {
    de: "{d} von 6 Stationen abgeschlossen — zur Übersicht",
    en: "{d} of 6 stations completed — back to overview",
    es: "{d} de 6 estaciones completadas — volver al inicio",
    pt: "{d} de 6 estações concluídas — voltar à visão geral",
    fr: "{d} étapes sur 6 terminées — retour à la vue d’ensemble",
    it: "{d} di 6 tappe completate — torna alla panoramica",
    hi: "6 में से {d} पड़ाव पूर्ण — अवलोकन पर जाएँ"
  };

  /* "Station III von VI" in the chapter meta line */
  if (chapter) {
    var meta = document.querySelector(".chapter-meta");
    if (meta) {
      var mDot = document.createElement("span");
      mDot.className = "meta-dot";
      mDot.textContent = "·";
      meta.appendChild(mDot);
      meta.appendChild(document.createTextNode(
        (STATION_LABEL[lang] || STATION_LABEL.de).replace("{n}", ROMANS[chapter])
      ));
    }
  }

  /* Mini table of contents for the long chapters (5 and 6) */
  if (chapter >= 5) {
    var prose = document.querySelector("main .prose");
    var heads = document.querySelectorAll("main .prose h2");
    if (prose && heads.length >= 2) {
      var toc = document.createElement("details");
      toc.className = "chapter-toc";
      var sum = document.createElement("summary");
      sum.textContent = TOC_LABEL[lang] || TOC_LABEL.de;
      toc.appendChild(sum);
      var list = document.createElement("ol");
      heads.forEach(function (h, i) {
        if (!h.id) h.id = "abschnitt-" + (i + 1);
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
      });
      toc.appendChild(list);
      prose.insertBefore(toc, prose.firstChild);
    }
  }

  /* Progress chip: "Deine Reise ●●●○○○ 3/6" */
  function renderChip() {
    if (!chapter || !done.length) return;
    var chip = document.querySelector(".journey-chip");
    if (!chip) {
      chip = document.createElement("a");
      chip.className = "journey-chip";
      chip.href = "index.html";
      document.body.appendChild(chip);
    }
    chip.setAttribute("aria-label",
      (CHIP_ARIA[lang] || CHIP_ARIA.de).replace("{d}", done.length));
    chip.innerHTML = "";
    var label = document.createElement("span");
    label.className = "jc-label";
    label.textContent = CHIP_LABEL[lang] || CHIP_LABEL.de;
    chip.appendChild(label);
    var dots = document.createElement("span");
    dots.className = "jc-dots";
    dots.setAttribute("aria-hidden", "true");
    for (var i = 1; i <= TOTAL_STATIONS; i++) {
      var d = document.createElement("span");
      d.className = "jc-dot" + (i <= done.length ? " is-done" : "");
      d.textContent = i <= done.length ? "●" : "○";
      dots.appendChild(d);
    }
    chip.appendChild(dots);
    var count = document.createElement("span");
    count.className = "jc-count";
    count.textContent = done.length + "/" + TOTAL_STATIONS;
    chip.appendChild(count);
  }
  renderChip();

  /* Fade the chip out when the footer scrolls into view so it never
     overlaps the footer links. */
  var chipEl = document.querySelector(".journey-chip");
  var footerEl = document.querySelector("footer");
  if (chipEl && footerEl && "IntersectionObserver" in window) {
    var chipIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        chipEl.classList.toggle("is-hidden", e.isIntersecting);
      });
    }, { threshold: 0 });
    chipIO.observe(footerEl);
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
            renderChip();
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

  /* ---------- Mobile menu (hamburger + drawer) ---------- */
  var MENU_LABELS = {
    de: { open: "Menü öffnen", close: "Menü schließen" },
    en: { open: "Open menu", close: "Close menu" },
    es: { open: "Abrir menú", close: "Cerrar menú" },
    pt: { open: "Abrir menu", close: "Fechar menu" },
    fr: { open: "Ouvrir le menu", close: "Fermer le menu" },
    it: { open: "Apri il menu", close: "Chiudi il menu" },
    hi: { open: "मेनू खोलें", close: "मेनू बंद करें" }
  };
  var ML = MENU_LABELS[lang] || MENU_LABELS.de;

  var topnav = document.querySelector(".topnav");
  var navStations = topnav && topnav.querySelector(".nav-stations");
  if (topnav && navStations) {
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", ML.open);
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = '<span class="nav-toggle-bars"></span>';
    topnav.appendChild(toggle);

    var stationLinks = Array.prototype.filter.call(navStations.children, function (el) {
      return el.tagName === "A" && !el.classList.contains("nav-link");
    });
    var navLabel = navStations.querySelector(".nav-label");
    var textLinks = navStations.querySelectorAll(".nav-link");
    var langSwitch = navStations.querySelector(".lang-switch");

    var menu = document.createElement("div");
    menu.className = "mobile-menu";
    menu.setAttribute("role", "dialog");
    menu.setAttribute("aria-modal", "true");
    menu.hidden = true;

    var inner = document.createElement("div");
    inner.className = "mobile-menu-inner";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "mobile-menu-close";
    closeBtn.setAttribute("aria-label", ML.close);
    closeBtn.innerHTML = "&times;";
    menu.appendChild(closeBtn);

    if (navLabel) {
      var kicker = document.createElement("p");
      kicker.className = "mobile-menu-kicker";
      kicker.textContent = navLabel.textContent;
      inner.appendChild(kicker);
    }

    var stationsWrap = document.createElement("div");
    stationsWrap.className = "mobile-menu-stations";
    stationLinks.forEach(function (a) {
      var item = document.createElement("a");
      item.href = a.getAttribute("href");
      item.className = "mobile-menu-station";
      if (a.classList.contains("is-active")) item.classList.add("is-active");
      if (a.classList.contains("is-done")) item.classList.add("is-done");
      var num = document.createElement("span");
      num.className = "mm-num";
      num.textContent = a.textContent.trim();
      var label = document.createElement("span");
      label.className = "mm-label";
      label.textContent = a.getAttribute("title") || a.textContent.trim();
      item.appendChild(num);
      item.appendChild(label);
      stationsWrap.appendChild(item);
    });
    inner.appendChild(stationsWrap);

    textLinks.forEach(function (link) {
      var res = document.createElement("a");
      res.href = link.getAttribute("href");
      res.className = "mobile-menu-link";
      if (link.classList.contains("is-active")) res.classList.add("is-active");
      res.textContent = link.textContent.trim();
      inner.appendChild(res);
    });

    if (langSwitch) {
      var langs = langSwitch.cloneNode(true);
      langs.className = "lang-switch mobile-menu-langs";
      inner.appendChild(langs);
    }

    menu.appendChild(inner);
    document.body.appendChild(menu);

    var closeTimer = null;
    function openMenu() {
      if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
      menu.hidden = false;
      void menu.offsetWidth; /* force reflow so the opacity transition plays */
      menu.classList.add("is-open");
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      closeTimer = setTimeout(function () { menu.hidden = true; }, 380);
    }
    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) closeMenu(); else openMenu();
    });
    closeBtn.addEventListener("click", closeMenu);
    menu.addEventListener("click", function (e) { if (e.target === menu) closeMenu(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) closeMenu();
    });
    inner.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { closeMenu(); });
    });
  }

  /* ---------- Make Quran references clickable (content untouched) ---------- */
  var REF_LABEL = {
    de: "Vers {ref} auf quran.com lesen",
    en: "Read verse {ref} on quran.com",
    es: "Leer el versículo {ref} en quran.com",
    pt: "Ler o versículo {ref} em quran.com",
    fr: "Lire le verset {ref} sur quran.com",
    it: "Leggi il versetto {ref} su quran.com",
    hi: "quran.com पर आयत {ref} पढ़ें"
  };
  var refLabel = REF_LABEL[lang] || REF_LABEL.de;

  function quranLink(ref, text) {
    var a = document.createElement("a");
    a.href = "https://quran.com/" + ref;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", refLabel.replace("{ref}", ref));
    a.textContent = text;
    return a;
  }

  /* 1) The gold [surah:ayah] tags under verse blocks */
  document.querySelectorAll(".verse-ref").forEach(function (el) {
    if (el.querySelector("a")) return;
    var m = el.textContent.match(/(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?/);
    if (!m) return;
    var ref = m[3] ? m[1] + ":" + m[2] + "-" + m[3] : m[1] + ":" + m[2];
    var a = quranLink(ref, el.textContent);
    el.textContent = "";
    el.appendChild(a);
  });

  /* 2) Inline (surah:ayah) citations in chapter prose — text nodes only,
     so the book text in the HTML source is never edited. */
  var REF_RE = /\((\d{1,3}:\d{1,3}(?:-\d{1,3})?)\)/g;
  document.querySelectorAll(".prose p, .prose li").forEach(function (p) {
    Array.prototype.slice.call(p.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return; /* text nodes only */
      var s = node.nodeValue;
      REF_RE.lastIndex = 0;
      if (!REF_RE.test(s)) return;
      REF_RE.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var lastIdx = 0, m;
      while ((m = REF_RE.exec(s))) {
        frag.appendChild(document.createTextNode(s.slice(lastIdx, m.index)));
        var a = quranLink(m[1], m[0]);
        a.className = "quran-ref";
        frag.appendChild(a);
        lastIdx = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(s.slice(lastIdx)));
      node.parentNode.replaceChild(frag, node);
    });
  });

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

  /* ---------- Voice reader (Web Speech / text-to-speech) ----------
     Reads a whole station aloud in the page's own language — from the
     title straight through to the conclusion. No backend, no audio files:
     it uses the visitor's built-in browser voices. Own scope so its
     locals never clash with the shared vars above. */
  (function () {
    if (!chapter || !("speechSynthesis" in window)) return;

    var synth = window.speechSynthesis;
    try { synth.cancel(); } catch (e) {} /* clear any stuck queue on load */

    var TTS = {
      de: { listen: "Diese Station anhören", playing: "Wird vorgelesen …", paused: "Pausiert",
            play: "Vorlesen", pauseA: "Pause", resume: "Fortsetzen", stop: "Vorlesen beenden",
            group: "Vorlese-Steuerung" },
      en: { listen: "Listen to this station", playing: "Reading aloud …", paused: "Paused",
            play: "Play", pauseA: "Pause", resume: "Resume", stop: "Stop reading",
            group: "Read-aloud controls" },
      es: { listen: "Escuchar esta estación", playing: "Leyendo en voz alta …", paused: "En pausa",
            play: "Reproducir", pauseA: "Pausar", resume: "Reanudar", stop: "Detener la lectura",
            group: "Controles de lectura" },
      pt: { listen: "Ouvir esta estação", playing: "Lendo em voz alta …", paused: "Pausado",
            play: "Reproduzir", pauseA: "Pausar", resume: "Retomar", stop: "Parar a leitura",
            group: "Controles de leitura" },
      fr: { listen: "Écouter cette étape", playing: "Lecture en cours …", paused: "En pause",
            play: "Lire", pauseA: "Pause", resume: "Reprendre", stop: "Arrêter la lecture",
            group: "Commandes de lecture" },
      it: { listen: "Ascolta questa tappa", playing: "Lettura in corso …", paused: "In pausa",
            play: "Riproduci", pauseA: "Pausa", resume: "Riprendi", stop: "Ferma la lettura",
            group: "Controlli di lettura" },
      hi: { listen: "इस पड़ाव को सुनें", playing: "पढ़ा जा रहा है …", paused: "रुका हुआ",
            play: "चलाएँ", pauseA: "रोकें", resume: "जारी रखें", stop: "पढ़ना बंद करें",
            group: "वाचन नियंत्रण" }
    };
    var S = TTS[lang] || TTS.de;
    var BCP = {
      de: "de-DE", en: "en-US", es: "es-ES",
      pt: "pt-BR", fr: "fr-FR", it: "it-IT", hi: "hi-IN"
    };

    var ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    var ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
    var ICON_STOP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>';

    /* Voices load asynchronously in most browsers. */
    var voices = [];
    function loadVoices() { voices = synth.getVoices() || []; }
    loadVoices();
    if (typeof synth.addEventListener === "function") {
      synth.addEventListener("voiceschanged", loadVoices);
    }
    function pickVoice() {
      var pool = voices.filter(function (v) {
        return v.lang && v.lang.toLowerCase().indexOf(lang) === 0;
      });
      if (!pool.length) return null;
      var best = null;
      pool.forEach(function (v) { if (!best && v.localService && v.default) best = v; });
      return best || pool[0];
    }

    function normalize(s) { return s.replace(/\s+/g, " ").trim(); }

    /* Break a block into utterance-sized pieces (<=200 chars) so the reader
       stays smooth and dodges the Chrome long-utterance cut-off bug. */
    function chunk(s) {
      var sentences = s.match(/[^.!?…]+[.!?…]+["'”’)\]]*\s*|[^.!?…]+$/g) || [s];
      var pieces = [];
      sentences.forEach(function (sent) {
        sent = normalize(sent);
        if (!sent) return;
        if (sent.length <= 200) { pieces.push(sent); return; }
        var words = sent.split(/\s+/), buf = "";
        words.forEach(function (w) {
          if (buf && (buf + " " + w).length > 200) { pieces.push(buf); buf = w; }
          else buf = buf ? buf + " " + w : w;
        });
        if (buf) pieces.push(buf);
      });
      return pieces.length ? pieces : [s];
    }

    /* Reading order: the title, then every paragraph / heading / list item
       in the prose. The injected table of contents is skipped; ornaments,
       the big argument numbers and the [surah:ayah] tags aren't <p>/<li>,
       so they fall out on their own. */
    var blocks = [];
    var units = [];
    var els = [];
    var h1 = document.querySelector(".chapter-hero h1");
    if (h1) els.push(h1);
    document.querySelectorAll(
      "main .prose h2, main .prose h3, main .prose p, main .prose li"
    ).forEach(function (el) {
      if (el.closest(".chapter-toc")) return;
      if (!normalize(el.textContent)) return;
      els.push(el);
    });
    els.forEach(function (el, bi) {
      blocks.push(el);
      chunk(normalize(el.textContent)).forEach(function (t) {
        units.push({ text: t, block: bi });
      });
    });
    if (!units.length) return;

    /* ----- Build the player ----- */
    var bar = document.createElement("div");
    bar.className = "tts-bar";
    bar.setAttribute("role", "group");
    bar.setAttribute("aria-label", S.group);

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "tts-toggle";

    var metaWrap = document.createElement("div");
    metaWrap.className = "tts-meta";
    var label = document.createElement("span");
    label.className = "tts-label";
    label.setAttribute("aria-live", "polite");
    var progress = document.createElement("span");
    progress.className = "tts-progress";
    progress.setAttribute("aria-hidden", "true");
    var progressFill = document.createElement("span");
    progress.appendChild(progressFill);
    metaWrap.appendChild(label);
    metaWrap.appendChild(progress);

    var stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "tts-stop";
    stopBtn.innerHTML = ICON_STOP;
    stopBtn.setAttribute("aria-label", S.stop);
    stopBtn.hidden = true;

    bar.appendChild(toggle);
    bar.appendChild(metaWrap);
    bar.appendChild(stopBtn);

    var prose = document.querySelector("main .prose");
    prose.insertBefore(bar, prose.firstChild);

    /* ----- Playback state ----- */
    var state = "idle"; /* idle | playing | paused */
    var idx = 0;
    var curBlock = -1;

    function render() {
      var playing = state === "playing";
      toggle.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
      toggle.setAttribute("aria-label",
        playing ? S.pauseA : (state === "paused" ? S.resume : S.play));
      label.textContent =
        playing ? S.playing : (state === "paused" ? S.paused : S.listen);
      stopBtn.hidden = state === "idle";
      bar.classList.toggle("is-active", state !== "idle");
    }
    function updateProgress() {
      progressFill.style.width = (idx / units.length) * 100 + "%";
    }
    function clearHighlight() {
      if (curBlock >= 0 && blocks[curBlock]) blocks[curBlock].classList.remove("tts-reading");
      curBlock = -1;
    }
    function highlight(bi) {
      if (bi === curBlock) return;
      clearHighlight();
      curBlock = bi;
      var el = blocks[bi];
      if (!el) return;
      el.classList.add("tts-reading", "is-visible");
      var r = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top < vh * 0.15 || r.bottom > vh * 0.85) {
        el.scrollIntoView({ block: "center", behavior: reducedMotion ? "auto" : "smooth" });
      }
    }

    function speakNext() {
      if (idx >= units.length) { stop(); return; }
      var u = units[idx];
      highlight(u.block);
      updateProgress();
      var utt = new SpeechSynthesisUtterance(u.text);
      var v = pickVoice();
      if (v) utt.voice = v;
      utt.lang = v ? v.lang : (BCP[lang] || "en-US");
      utt.rate = 1;
      utt.pitch = 1;
      utt.onend = function () { if (state === "playing") { idx++; speakNext(); } };
      utt.onerror = function () { if (state === "playing") { idx++; speakNext(); } };
      synth.speak(utt);
    }

    function play() {
      if (state === "paused") { state = "playing"; synth.resume(); render(); return; }
      if (state === "playing") return;
      if (idx >= units.length) idx = 0;
      state = "playing";
      render();
      speakNext();
    }
    function pause() {
      if (state !== "playing") return;
      state = "paused";
      synth.pause();
      render();
    }
    function stop() {
      state = "idle";
      idx = 0;
      synth.cancel();
      clearHighlight();
      updateProgress();
      render();
    }

    toggle.addEventListener("click", function () {
      if (state === "playing") pause(); else play();
    });
    stopBtn.addEventListener("click", stop);

    /* Stop narration when the reader leaves or hides the page. */
    window.addEventListener("pagehide", function () { try { synth.cancel(); } catch (e) {} });
    window.addEventListener("beforeunload", function () { try { synth.cancel(); } catch (e) {} });

    render();
    updateProgress();
  })();
})();
