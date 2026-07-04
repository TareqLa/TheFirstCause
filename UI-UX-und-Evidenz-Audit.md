# Die Erste Ursache — UI/UX & Evidence Audit

**Author of audit:** Claude (Opus 4.8) · **Date:** 2026-07-04
**Scope reviewed:** the full static site in `website/` (DE root + `en/` + `es/`), `css/style.css`, `js/main.js`, SEO layer, deploy workflow. Live rendering verified in a local preview (desktop + narrow/mobile widths, verse pages, journey map). No console/network errors observed.
**Hard constraint respected throughout:** the book text stays 100% verbatim. Every evidence/credibility idea below is *additive* (links, tooltips, separate sections, JS enhancements) — **none require editing a single word of the chapters.** Where I suggest new words, it is always UI copy (nav, buttons, labels, a new sources page), never the book.

---

## 0. How to read this document

The findings are grouped:

- **Part A — Credibility & Evidence** — this is the heart of your request ("show that this is all true and based on logic and evidence"). Read this first.
- **Part B — UI/UX** — interface, accessibility, performance, reading comfort.
- **Part C — Conversion / journey flow** — keeping casual readers moving and lowering the barrier to the final step.
- **Part D — SEO / social / distribution** — being found and shared.
- **Part E — Code quality & maintainability** — so 24 pages don't become 24 maintenance headaches.
- **Part F — Copy polish** (non-verbatim only).
- **Part G — Scientific & philosophical sources** — credible references backing the physics/biology arguments, for readers who can't evaluate them themselves *(added at your request)*.
- **Part H — Keeping readers reading** — animations, imagery, and momentum to pull readers to the next chapter *(added at your request)*.
- **Roadmap** — everything sorted into P0 / P1 / P2 with effort estimates.
- **Appendix** — copy-paste-ready code for the highest-value items.

Each item is tagged **[P0]** (do first — high impact, low effort), **[P1]** (high value), or **[P2]** (nice to have).

---

## 1. What is already strong (do not undo these)

Your site is genuinely well-built. Before changing anything, know what's working so you keep it:

- **The "journey in 6 stations" metaphor is excellent** and perfectly matched to the book's structure (a logical chain). The timeline with numbered nodes on the landing page is beautiful and communicates "follow the steps" instantly.
- **Visual design is premium**: the cosmic dark theme, gold accents, Cormorant/Spectral serif pairing, the starfield, and the gradient hero all feel considered and trustworthy — not like a cheap pamphlet.
- **Progress mechanics** (localStorage resume banner, completion checkmarks, resume pill, per-language namespacing) are a sophisticated retention feature most sites lack.
- **i18n architecture** (DE root + `/en/` + `/es/`, hreflang cluster, language-aware `main.js`, per-language progress) is done correctly.
- **SEO groundwork** (canonical, OG, Twitter, JSON-LD WebSite+Book, sitemap, robots) is already in place.
- **`prefers-reduced-motion` is respected** — a real accessibility win that most sites ignore.

The gaps below are about turning a *beautiful* site into a *persuasive, verifiable, and bulletproof* one.

---

## PART A — Credibility & Evidence: "show that this is true, logical, and evidence-based"

Your book makes two very different kinds of claims, and each needs a different credibility tool:

1. **Deductive/logical claims** (Chapters 1–4): "nothing comes from nothing," "the universe can't be eternal," "a mindless force can't decide," → therefore a First Cause with specific attributes. These are *arguments*. The way to strengthen them is to **make the logic visible and to pre-empt objections.**
2. **Empirical claims** (Chapters 5–6): Quran verses, "the sun travels through space (36:38)," "the Roman prophecy (30:2-4)," Haman/hieroglyphs, the House of Wisdom's 400,000 works, "Statista Nov 2025," named scholars (Goeringer, Bucaille, Hawking). These are *facts asserted*. The way to strengthen them is **citation and verifiability.**

Right now the site does neither. **That is the single biggest credibility gap.** A reader who is moved by the argument and thinks "is this actually true?" hits a wall: there is nothing to click, no source, no way to check. For a project whose entire thesis is *"this is based on logic and evidence, not blind faith,"* that wall quietly undercuts the whole message.

### A1. Make every Quran reference clickable and verifiable **[P0 — highest impact/effort ratio]**

Currently a verse shows as plain gold text `[2:163]` (confirmed on the live page — it is not a link). Every reference in the book — the verse blocks in Ch.5/Ch.6 *and* the inline citations in Ch.5 prose like `(51:47)`, `(21:30)`, `(23:12-14)` — should link to the actual verse so any skeptic can read it in full context on an authoritative source.

- **Where to link:** `quran.com` deep-links by `surah:ayah`, e.g. `https://quran.com/2:163` (ranges like `112:3-4` and `23:12-14` also resolve). It shows the Arabic + translations + tafsir + recitation, which is exactly what a doubter needs.
- **How to do it without touching the book text:** a tiny JS pass in `main.js` that finds `.verse-ref` text and inline `(\d+:\d+)` patterns and wraps them in `<a>`. **The HTML stays byte-for-byte identical; only the rendered output gains links.** Ready-to-paste code is in the [Appendix A1](#appendix).
- **Bonus:** the official **Quran.com Ayah embed** (`https://quran.com/embed`) can render the Arabic + audio recitation inline. Adding an optional "▸ im Koran anhören/lesen" expander under each verse block lets a reader *hear* the Arabic recitation — powerful and emotionally resonant, and it proves you're pointing at the real thing.

> Why this matters most: it costs ~30 lines of JS, changes no content, and instantly converts every unsourced assertion into a verifiable one. It is the clearest possible signal of "we have nothing to hide — check for yourself."

### A2. Add a source/citation apparatus for the empirical claims **[P0/P1]**

Chapter 5 and 6 assert dozens of specific, checkable facts with **zero sourcing**. To a logic-first reader this reads as "trust me." Fix it *additively* so the prose is untouched:

- **Preferred (non-invasive): a "Belege & Quellen" section at the end of each chapter** (collapsed `<details>` accordion, or a linked sub-page). Key each source to the claim it supports. Examples the chapters need:
  - Expanding universe → Hubble (1929); Hawking quote → give the book/lecture.
  - Big-Bang / "heavens and earth were one mass" → Lemaître (1927).
  - Embryology quote → **Dr. Gerald C. Goeringer** — give the exact conference/paper (it's from the 1980s IAMS/Saudi "scientific signs" conferences). Bucaille → *The Bible, the Qur'an and Science* (1976).
  - "Haman" / hieroglyphs → Maurice Bucaille's research, Vienna stele.
  - House of Wisdom "~400,000 works" → cite the historian/source.
  - "Statista, November 2025" wealth figures → link the actual Statista page.
  - "letzter Menschenzoo 1958" (Brussels Expo 58); German marital-property law reform (1957/1958, effective 1958; further reform 1977) → cite precisely; a wrong date here is the kind of thing a hostile reader screenshots.
- **Alternative (more work, more elegant): footnote markers.** Because markers *would* add characters into the verbatim text, do it the safe way — inject superscript markers via JS/CSS `::after` anchored to phrases, or keep them only in the sources accordion. Don't hand-edit the prose.
- **Verify each number before publishing.** Right now the site is not yet live (per project notes), so this is the moment. A single debunked statistic ("that Statista figure doesn't say that") lets a critic dismiss the whole site. Precision *is* the credibility.

### A3. A dedicated "Belege & Quellen / Evidence" page **[P1]**

Add one page per language (`belege.html` / `evidence.html` / `evidencias.html`), linked in the nav next to *Ressourcen*. Structure:

- **The logical argument, restated as formal premises → conclusion** (see A4).
- **The scientific claims, each with: the verse, the modern finding, the date it was discovered, and a primary-source link.** A clean table does this well.
- **The preservation & inimitability claims** with scholarly references (manuscript studies — e.g. Birmingham/Sana'a manuscripts for preservation).
- **"Answering common objections"** (see A5).

This page is where a serious skeptic goes to try to break your case — and finding it well-sourced is what converts "nice website" into "these people did their homework."

### A4. Make the *logic* visible — an argument map **[P1]**

The book's spine is a deductive chain, but the site presents it as prose. Show the skeleton visually so a reader sees "this is a proof, not a sermon":

- On the landing page (or the evidence page), add a compact **argument diagram**: 
  `P1: Aus dem Nichts entsteht nichts` → `P2: Das Universum begann zu existieren` → `P3: Es kann sich nicht selbst verursacht haben` → `P4: Eine Kraft/der Zufall genügen nicht` → **`Schlussfolgerung: eine notwendige, willentscheidende Erste Ursache`** → `Ihre Eigenschaften: ewig, allmächtig, eine` → `Welche Botschaft beschreibt genau diese Ursache?`
- You already have the visual vocabulary for this (the `.fazit` conclusion blocks, the numbered `.argument` grid). A starter SVG is in [Appendix A4](#appendix).
- Per chapter, you already mark conclusions with `.fazit` ("Fazit"). Consider also tagging the *premises* explicitly (a small "Prämisse" eyebrow) so each step reads as part of a chain. This is UI chrome around the verbatim text, not a text change.

### A5. Anticipate objections — the mark of a rigorous case **[P1]**

Nothing signals intellectual confidence (and disarms a skeptic) like **stating the strongest counter-argument and answering it.** Add an "Häufige Einwände" (Common Objections) accordion on the evidence page and/or at the foot of the relevant chapter. The obvious ones your argument invites:

- *"But then what caused God?"* → the First Cause is by definition necessary/uncaused; the chain must terminate to avoid infinite regress (you already argue this in Ch.2–4 — surface it as an explicit Q&A).
- *"Isn't the multiverse a scientific answer?"* → you address this in Ch.3; make it a titled objection.
- *"The 'scientific miracles' are just vague verses read backwards."* → this is the **most common and most damaging** skeptic reply (see A6). Answer it head-on rather than hoping no one raises it.
- *"Fine-tuning could be a selection effect / anthropic principle."*
- *"Every holy book claims to be inimitable."*

Format: `<details>` accordions styled like your `.analogy` cards. This is additive UI copy you write once.

### A6. Honest strategic note on the "scientific miracles" framing **[P1 — please read]**

You asked me to research how to show the case is **true and based on logic and evidence**, so I owe you an honest finding, not just flattery:

**The scientific-miracles argument (Ch.5's "knowledge no one could have known") is the weakest link *with exactly the audience you most want to convince* — educated, skeptical, logic-first readers.** It is heavily contested in mainstream academia and is the first thing critics attack. The embryology claims in particular are traced by historians to Galen's 2nd-century writings; Bucaille's method ("Bucailleism") is widely criticized, and even a number of Muslim scholars now consider the "scientific miracles" genre an apologetic liability (sources below). I'm not telling you the claims are false or that you must remove anything — the text stays verbatim — but for your *stated goal* you should know:

- If you present these claims as slam-dunk, unanswerable proofs **with no sourcing and no acknowledgement of debate**, a knowledgeable skeptic will find the counter-material in one search, feel you oversold, and then distrust your *strong* arguments too (guilt by association). Over-claiming is contagious.
- **The robust move:** (a) *lead* with your strongest, least-contestable material — the deductive cosmological argument (Ch.1–4), the Qur'an's **linguistic inimitability**, its **textual preservation**, and the **moral/civilizational transformation** (Ch.6); (b) present the scientific parallels more carefully — as *"remarkable consonance"* rather than *"impossible to know,"* with primary sources and an honest objection-response (A5). This is more persuasive to skeptics, not less, because it shows you engaged the counter-argument and still stand.
- This is your call as the author. My job is only to flag that, measured against the goal *"convince a logical person it's true,"* rigorous sourcing + objection-handling protects you, and unsourced maximal claims expose you.

Relevant reading (skeptic + internal-Muslim critique, so you can pre-empt them):
- [Deconstructing the "Scientific Miracles" argument — Traversing Tradition](https://traversingtradition.com/2018/04/09/deconstructing-the-scientific-miracles-in-the-quran-argument/)
- [Navigating the 'scientific miracles' narrative — Qarawiyyin Project](https://qarawiyyinproject.co/2021/11/22/navigating-the-scientific-miracles-of-the-quran-narrative/)
- [Hamza Tzortzis — a more defensible approach to Qur'an & science](https://www.hamzatzortzis.com/does-the-quran-contain-scientific-miracles-a-new-approach/)
- [Zygon Journal — academic analysis of the "scientific miracle" genre](https://www.zygonjournal.org/article/id/14373/)

### A7. Author transparency & trust signals **[P1]**

A logic-first reader wants to know *who is making this argument and why they should listen.* Right now the site is anonymous except an email/Telegram at the very end.

- Add a short **"Über dieses Projekt / Über den Autor"** blurb (can stay pseudonymous but should state: who wrote it, that it's a free non-commercial dawah project, your intent, and that the book is available). Honesty about intent *builds* trust; hidden agendas erode it.
- State clearly that **all Quran translations are labelled** (you already do this well in ES with the Isa García attribution line; do the same in DE — name the German translation used).
- Add "Zuletzt aktualisiert" dates and a version so the work reads as maintained and accountable.
- Consider a line inviting good-faith disagreement ("Fragen und Einwände willkommen") — it models the confidence of someone who has examined the objections.

---

## PART B — UI / UX

### B1. Navigation & responsive breakpoints **[P1]**

- **Side-dots + hamburger overlap (521–720px band).** `.side-dots` is hidden only below 520px, but the top nav collapses to the hamburger at 720px. So on large phones / small tablets (521–720px) the reader sees *both* the right-rail dots and the hamburger — redundant, and the dots sit close to the centered verse column. **Fix:** hide `.side-dots` below 720px too (align it with the nav breakpoint). One line. ([Appendix B1](#appendix).)
- **Desktop station nav is cryptic.** The top-nav Roman numerals `I II III IV V VI` are elegant but give no title on hover for *mouse* users beyond a native tooltip, and mean nothing at a glance. Consider a hover-flyout showing the chapter title, or at least ensure the `title` attributes are consistently descriptive (they are — good).
- **No "you are here / chapter X of 6" indicator inside chapters.** The side-dots imply it but aren't labelled. Add a small "Station III von VI" to the chapter meta line for orientation.

### B2. In-chapter orientation & navigation **[P1]**

- **Add a per-chapter mini table of contents** for the long chapters (5 and 6 are 12–13 min reads with multiple `<h2>` sections like "Die Geschichte des Propheten," "Wissen, das niemand kennen konnte"). A small sticky/expandable outline lets readers navigate and *see the structure of the evidence*. You can generate it from the `<h2>`s in JS — no content change.
- **Keyboard/prev-next:** you have "Weiter zu Kapitel N" / "Zurück" links (good). Consider left/right arrow-key navigation between chapters for power readers.
- **Reading progress bar** exists (nice). Consider showing estimated **time remaining** as the reader scrolls, not just a bar.

### B3. Accessibility **[P0 for focus states, P1 rest]**

- **No visible focus styles.** I found no `:focus-visible` rules in `style.css`. Keyboard and screen-reader users get only the browser default outline, which on your custom pill buttons/links is often invisible against the dark theme. **Add a clear gold focus ring** to all interactive elements. This is a real WCAG 2.4.7 failure and easy to fix. ([Appendix B3](#appendix).)
- **Add a "skip to content" link** for keyboard users (hidden until focused).
- **The starfield `<canvas>` needs `aria-hidden="true"`** and a `role="presentation"` so assistive tech ignores it.
- **Arabic text needs language marking.** The `ﷺ` glyph, the shahada block, and Arabic terms should be wrapped with `lang="ar"` and `dir="rtl"` where appropriate so screen readers pronounce them correctly and don't garble the German flow.
- **Tap-target sizes:** the nav Roman numerals are `2rem` circles (~32px). WCAG target minimum is 44px. On mobile you've moved to the drawer (good), but audit that all tappable things clear ~44px.
- **Contrast:** `--muted (#8b93a5)` on the near-black bg is ~5.8:1 — passes AA for body but is used at very small sizes (0.62–0.68rem) with heavy letter-spacing on eyebrows/labels, which hurts legibility more than contrast. Nudge those labels slightly lighter or larger. Verify the gold `#d4af5f` on gradient card backgrounds stays ≥4.5:1.
- **Respect `prefers-reduced-motion`** — already done for animations. Also gate the *starfield loop* behind it (it already is: `if (canvas && !reducedMotion)`), good.

### B4. Performance & privacy (GDPR) **[P1 — matters for a German-first site]**

- **Google Fonts are loaded from Google's CDN.** For a German audience this is a **GDPR concern** — a German court (LG München, 2022) ruled that embedding Google Fonts via Google's servers (which receives the visitor's IP) without consent violates GDPR. **Self-host the fonts** (`Cormorant Garamond`, `Spectral`, `Inter`) locally in `website/fonts/`. This also speeds up first paint and removes two `preconnect`s. (This was already on your roadmap — it should be **P1**, not "someday," because it's a legal exposure the moment you go live in Germany.)
- **`font-display: swap`** is set via the URL param — good. Preload the one or two most critical font files.
- **Starfield CPU:** up to 260 stars animating every frame via `requestAnimationFrame`. On low-end phones this drains battery and can jank scroll. Consider: reduce the star cap on small screens, pause the loop when the hero is scrolled out of view (`IntersectionObserver`), and you already cap `dpr` at 2 (good).
- **`main.js`** is loaded at end of body (good) but not deferred; add `defer` for cleanliness.
- **No analytics** yet — when you add it, use privacy-first (Plausible/Umami, already on roadmap) to stay consent-light under GDPR.

### B5. Reading comfort **[P2]**

- **Font-size / "reading mode" control.** A small A−/A+ or a "comfortable/compact" toggle helps older readers (a real portion of a religious-curious audience). Persist in localStorage like you do progress.
- **Optional light/sepia theme.** The dark cosmic theme is gorgeous and on-brand, but some readers (and daylight mobile use) struggle with long-form white-on-black. A sepia/light alternative is a real comfort win for a *reading* site. Optional — the dark theme is a brand asset, so make it a toggle, not a replacement.
- **Line length** (`--max-prose: 44rem`) is well chosen. Good.

### B6. Micro-interactions & delight **[P2]**

- **Copy / share a verse.** A tiny "copy" and "share" affordance on each verse block (and on the shahada) lets readers spread the exact wording — organic dawah.
- **"Verse of the moment"** on the landing hero (rotating from the Ch.5 set) adds life and invites the click into Ch.5.
- **Scroll-triggered emphasis** on the `.fazit` conclusions (a subtle gold underline draw-in) rewards reaching each logical payoff.

---

## PART C — Conversion & journey flow (moving readers forward, lowering the final barrier)

Your goal (per project notes) is to keep casual readers advancing chapter-to-chapter and, ultimately, to the message. The mechanics are strong; refinements:

- **The end-of-chapter card is your best conversion tool** — keep the single, prominent "Weiter" CTA (you do). Make sure the *teaser* for the next chapter creates a curiosity gap (Ch.1→2 does this well: "Die Antwort verändert alles").
- **A persistent, subtle "Deine Reise: ●●●○○○ · 3/6"** progress chip (from your localStorage data) on chapter pages reinforces momentum and the sunk-cost pull to finish.
- **The shahada moment (Ch.6) is the emotional climax.** Consider giving it even more space and calm — it currently sits mid-page among the five pillars. A reader who reaches "if you believe this, you only need to say…" deserves a distraction-free, beautifully framed moment (it's already a nice `.shahada-block`; consider making it a full-width, quiet section with the transliteration, translation, audio, and a single gentle "Ich habe Fragen / Kontakt" action).
- **Lower the contact barrier.** Email + Telegram + LinkedIn is good. Consider adding a simple, private "Ich habe eine Frage" form or a WhatsApp link (huge in the target demographic) — fewer readers will open a mail client than tap a chat link.
- **Optional, respectful email capture:** "Bekomme die 6 Stationen als PDF" / "Erinnere mich, weiterzulesen." Only if you can handle it privately and GDPR-cleanly. Don't nag.

---

## PART D — SEO, social sharing & distribution

- **`og:image` is missing on every page** (confirmed — no image assets exist at all in the repo). **This is the difference between a link that gets clicked and one that gets ignored** when shared on WhatsApp/Telegram/Facebook/Twitter. Design one share image per language (1200×630) — the brand mark ✦, the title "Die Reise zum Anfang von allem," the cosmic background. Reference it with `og:image` + `twitter:card = summary_large_image`. **[P0 for sharing]**
- **No favicon / touch icon** exists. Add `favicon.svg`, `favicon.ico`, and `apple-touch-icon.png` (the ✦ mark on the dark bg works perfectly). Cheap, and its absence looks unfinished in a browser tab. **[P0]**
- **Structured data for the argument/claims.** You have `Book` + `WebSite` JSON-LD. Add `Article` per chapter (with `headline`, `datePublished`, `inLanguage`, `isPartOf`) and consider `Question`/`Answer` schema on the objections page (A5) — it can win rich results for exactly the questions seekers type ("gibt es einen Gott beweis logik").
- **The placeholder domain `https://tareqla.github.io/TheFirstCause/` is hard-coded across all 24 pages + sitemap.** Before launch, decide the real domain (candidates noted: ersteursache.de / reisezumanfang.de / thefirstcause.org) and search-replace. See E2 for making this a one-place change in future. **[P0 before launch]**
- **Titles/descriptions** are strong and keyword-aware (good). Consider FAQ-style long-tail pages for common seeker queries as future content.

---

## PART E — Code quality & maintainability

### E1. The 24-page duplication problem **[P1]**

The nav, `<head>` boilerplate, side-dots, and footer are **copy-pasted into every one of the 24 HTML files** (8 pages × 3 languages). Every change (a new nav link, the domain replace, a favicon tag, the focus-CSS is fine since it's shared CSS, but markup isn't) must be made 24 times — error-prone and how pages drift out of sync. Options, cheapest first:

- **JS injection (no build step):** move the nav/footer into `main.js` as template strings rendered per-language (you already do this for the mobile menu). Keeps the current "just static files" simplicity.
- **A tiny build step** (11ty/Eleventy, Astro, or even a 30-line Node script with a partial) to assemble pages from a template + content. Best long-term; more setup.
- **HTML `<template>` + fetch include** or web-component partials — middle ground.

Given the site is otherwise dependency-free and deploys via GitHub Pages, the JS-injection route preserves your zero-build simplicity while killing the duplication.

### E2. Single-source the domain & shared meta **[P1]**

Tie into E1 — the canonical/OG base URL should live in one place so the launch-day domain swap is one edit, not 24×5.

### E3. Housekeeping **[P2]**

- The `.claude/launch.json` now has three server configs (I added `website-audit` on 8077 for this review — **you can delete that entry**; I'll revert it).
- Add a short `website/README.md` documenting the architecture (the memory notes are great raw material) so a future contributor (or you in 6 months) can onboard.
- Consider a basic HTML validation + link-check in the GitHub Action (catch broken links before deploy).

---

## PART F — Copy & content polish (UI copy only — never the book)

- The book text contains original typos by design (verbatim constraint) — **leave them.** Do **not** "fix" spellings like "Boycott" inside chapters; they're intentional.
- **Do** polish the *UI copy* you control (nav labels, teasers, buttons, the new pages) to a high standard — it frames the verbatim text.
- Ensure the German translation attribution (which translation of the Qur'an's meaning is quoted) is named on the DE site the way Isa García is credited on ES. Missing attribution on the primary edition is both a credibility and a rights issue.

---

## PART G — Scientific & philosophical sources (for readers who can't evaluate the physics themselves)

> **Added 2026-07-04 following the request:** a reader said she "can't evaluate the scientific / physikalische Argumente." This is the *most common and most important* reaction to the book — most people cannot personally judge cosmology, thermodynamics, or genetics, so they fall back on **"do credible, independent sources back this up?"** Your job is to hand them exactly that. Below is a curated, honest, source-backed reference layer you can put on the "Belege & Quellen" page (A3), plus per-claim honesty notes so you present it in a way a thoughtful skeptic will *respect* rather than dismiss.

### G0. The one principle that makes this credible to a skeptic

There are **two different kinds of statement** in the book, and blurring them is what makes smart readers distrust the whole thing:

1. **Established science** — facts the mainstream scientific community accepts (the universe began ~13.8 billion years ago; it is expanding; several constants appear "fine-tuned"; DNA stores vast coded information; the origin of the first life is genuinely unsolved; the 2nd law of thermodynamics). **These you can source to NASA, ESA, NIH, peer-reviewed papers.**
2. **Philosophical inference** — the step *from* those facts *to* "therefore a Creator" (Kalām cosmological argument; fine-tuning → designer; information → intelligence). These are **respectable, published, seriously-defended arguments**, but they are *philosophy built on the science*, **not themselves laboratory results.**

**Tell the reader this openly.** Say: *"Science gives us the facts. The conclusion 'therefore a Creator' is a logical/philosophical step from those facts — here are the facts (sources), and here is the reasoning (sources)."* Paradoxically, admitting the science-doesn't-literally-prove-God line is what convinces a careful person your *facts* are trustworthy. Over-claiming ("physics proves God!") makes them stop reading. This directly answers your friend: she can trust ESA on the Big Bang even if she never evaluates the philosophy — and she can see the two are clearly labelled.

Suggested on-site convention — a small badge on each claim:
`🔬 Gesicherte Wissenschaft` · `🧩 Wissenschaftlich diskutiert` · `💭 Philosophische Schlussfolgerung`.

### G1. Curated sources, by argument (🇩🇪 = German-accessible, good for your friend)

**A) The universe had a beginning (Ch. 1–2: "it can't be eternal / from nothing")**
- 🔬 🇩🇪 **ESA – Planck: Dem Urknall ins Auge blicken** — the European Space Agency on the cosmic microwave background, the direct "echo" of the Big Bang. Authoritative, German, image-rich. https://www.esa.int/Space_in_Member_States/Germany/Planck_Dem_Urknall_ins_Auge_blicken
- 🔬 **ESA – Cosmic Microwave Background** (English overview): https://www.esa.int/Science_Exploration/Space_Science/Cosmic_Microwave_Background_CMB_radiation
- 🧩 **Borde–Guth–Vilenkin (BGV) theorem** — proves that any universe expanding on average cannot be past-eternal; it must have a beginning. Vilenkin (2015): *"All the evidence we have says that the universe had a beginning."* Overview: https://en.wikipedia.org/wiki/Borde%E2%80%93Guth%E2%80%93Vilenkin_theorem · Accessible interview (Tufts): https://now.tufts.edu/articles/beginning-was-beginning
  - **Honesty note (important):** cite this carefully. It's real and strong, **but** co-author Alan Guth is personally open to a beginningless universe, and Sean Carroll argues it may not survive a full theory of quantum gravity. So present it as *"the leading cosmologists' theorem points to a beginning,"* not *"scientists have proven it."* If you overstate it, a physics-literate critic will correct you and you lose the room.
- 💭 **Stanford Encyclopedia of Philosophy – Cosmological Argument** (the reasoning from "began" → "cause"): https://plato.stanford.edu/entries/cosmological-argument/

**B) Fine-tuning of the universe for life (Ch. 3: expansion rate, gravity, forces, etc.)**
- 🔬 **Luke A. Barnes, "The Fine-Tuning of the Universe for Intelligent Life"** — a peer-reviewed literature review (PASA, 2012) showing fine-tuning is acknowledged across secular and religious physicists alike. The single best citable article for this chapter: https://arxiv.org/pdf/1112.4647
- 🔬 **Geraint Lewis & Luke Barnes, *A Fortunate Universe: Life in a Finely Tuned Cosmos*** (Cambridge University Press, 2016) — a whole book, co-written by two astrophysicists (one a theist, one not — which is why it's so credible). Recommend it to a friend who wants depth.
- 🔬 **Martin Rees, *Just Six Numbers*** (2000) — the Astronomer Royal on the six constants that must be "just right." Accessible, secular, authoritative.
- 🧩 🇩🇪 **Welt der Physik** (run by the German Physical Society, DPG) — credible German-language explainers on the Urknall and cosmology: https://www.weltderphysik.de/mediathek/podcast/urknall/
- 🧩 🇩🇪 **Wikipedia (de) – Feinabstimmung der Naturkonstanten / Urknall** — a neutral German starting point: https://de.wikipedia.org/wiki/Urknall
- 💭 **SEP – Fine-Tuning**: https://plato.stanford.edu/entries/fine-tuning/ · **SEP – Teleological Arguments** (fine-tuning → designer): https://plato.stanford.edu/entries/teleological-arguments/ — SEP itself notes the fine-tuning-for-a-designer argument is *"the strongest version of the teleological argument that contemporary science affords."* A great, non-religious source to cite.
  - **Honesty note:** fine-tuning as a *fact/puzzle* is mainstream; the *explanation* is contested (designer vs. multiverse vs. "we don't know yet"). Your Ch. 3 already argues against the multiverse — good; present it as *"here are the three options physicists debate, and here's why we find the Creator the best explanation,"* which is honest and strong.

**C) DNA, information, and the origin of life (Ch. 3: "the library in your DNA")**
- 🔬 **NIH / National Human Genome Research Institute** — the human genome is ~3.2 billion base pairs (confirms the book's figure) and functions as a coded blueprint: https://www.genome.gov · NIH "Genetics by the Numbers": https://biobeat.nigms.nih.gov/2024/04/genetics-by-the-numbers
- 🔬 **Origin of life (abiogenesis) is genuinely unsolved** — even mainstream science agrees the step from non-living chemistry to the first information-carrying life is *largely unknown*: https://en.wikipedia.org/wiki/Abiogenesis (see the "well understood → largely unknown" framing). This is a *legitimate* gap you can point to honestly.
- 💭 **Stephen C. Meyer, *Signature in the Cell*** (2009) — the fullest articulation of the "information in DNA implies a mind" argument. **Flag it honestly:** this is the *Intelligent Design* position, which **mainstream biology rejects** (it holds evolution + unguided abiogenesis as the scientific account). So: cite the *facts* (DNA is information-dense; origin of life unsolved) to neutral sources, and present the *inference* to intelligence as a philosophical argument (Meyer / teleological argument), **not** as biology's consensus. If you blur this, biologists will dismiss the site instantly.

**D) Thermodynamics (Ch. 2: an eternal universe would have "run down")**
- 🧩 **Heat death of the universe / 2nd law** — the argument that an eternal universe would already have reached maximum entropy: https://en.wikipedia.org/wiki/Heat_death_of_the_universe
  - **Honesty note:** this is a *debated* apologetic argument, not a settled proof (critics note entropy may not apply straightforwardly to an infinite or open universe). Use it as *supporting/suggestive*, and lean on the BGV + Big Bang evidence as your primary case for a beginning.

**E) The philosophical bridge & the Islamic articulation**
- 💭 **SEP – Cosmological Argument** (covers the *Kalām* argument by name — the exact structure of your book): https://plato.stanford.edu/entries/cosmological-argument/
- The **Sapience Institute** and **Hamza Tzortzis** (already in your Ressourcen page) give the modern Islamic articulation with academic footnotes — point readers there for the "logic → Islam" step specifically.

### G2. How to put this on the site (concrete)

- On the **"Belege & Quellen" page** (audit item A3), add a section **"Für alle, die die naturwissenschaftlichen Argumente selbst prüfen möchten."** List each claim → the modern finding → the year → the authoritative source link → a credibility badge (G0). A clean table does this beautifully.
- Add a small **"🔬 Die Wissenschaft dahinter"** expander (`<details>`) at the end of Chapters 2, 3 and 5, linking the 2–3 best sources for *that* chapter's claims. Keeps the reading flow clean (it's collapsed), but a doubter can open it instantly. Additive — the verbatim text is untouched.
- Recommend **1–2 books by name** for a friend who wants to go deeper without evaluating equations herself: *A Fortunate Universe* (Lewis & Barnes) and *Just Six Numbers* (Rees). Both are written by professional astrophysicists for a general audience — perfect for exactly the reader who said she can't judge the physics.
- **Prefer German sources where they exist** (flagged 🇩🇪) for the DE edition so your friend isn't sent to an English wall of text.

### G3. Two honesty guardrails (they protect your credibility)

1. **Verify every number and date before publishing** (repeat of audit A2, but critical here): "1929 Hubble," "1927 Lemaître," expansion-rate precision figures, "3.2 billion base pairs," the Roman-prophecy dates. One wrong figure lets a critic wave the rest away.
2. **Never upgrade a philosophical inference into a scientific claim.** "Scientists proved the universe needs a Creator" is false and checkable; "the universe had a beginning (science), and a beginning needs a cause (logic)" is defensible. The second convinces your friend; the first loses her the moment she Googles it.

---

## PART H — Keeping readers reading: visuals, animation & momentum

You asked me to think again about what keeps readers going — animations and pictures. There's a lovely synergy with the request above: **the right visuals make the physics arguments graspable to a non-physicist** (your friend), *and* they pull readers to the next chapter. Below, ordered by impact. All of it is additive; none touches the book text.

### H1. Turn the arguments into visuals (this also solves "she can't evaluate the physics") **[P1]**

Abstract physics becomes intuitive when you can *see* it:

- **The domino chain (Ch. 3 already uses this metaphor!)** — an animated line of dominoes (Urknall → Sterne → Sonne → Erde → Leben → Mensch) that topples as the reader scrolls, ending on "…and something had to tip the first one." You already wrote the metaphor; animating it is pure reinforcement.
- **A fine-tuning "dials" interactive** — a few sliders (gravity, expansion rate, strong force). Nudge one and a little universe on screen "collapses" or "flies apart." Nothing teaches fine-tuning faster. **Use the real, cited ranges** (e.g., expansion-rate precision ~1 in 10⁵⁷ per the German sources) and show the source — an honest interactive is far more convincing than an invented one.
- **Expanding-universe / Big-Bang timeline** — a horizontal scroll or animation from the hot dense start to today, with the CMB. Pair with the ESA Planck image (real data, public-domain, on-brand).
- **The DNA "library"** — an animated double helix that "unzips" into A/T/C/G letters, with the line "3.2 billion letters — enough to fill 1000 books." Makes the Ch. 3 point visceral.
- **The cosmological argument as an animated flow** — the argument map from audit A4, but each premise slides in and connects as you scroll, ending on the glowing "Erste Ursache." Communicates "this is a proof" at a glance.

> Guardrail: these are *explainers*, so they must be accurate and cited. A wrong animation is worse than none. Keep them light (SVG/CSS/Canvas, no heavy libraries) so the site stays fast.

### H2. Scroll-driven storytelling (upgrade what you already have) **[P1]**

You already have `.reveal` fade-ups and a starfield — you're 80% of the way to "scrollytelling." Push it a little:

- **Pin-and-reveal key moments:** briefly pin a `.big-question` or `.fazit` in the center of the screen as the reader scrolls past, so the emotional/logical beats *land* instead of sliding by.
- **Progressive reveal for lists** (the fine-tuning conditions in Ch. 3, the scientific facts in Ch. 5): reveal them one by one on scroll so the *accumulation* feels overwhelming — which is the rhetorical point.
- **A living starfield that reacts** — e.g., stars drift toward a single point of light at the "Erste Ursache" conclusion. Subtle, thematic.

### H3. Imagery strategy (pictures — and a credibility two-for-one) **[P1]**

The site is currently **text + starfield only — no photographs or illustrations at all.** Adding imagery both breaks up long reading and raises perceived quality. Best part: **real space-agency imagery is beautiful, free to use, *and* reinforces "this is grounded in real science."**

- **Chapter hero images:** each chapter opens on the same generic gradient. Give each a distinct, relevant image behind the number:
  - Ch. 1 (nothing) — a stark empty/void image or the lone chair-in-empty-room from the analogy.
  - Ch. 2/3 (cosmos, Big Bang, fine-tuning) — **NASA/ESA Hubble & JWST photos** (galaxies, nebulae, the Pillars of Creation, the CMB map).
  - Ch. 3 (DNA) — a clean DNA-helix render.
  - Ch. 5 (the message) — Arabic calligraphy / a mushaf, an old manuscript (ties to the "preservation" argument).
  - Ch. 6 (civilization) — historical Islamic science/architecture (Alhambra, an astrolabe, a manuscript from the House of Wisdom).
- **Where to get them (free, licensed, credible):**
  - **NASA image library** (images.nasa.gov) and **ESA/Hubble** — most are public-domain or freely usable *with attribution*; check each. Perfect for the cosmology chapters.
  - **NASA JWST / Webb** gallery for stunning recent deep-field images.
  - Unsplash / Pexels for generic textures (void, night sky) under their free license.
  - **Always keep the attribution/license** in a small credits line or the `alt`/`title` — matches your credibility theme.
- **Technical must-dos:** compress (WebP/AVIF), `loading="lazy"`, explicit `width`/`height` (no layout shift), meaningful `alt` text (accessibility + SEO), and keep a dark overlay so gold text stays readable. Don't let images bloat the page — they should enhance, not slow.
- **This also fixes the missing `og:image`** (audit D1): the hero image you pick per chapter can double as the social-share card.

### H4. Momentum & gentle gamification (finish-the-journey pull) **[P1/P2]**

You already have progress in localStorage — surface it more to exploit the "I've started, I'll finish" instinct:

- **A persistent progress chip on chapter pages:** `Deine Reise ●●●○○○ 3/6` — visible sunk-cost momentum.
- **"Station III von VI" + estimated time remaining** in the chapter meta, so the end always feels reachable.
- **Stronger next-chapter cliffhangers.** Your Ch. 1→2 teaser ("Die Antwort verändert alles") is perfect; make every end-card teaser a curiosity gap that *withholds* the payoff.
- **A subtle completion reward** — when the 6th station is finished, a small celebratory moment (a bloom of gold stars, a quiet "Du hast die Reise vollendet") before the final CTA. Emotional payoff → more likely to act/share.
- **Auto-peek the next chapter:** as the reader nears the end-card, let the next chapter's title/number fade in just above the fold of the CTA.

### H5. Micro-animations & delight **[P2]**

- Verse blocks: a slow fade + slight scale-in as each enters view (they're your emotional peaks — let them breathe).
- `.fazit` conclusions: a gold underline that "draws" itself in when revealed — rewards reaching the logical payoff.
- Buttons already animate the arrow (nice) — extend that consistency to the station cards and resume pill.

### H6. Guardrails for all animation/imagery **[keep in mind]**

- **Respect `prefers-reduced-motion`** (you already do for reveals — extend it to any new scroll/interactive animation; provide a static fallback).
- **Performance budget:** the site's speed is part of its premium feel. Lazy-load images, prefer CSS/SVG/Canvas over heavy JS libraries, don't autoplay video with sound, and test on a mid-range phone.
- **Accessibility:** interactives need keyboard operation and `alt`/labels; never convey a key argument *only* through an animation a screen-reader user can't access — keep the verbatim text as the source of truth.
- **Accuracy > flash:** since several of these visuals explain contested/technical claims, an inaccurate animation undermines the very credibility you're building. Cite sources on interactives; when in doubt, keep it simpler and correct.

---

## Prioritized roadmap

### P0 — do first (high impact, low effort, or launch-blocking)
| # | Item | Why | Effort |
|---|------|-----|--------|
| A1 | Clickable/verifiable Quran references (JS auto-linker) | Turns every assertion verifiable; 0 content change | ~1–2 h |
| B3 | Visible `:focus-visible` styles + skip link + canvas `aria-hidden` | WCAG failure; keyboard users | ~1 h |
| D1 | `og:image` share images (×3 lang) | Shared links currently look broken/blank | ~2–3 h |
| D2 | Favicon / touch icons | Looks unfinished without it | ~1 h |
| D4 | Replace placeholder domain before go-live | Wrong canonical hurts SEO/sharing | ~30 min (once) |
| A2 | Verify every empirical stat/date + start a sources list | One wrong figure discredits the whole site | ongoing |

### P1 — high value
| # | Item | Effort |
|---|------|--------|
| A2/A3 | "Belege & Quellen" apparatus + dedicated evidence page | 1–2 days |
| A4 | Argument-map / logic diagram | ½ day |
| A5 | "Common objections" accordions | ½–1 day (your copy) |
| A6 | Reframe/sourcing strategy for the science claims | your decision |
| A7 | Author/project transparency section | 2–3 h |
| B1/B2 | Fix side-dots breakpoint; add in-chapter mini-TOC + "X von 6" | 3–4 h |
| B4 | Self-host fonts (GDPR) + starfield throttle | 3–4 h |
| E1/E2 | De-duplicate nav/footer; single-source domain | ½–1 day |
| G1/G2 | "Belege & Quellen" science section — per-claim sources + credibility badges + "Wissenschaft dahinter" expanders | 1 day |
| H1/H3 | Argument visuals (domino, fine-tuning dials, DNA helix) + real NASA/ESA imagery per chapter | 1–3 days |
| H4 | Progress chip "3/6", cliffhanger teasers, completion reward | 3–4 h |

### P2 — nice to have
Reading-mode / font-size control · optional sepia theme · copy/share-verse · verse-of-the-moment · WhatsApp contact · email capture · Article/QA structured data · README + link-check CI.

---

## Appendix — ready-to-use snippets {#appendix}

> These are drop-in starting points. Test each in the local preview (`launch.json` → `website` on :8000) before committing. **None of them modify chapter text.**

### A1 — Auto-link Quran references (add to `main.js`, runs on every page)

```js
/* ---------- Make Quran references clickable (content untouched) ---------- */
(function linkifyQuranRefs() {
  // 1) The gold [surah:ayah] tags under verse blocks
  document.querySelectorAll(".verse-ref").forEach(function (el) {
    if (el.querySelector("a")) return;
    var m = el.textContent.match(/(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?/);
    if (!m) return;
    var ref = m[3] ? m[1] + ":" + m[2] + "-" + m[3] : m[1] + ":" + m[2];
    var a = document.createElement("a");
    a.href = "https://quran.com/" + ref;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Vers " + ref + " auf quran.com lesen");
    a.textContent = el.textContent;
    el.textContent = "";
    el.appendChild(a);
  });

  // 2) Inline (surah:ayah) citations inside chapter prose — text nodes only,
  //    so the book text is never edited in the HTML source.
  var RE = /\((\d{1,3}):(\d{1,3}(?:-\d{1,3})?)\)/g;
  document.querySelectorAll(".prose p, .prose li").forEach(function (p) {
    if (RE.test(p.textContent) === false) return;
    // snapshot child nodes first (we mutate the DOM while iterating)
    Array.prototype.slice.call(p.childNodes).forEach(function (node) {
      if (node.nodeType !== 3) return;                 // text nodes only
      var s = node.nodeValue;
      RE.lastIndex = 0;
      if (RE.test(s) === false) return;
      RE.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0, m;
      while ((m = RE.exec(s))) {
        frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var a = document.createElement("a");
        a.href = "https://quran.com/" + m[1] + ":" + m[2];
        a.target = "_blank"; a.rel = "noopener";
        a.textContent = m[0];
        frag.appendChild(a);
        last = m.index + m[0].length;
      }
      frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  });
})();
```
Style the new links subtly so they don't shout: `.verse-ref a{color:inherit;border-bottom:1px dotted var(--line)} .prose a[href*="quran.com"]{color:var(--gold);text-decoration:none;border-bottom:1px dotted var(--line-soft)}`.

### B1 — Fix the side-dots / hamburger overlap
```css
/* was: only hidden below 520px. Align it with the nav collapse at 720px. */
@media (max-width: 720px) {
  .side-dots { display: none; }
}
```

### B3 — Focus states + skip link
```css
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  border-radius: 4px;
}
.skip-link {
  position: absolute; left: -999px; top: 0; z-index: 200;
  background: var(--gold); color: #10131c; padding: .7rem 1.2rem;
  font-family: var(--sans); font-weight: 600; border-radius: 0 0 8px 0;
}
.skip-link:focus { left: 0; }
```
```html
<!-- first element after <body> on every page -->
<a class="skip-link" href="#main">Zum Inhalt springen</a>
<!-- and add id="main" to <main> (or the hero) -->
```
```html
<!-- starfield on every page -->
<canvas id="stars" aria-hidden="true" role="presentation"></canvas>
```

### A4 — Argument-map starter (drop into the landing page or evidence page)
```html
<section class="section" aria-label="Die logische Argumentationskette">
  <p class="section-kicker reveal">Die Beweiskette</p>
  <h2 class="section-title reveal">Vom Nichts zur Ersten Ursache — Schritt für Schritt</h2>
  <ol class="logic-chain reveal">
    <li><span class="lc-tag">Prämisse 1</span>Aus dem Nichts entsteht nichts.</li>
    <li><span class="lc-tag">Prämisse 2</span>Das Universum begann zu existieren.</li>
    <li><span class="lc-tag">Prämisse 3</span>Es kann sich nicht selbst verursacht haben, nicht ewig sein, nicht Zufall sein.</li>
    <li><span class="lc-tag lc-concl">Schlussfolgerung</span>Es gibt eine notwendige, willentlich handelnde Erste Ursache.</li>
    <li><span class="lc-tag">Eigenschaften</span>Ewig · allmächtig · allwissend · einzig.</li>
    <li><span class="lc-tag lc-q">Die Frage</span>Welche Botschaft beschreibt genau diese Ursache?</li>
  </ol>
</section>
```
Style each `<li>` as a connected step (reuse `.argument`/`.fazit` gold vocabulary; a vertical connector like the journey timeline's `::before` ties them into a visible chain).

### D1/D2 — Asset checklist
- `website/og-de.png`, `og-en.png`, `og-es.png` — 1200×630, brand ✦ + title + cosmic bg.
- `website/favicon.svg` (✦ gold on `#060a13`), `favicon.ico`, `apple-touch-icon.png` (180×180).
- Head tags: `<meta property="og:image" content="…/og-de.png">`, switch `twitter:card` to `summary_large_image`, add `<link rel="icon" href="favicon.svg" type="image/svg+xml">` + `<link rel="apple-touch-icon" href="apple-touch-icon.png">`.

---

## Sources consulted
- [Quran.com Ayah Embed Builder](https://quran.com/embed) — official verse embed/iframe + deep-link format (`surah:ayah`).
- [Deconstructing the "Scientific Miracles in the Quran" Argument — Traversing Tradition](https://traversingtradition.com/2018/04/09/deconstructing-the-scientific-miracles-in-the-quran-argument/)
- [Navigating the 'scientific miracles' narrative — Qarawiyyin Project](https://qarawiyyinproject.co/2021/11/22/navigating-the-scientific-miracles-of-the-quran-narrative/)
- [Does the Qur'an Contain Scientific Miracles? A New Approach — Hamza A. Tzortzis](https://www.hamzatzortzis.com/does-the-quran-contain-scientific-miracles-a-new-approach/)
- [The "Scientific Miracle of the Qur'ān," Pseudoscience, and Conspiracism — Zygon Journal](https://www.zygonjournal.org/article/id/14373/)

*End of audit. Nothing above changes the book text; all evidence/credibility gains are additive. Start with the P0 table.*
