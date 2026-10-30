# CLAUDE.md

Instructions for Claude Code sessions working on this repository.

## What this is

An English course assignment: the personal site of Galih Fajar Fahreza, built as one static page in plain HTML, CSS, and JavaScript. The copy is graded English writing, so it has to read well aloud. There is no framework, no build step, and no package.json.

**Hosting:** GitHub Pages, opened directly in the browser. The site is **not embedded in Google Sites**, so there is no iframe handling and no "Open full page" link. Do not add them back. It must still work from `file://` (data loads through `<script src>`, never `fetch`).

**Design concept:** *kinetic editorial, with a stationery-and-stickers feel*, laid out like the pages of a dictionary:
- Every section opens with a **running head** (a rule, the h2, a grammar tag, and a folio such as "p. 2"). That is the page's alignment logic.
- The hero name is a **justified variable-width type block**: three words at one font size, each stretched on the width axis to the same measure.

## Page order

Single page with a sticky nav: Intro video, CV, E-commerce, Journals. There is no separate Experience section: every experience entry lives in the CV. The link for the section in view gets `aria-current="location"` and a tomato underline. main.js does this with an IntersectionObserver line, never with scroll handlers that read layout.

1. **Home / hero** (`#top`, `100svh` minus the header, with a `100vh` fallback):
   - the left 8 columns hold "Galih" (wdth 150%), "Fajar" (139%, blue), and "Fahreza" (90%), with a row of three stickers underneath;
   - the right 4 columns hold the dictionary entry: syllables, "proper noun", three numbered senses, the lead, two buttons, and the optional photo;
   - a visible 12-column grid, a lemon starburst, and the marquee along the bottom edge.
2. **Self-introduction video** (`#intro-video`, p. 2, tag "noun phrase", nav label "Intro video"): only the video stage, centered (`.intro-stage`, max 1040px). There is no About text, no glossary, no script panel, no side column, and no on-page setup note; the setup instructions live in README.md.
3. **CV** (`#cv`, p. 3, "How to write a CV as an Informatics undergraduate", tag "wh-infinitive clause"):
   - the intro;
   - the guide: a sticky thumb index plus 13 `<details>` steps;
   - "Galih's CV, annotated", with a version switch (Master, Full-stack developer, Cybersecurity), the optional PDF button, and a CV sheet with numbered margin marks;
   - the final recommendation.
4. **E-commerce** (`#ecommerce`, p. 4): the Introduction, the ink debate floor with the balance scale, and the Conclusion.
5. **Journal reading list** (`#journals`, p. 5).
6. **Footer** (ink): the name, "Informatics, Universitas Ahmad Dahlan", NIM 2300018254, and only the contact links set in config.

Color wipes (`.wipe`) separate the sections in this order: tomato, blue, lemon, tomato, blue, then lemon before the footer.

## File map

```
index.html            Static copy and section skeletons (video stage, CV shells, essay, etc.)
css/style.css         Tokens, @font-face, Lenis rules, layout, states, .js-motion rules, video loops
js/main.js            Content and behavior (no GSAP): nav highlight (watchLine), video facade, photo,
                      projects, essay accordions + scale, journals + filters, footer links.
                      Exposes window.watchLine and window.hasBugBounty. Emits site:* events.
js/cv.js              CV section: the finished CV in guide order, 5-version switch, final review
js/motion.js          Every GSAP animation, Lenis, and the pin, behind one feature check
js/vendor/            gsap, ScrollTrigger, Flip, SplitText (GSAP 3.15), lenis (1.3, MIT). Self-hosted.
data/config.js        CONFIG: github, linkedin, portfolio, email, photo, photoAlt, cvPdf, video {...}
data/cv.js            CV: intro, contact, steps (guide labels), education, experience, versions (5), checklist, spec
data/photos.js        PHOTOS: every image slot { id, group, src, alt, caption, ratio, spec, path, width, height, frame, hidden }
js/photos.js          Photo-slot component: placeholder or lazy <img>, galleries, <dialog> lightbox
data/journals.js      JOURNALS (five papers); keep exactly as is
fonts/                Anybody (wdth 50-150, wght 100-900) and Newsreader (normal + italic), woff2 + OFL
assets/               favicon.svg; put photo, video (assets/video/), and CV PDF (assets/cv/) here
_inbox/               Private working folder, git-ignored, never published
README.md             Indonesian step-by-step guide for the owner
```

Script order at the end of `<body>`: config, projects, journals, cv, photos, main, cv (js/cv.js), then gsap, ScrollTrigger, Flip, SplitText, lenis, then motion.

## Facts about the owner (use only these)

- Name: Galih Fajar Fahreza
- S1 Informatics student at Universitas Ahmad Dahlan (UAD), Yogyakarta
- Vocational school (SMK) background in Computer and Network Engineering (TKJ)
- Full-stack developer (React, Laravel)
- Founder of V-Code, a software house
- Interested in cybersecurity: CTF, bug bounty, penetration testing
- Enjoys gaming
- NIM 2300018254 (footer only)

Anything else (CV entries, dates, bug bounty details, the video script) must come from files the owner provides in `_inbox/`. The expected sources are `_inbox/CONTENT_CV_Video.md` (A: the CV, B: the tailored versions, C: the 13-step guide, D: the planner, E: the video script) and `_inbox/bug-bounty.md`. At the time of writing, neither file existed, so the CV, guide, script, and bug bounty data are empty and render designed "coming soon" states.

## Content rules

- Never invent facts about the owner: no made-up projects, employers, clients, awards, years, dates, timelines, opinions, pronunciations, platforms, programs, rewards, rankings, findings, or numbers. If a source file is missing, render the empty state and list what is missing. Do not draft content in its place unless the owner asks.
- **Never put a fake YouTube ID or video path in `data/config.js`.** Leave `video.id` and `video.src` empty until a real video exists.
- The e-commerce essay text is fixed. Change its presentation, never its words, unless the owner asks.
- The CV guide text is built from section C of the content pack in the owner's voice, without new claims. Every visible sentence of the guide and the CV lives in `data/cv-guide.js` and `data/cv.js`; js/cv.js only adds structural labels (Step N, "Example for:", "Your plan", "Galih's plan", "N of M done", "Moved up", "Moved down", "Rewritten", "Changed in this version").
- **CV privacy:**
  - Never publish the phone number or email on the CV.
  - The contact line shows only `CV.city` plus the LinkedIn, GitHub, and portfolio links that are set in config.
  - Leave `[CONFIRM]` flags out of the data. Report them to the owner instead.
  - Mark the Desa Cisempur village website item exactly as the CV states, through the entry's `note`.
- **CV PDF:** the button shows only when `CONFIG.cvPdf` is set. Do not probe for the file with `fetch`: a missing file would log a 404 for every visitor.
- **Bug bounty safety:** never publish target names, undisclosable program names, exploit steps, endpoints, payloads, or anything a program's disclosure rules forbid. If the source looks sensitive, leave it out and ask.
- No email, phone, or private data anywhere in the page except the footer email link, and only if the owner sets it.
- Keep the journal summaries exactly as written.
- Stay dependency-free at runtime: no frameworks, no CDNs, no Google Fonts link, no npm packages in the repo.
- Build dynamic content with `createElement` and `textContent`, never `innerHTML` with data.
- External links open in a new tab with `rel="noopener noreferrer"` and a visually hidden "(opens in a new tab)" note.

## Voice

All visible text is English: advanced but relaxed, still polite. Proofread every sentence for grammar, agreement, and punctuation.

- Precise vocabulary, active voice, varied sentence length. First person is fine.
- Use linking words naturally (however, in contrast, as a result, for instance, in turn, on balance).
- No em dashes or en dashes in prose (page ranges in citations are fine). Straight quotes. Sentence-case headings.
- No filler openers, no "not X but Y" contrasts, no one-line dramatic closers, no triads written only for rhythm.
- Banned words: crucial, pivotal, robust, seamless, leverage, delve, tapestry, testament.
- Grammar labels must be correct:
  - "Self-introduction video" is a noun phrase.
  - "How to write a CV as an Informatics undergraduate" is a wh-infinitive clause.
  - "e-commerce" is an uncountable noun.
  - "My CV as an Informatics undergraduate" and "Journal reading list" are noun phrases.
  - break, build, and play are verbs.
  - TKJ and UAD are abbreviations.
  - V-Code and "Galih Fajar Fahreza" are proper nouns.

## Design tokens

| Token | Hex | Use |
| --- | --- | --- |
| paper | `#F3F2EE` | Page background, reading surfaces, the CV sheet |
| ink | `#15142B` | Text, outlines, hard shadows, debate floor, video screen, footer, folios |
| ink-soft | `#4A4960` | Secondary text on paper or lemon |
| blue | `#2A35FF` | "Fajar", links on paper, web and Cybersecurity chips |
| lemon | `#FFE45C` | Marquee, highlighter, "For", conclusion, role examples, glow, viewfinder |
| tomato | `#FF5035` | "Against", drop cap, wipes, progress bar, CV margin marks. **Never text on paper (2.9:1).** |

Approved text pairs (all AA): ink on paper, lemon, or tomato; paper on blue or ink; lemon on blue or ink; blue on paper or lemon. On ink, the focus ring switches to lemon through `--focus`.

Type:
- **Anybody** for display and UI. The hero lines share `font-size: calc(100cqi / 4.18)` and differ only in `font-stretch` (150%, 139%, and 90%). Never let them wrap. Section titles run at 70% to 76% stretch, with tracking of -0.03em and line-height 0.92.
- At 50% stretch and weight 900, never use negative tracking (glyphs collide).
- **Newsreader** for text: 19px, line-height 1.6, measure capped at 34em. The CV sheet uses Newsreader so it reads like a document.

Shapes and details:
- 3px outlines.
- Hard offset shadows only on pressable things (buttons, filters, tabs, journal links, open accordions and steps, CV margin marks, the play button) and on stickers.
- Pressed states use the CSS `translate` property (GSAP owns `transform`).
- No gradients and no blur, **with two sanctioned exceptions in the video stage**, both requested by the owner:
  - the rotating ring is a `conic-gradient` with hard stops in the four palette colors, so it reads as color blocks;
  - the glow behind the frame is a low-opacity lemon `filter: blur()`.
  Never add others.
- `[hidden]` always wins (`display: none !important`), so component display rules can never reveal hidden UI.

## The video stage (Self-introduction video)

- **Data:** `CONFIG.video` holds `{ provider: "youtube" | "file", id, src, poster, title, captions } (title is the player's accessible name; the section heading is the visible title)`.
- **States:**
  - **Empty** (no valid 11-character YouTube ID and no file `src`): a disabled dashed play button, "Introduction video coming soon", and REC reading "Standby".
  - **YouTube:** a click-to-load facade. The iframe is created only on click, from `https://www.youtube-nocookie.com/embed/ID?rel=0&autoplay=1` (autoplay only after that click), with `title` set. REC reads "Press play", then "YouTube". Never autoplay before a click.
  - **File:** a `<video controls preload="metadata">` created on click, with captions as a `<track>`. The REC dot, the timecode, and the equalizer run only between the `play` and `pause`/`ended` events (`.is-playing`).
- **Loops** (CSS only, under `prefers-reduced-motion: no-preference`, and only while `.vstage.is-onscreen`, set from an IntersectionObserver in main.js):
  - the ring through `@property --angle` (it falls back to static where `@property` is unsupported);
  - the glow pulse;
  - the badge rotation (an SVG `textPath`, "Hello, I'm Galih, hello, I'm Galih,");
  - five floating inline-SVG stickers on different phases (three on mobile).
  These and the marquee are the only infinite loops on the page.
- **GSAP (motion.js `videoStage`):**
  - the frame's clip-path wipe and the bracket tightening, once;
  - sticker scroll parallax at 700px and up;
  - on a fine pointer, a tilt of at most `TIME.tiltMax` (5°) and sticker mouse pull. The tilt rests once a player loads.

## The CV section (js/cv.js)

Source: `_inbox/CONTENT_CV_Informatics_v2.md` (replaces sections A to D of `CONTENT_CV_Video.md`; section E, the video script, still comes later). The section shows Galih's finished CV, not a how-to guide:
- **Parts in guide order:** contact (Step 3), profile (4), education with coursework and academic projects (5), experience (6), skills and languages (7), projects and portfolio (8, 9), certifications (8), references (10). Each part carries a tomato step mark.
- **Five versions:** Master, Full-stack developer, Cybersecurity analyst, Software tester (QA), IT support and network technician (`aria-pressed` switch, short crossfade). A version changes only the profile, the experience order and wording (`id` or `id:variant`), the skills, and the portfolio, and marks each changed part.
- **Final review:** the Step 13 checklist, stated as done, with proof lines. Below the sheet sits a format spec line.
- **Approved by Galih on 30 October 2026:** coursework, academic projects, security tools, every EDM detail, the secretary training, the QA self-test, and bug reporting.
- **Approved in the v2 revision:**
  - the hero senses (student, full-stack developer, bug hunter, founder of V-Code) and the title "Bug hunter" for the bug bounty work;
  - the thesis, "Design and Development of a Real-Time Phishing URL Detection System Based on Random Forest and XGBoost with SHAP Feature Selection", in progress at the proposal stage. Never name supervisors or invent results;
  - the expanded SMK entry, including the school-representative roles, with no placement claimed;
  - the four academic projects (the Cyberpunk post-mortem is removed);
  - "Computer Technician (PKL work placement)" for Smart Comp.
- **Still withheld (also):** the thesis dataset detail (URL-Phish v2, 116,600 URLs), the Smart Comp year, MikroTik as a skill, and the representative roles listed under certifications.
- **Still withheld, ask before adding:** the Desa Cisempur village website ("later"), and the GitHub link. Three profiles (Full-stack, Cybersecurity, QA) had their Cisempur clauses removed. VPS deployment is left out for the same reason.
- **Bug hunter (CV only):** `experience.bounty` holds **DUMMY** text supplied by Galih: a summary, scope, three bullets, a story, and chips. It is flagged `placeholder: true` with a `// DUMMY` comment per item, and the variant `bounty:short` (summary and chips) is used on the Cybersecurity and QA tabs. js/cv.js logs every placeholder item through `console.info`. Never show a "dummy" label on the page, and never expand the dummy text with numbers, platform or program names, rewards, rankings, or targets. Replace it only with facts from `_inbox/bug-bounty.md` (template: `BUG_BOUNTY_TEMPLATE.md`).

## Photo slots

- Every image comes from `data/photos.js`. An empty `src` renders a designed placeholder (correct ratio, camera icon, target path, size, caption idea). A real `src` renders an `<img>` with width, height, `loading="lazy"`, `decoding="async"`, and alt text. `hidden: true` removes a slot.
- Placement:
  - the hero portrait (a tilted 4:5 card with tape and two floating stickers, inside `.entry-top`);
  - the EDM gallery (a horizontal snap scroller) and the Muara Sikabaluan gallery (desktop and phone mockup frames plus screenshots) inside those CV entries (`gallery` on the entry);
  - in the CV, the CV photo, the V-Code logo, the certificate, and the setup photo on the Cybersecurity tab.
  The video poster is data only: it becomes the poster of the facade when set.
- Gallery images open a `<dialog>` lightbox (Esc closes, arrow keys move, focus returns to the opener). Never add motion that depends on a photo being present.
- `og:image` points to `assets/images/og-image.jpg`, a generated placeholder. It needs an absolute URL once the Pages address is known.
- `#cv-sheet` in index.html holds a static snapshot of the Master CV for readers without JavaScript. js/cv.js replaces it on load. **When `data/cv.js` changes, refresh the snapshot:** render the master tab, then copy `#cv-sheet` innerHTML into the article.
- CV tabs are a real `role="tablist"` (`aria-selected`, roving tabindex, arrow keys, Home and End), and `#cv-sheet` is the tabpanel.

## Animation rules (js/motion.js)

- **One feature check:** gsap, ScrollTrigger, Flip, and SplitText must load, and reduced motion must be off. Otherwise nothing is hidden, and Lenis and the pin never start. Lenis is optional. `js-motion` goes on `<html>` only after the check. Hidden starting states come from GSAP `fromTo`. Any error calls `teardown()`.
- **Two named eases:** `enter` (back.out(1.4)) and `exit` (power2.in). CSS uses the matching `--enter`. Scrubbed and looping tweens use `none`. Durations stay between 0.3s and 0.9s, except the load sequence (about 1.6s, faster on mobile).
- **Timings live in `TIME`,** including `frameWipe`, `bracketTighten`, `tiltMax`, and `stickerPull`.
- **Animate transform, opacity, and clip-path only.** The one-shot exceptions are:
  - the hero font-variation morph;
  - the highlighter `background-size`;
  - the measured `height` of the essay cards (one shared tween).
  The `@property --angle` ring is a CSS loop.
- **Scrolling:**
  - Lenis smooths the wheel at 700px and up only.
  - In-page links go through `lenis.scrollTo(number)`. The number is computed as the target top minus the header height minus 12px, because passing an element makes Lenis stack its own offsets. Afterwards they move focus to the target and push the hash.
  - Keyboard, scrollbar, and touch stay native. Never trap the user.
- **No pinned sections.** The "At a glance" glossary pin was removed with the About block.
- **Overshoot must never cause horizontal scroll** (`overflow-x: clip` on sections, and the wipes scale an inner span).
- **Required moments:**
  - the load timeline;
  - the scrubbed hero;
  - the marquee;
  - the heading reveals;
  - the section wipes;
  - the height tweens;
  - the journal FLIP;
  - the magnetic buttons and the cursor ring (fine pointer only);
  - the progress bar and the starburst parallax;
  - the video stage.
- **Setup is split across frames** (rAF, then requestIdleCallback). Never read layout in scroll handlers. Use `watchLine` (IntersectionObserver) instead.
- **CSS transitions and loops** live inside `@media (prefers-reduced-motion: no-preference)`.

## Quality floor

- Responsive from 360px to 1920px, with no horizontal scroll and no clipped text. At 479px and below, the five nav links shrink to 13px (12.5px at 389px and below).
- On mobile:
  - a smaller hero;
  - no Lenis, no pin, no cursor, no magnetic effect, no tilt, and no parallax;
  - three stickers around the video.
- Visible `:focus-visible` outlines, skip link, semantic landmarks, AA contrast, `color-scheme: light`, and full keyboard operation. Tabs use `role="tab"` and `aria-selected`. Filters and the CV switch use `aria-pressed`. The player has a visible title and an accessible name.
- The HTML ships every essay accordion open, and main.js closes them.
- No layout shift from animation: the frame wipe uses clip-path, and the video screen reserves 16:9 with `aspect-ratio`.

## Visual verification

After every UI change:

1. Serve the site: `python -m http.server 8765 --bind 127.0.0.1`.
2. With Playwright in a scratch folder (never in this repo), at 1280px and 390px:
   - **Shipped state:** first paint, after the load sequence, the intro video empty state (with a pointer tilt on desktop), the CV empty states, and the footer.
   - **Fixture data, injected only through `context.route`:** clearly labeled "[Fixture]" files for `data/cv-guide.js`, `data/cv.js`, and `data/bug-bounty.js`. Use them to shoot each role tab, a generated plan, "Show this on Galih's CV", the checklist (reload to confirm it persists), all three CV versions, a margin mark opening its step, and the filled bug bounty entry. Never write fixture data or fake video IDs to the repo.
   - **Variants:** `reducedMotion: 'reduce'` (no loops, no tilt), JavaScript disabled, and GSAP blocked.
3. **Check:**
   - no console errors;
   - no horizontal overflow at 360, 390, 1280, and 1920;
   - the nav `aria-current` follows the section in view;
   - anchors and margin marks land 75px from the top and move focus;
   - the longest load task, using medians over several runs because single runs are noisy on this machine;
   - the essay text is unchanged.
4. Review the screenshots like a design reviewer: remove one decoration, fix alignment, and fix anything hard to read. Repeat once.
