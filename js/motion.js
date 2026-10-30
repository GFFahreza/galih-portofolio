/*
  Motion layer. Everything in here is optional: if GSAP fails to load, if the
  visitor prefers reduced motion, or if anything throws, the page stays fully
  visible and usable (js/main.js owns all content and behavior).

  Rules: animate transform, opacity, and clip-path only (plus three one-shot
  exceptions: the font-variation morph of the hero letters, the highlighter's
  background-size, and the measured accordion height). Two eases: "enter" for
  entrances, "exit" for exits. Lenis smooths the mouse wheel only; keyboard,
  scrollbar, touch, and anchor links keep working. There are no pinned
  sections.

  To change timings, edit TIME below. To switch motion off entirely, remove
  the <script src="js/motion.js"> tag from index.html.
*/
(function () {
  "use strict";

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var Flip = window.Flip;
  var SplitText = window.SplitText;
  var Lenis = window.Lenis; // optional: without it, scrolling is simply native
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // The one feature check. Without it, nothing below runs.
  if (!gsap || !ScrollTrigger || !Flip || !SplitText || reduceMotion) return;

  /* Timings in seconds, all in one place. -------------------------------- */
  var TIME = {
    letters: 0.6,        // each letter of the name rising and morphing
    letterStagger: 0.035,
    senseWipe: 0.5,      // headword line and the three senses (the role line)
    senseStagger: 0.08,
    stickerPop: 0.5,
    stickerStagger: 0.08,
    navFade: 0.35,
    mobileSpeedUp: 1.6,  // load sequence plays this much faster on small screens
    headingLine: 0.7,
    headingStagger: 0.08,
    sectionWipe: 0.5,
    accordionOpen: 0.45,
    accordionClose: 0.35,
    flip: 0.55,
    flipFade: 0.3,
    anchorScroll: 0.9,   // smooth jump for in-page links (Lenis only)
    frameWipe: 0.9,      // the video frame draws itself in
    bracketTighten: 0.6, // viewfinder corners close in once
    tiltMax: 5,          // degrees, video frame tilt on a fine pointer
    stickerPull: 14,     // pixels the stickers follow the mouse
    marqueeLoop: 32,     // seconds per full loop at rest
    marqueeLoopSmall: 22,
    fontWait: 0.7        // longest wait for the display font before playing anyway
  };

  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  gsap.registerEase("enter", gsap.parseEase("back.out(1.4)"));
  gsap.registerEase("exit", gsap.parseEase("power2.in"));
  var ENTER = "enter";
  var EXIT = "exit";

  var root = document.documentElement;
  var isSmall = window.matchMedia("(max-width: 699px)").matches;
  var mm = gsap.matchMedia();
  var splits = [];
  var lenis = null;

  // Everything motion may leave inline styles on, for the emergency teardown.
  var TOUCHED = ".ch, .ch-in, .name-line, .entry-head, .sense, .sticker, .nav, .wipe span, " +
    ".shape, .point-body, .step-body, .journal, #progress-bar, #marquee-track, .btn, .filter, " +
    ".section-title, #vframe, .vcorner, .vglow, .vsticker, #vtilt, .portrait, .gallery-item";

  function teardown(err) {
    try {
      mm.revert();
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach(function (t) { t.kill(true); });
      gsap.globalTimeline.getChildren(true, true, true).forEach(function (t) { t.kill(); });
      splits.forEach(function (s) { s.revert(); });
      gsap.set(TOUCHED, { clearProps: "transform,opacity,clipPath,fontVariationSettings,backgroundSize,height,visibility" });
    } catch (e) { /* nothing else to undo */ }
    root.classList.remove("js-motion");
    if (window.console && err) console.warn("Motion disabled:", err);
  }

  function guarded(fn) {
    return function () {
      try { fn.apply(this, arguments); } catch (err) { teardown(err); }
    };
  }

  function waitForDisplayFont() {
    var timeout = new Promise(function (resolve) { setTimeout(resolve, TIME.fontWait * 1000); });
    if (!document.fonts || !document.fonts.load) return timeout;
    return Promise.race([document.fonts.load("900 100px Anybody"), timeout]);
  }

  /* 1. Page-load sequence: one timeline, skippable by any click or key. --- */
  function loadSequence() {
    var tl = gsap.timeline({ paused: true, defaults: { ease: ENTER } });

    // Each line keeps its own final width (150%, 139%, 90%), read from CSS.
    function finalWidth(i, el) {
      return "'wdth' " + (parseFloat(getComputedStyle(el).fontStretch) || 100) + ", 'wght' 900";
    }

    tl.fromTo(".ch-in",
      { yPercent: 80, opacity: 0, fontVariationSettings: "'wdth' 50, 'wght' 100" },
      { yPercent: 0, opacity: 1, fontVariationSettings: finalWidth,
        duration: TIME.letters, stagger: TIME.letterStagger, clearProps: "fontVariationSettings" }, 0)
      .fromTo([".entry-head", ".sense"],
        { clipPath: "inset(0% 100% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: TIME.senseWipe, stagger: TIME.senseStagger, clearProps: "clipPath" }, 0.55)
      .fromTo(".portrait",
        { clipPath: "inset(100% 0% 0% 0%)", opacity: 0 },
        { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: TIME.senseWipe, clearProps: "clipPath,opacity" }, 0.8)
      .fromTo(".sticker",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: TIME.stickerPop, stagger: TIME.stickerStagger }, 1.0)
      .fromTo(".nav",
        { opacity: 0 },
        { opacity: 1, duration: TIME.navFade, ease: "none", clearProps: "opacity" }, 1.25);

    if (isSmall) tl.timeScale(TIME.mobileSpeedUp);

    function skip() {
      if (tl.progress() < 1) tl.progress(1);
      window.removeEventListener("pointerdown", skip, true);
      window.removeEventListener("keydown", skip, true);
    }
    window.addEventListener("pointerdown", skip, true);
    window.addEventListener("keydown", skip, true);
    tl.eventCallback("onComplete", skip);

    return tl;
  }

  /* 2. Smooth wheel scrolling (Lenis), wired into ScrollTrigger. ---------- */
  function smoothScroll() {
    if (!Lenis || isSmall) return;
    lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // In-page links glide there, then move focus and update the URL, so the
    // skip link and keyboard users land where they expect.
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var link = e.target.closest && e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = decodeURIComponent(link.getAttribute("href").slice(1));
      var target = id && document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var head = document.querySelector(".masthead");
      var y = target.getBoundingClientRect().top + window.scrollY - (head ? head.offsetHeight : 0) - 12;
      lenis.scrollTo(Math.max(0, y), {
        duration: TIME.anchorScroll,
        onComplete: function () {
          if (!target.hasAttribute("tabindex") && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(target.tagName)) {
            target.setAttribute("tabindex", "-1");
          }
          target.focus({ preventScroll: true });
        }
      });
      if (history.pushState) history.pushState(null, "", "#" + id);
    });
  }

  /* 3. Kinetic hero type, scrubbed to the first screen. ------------------- */
  function heroScroll() {
    var scrub = { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 };
    var shifts = [-7, 9, -12];
    gsap.utils.toArray(".name-line").forEach(function (line, i) {
      gsap.to(line, { xPercent: shifts[i], ease: "none", scrollTrigger: scrub });
    });
    var stretch = [0.3, 0.12, 0.42, 0.2, 0.34, 0.16, 0.38];
    gsap.to(".ch", {
      scaleY: function (i) { return 1 + stretch[i % stretch.length]; },
      ease: "none",
      scrollTrigger: scrub
    });
  }

  /* 4. Marquee: steady loop, briefly faster with scroll velocity. --------- */
  function marquee() {
    var track = document.getElementById("marquee-track");
    if (!track) return;
    var loop = gsap.to(track, {
      xPercent: -50,
      duration: isSmall ? TIME.marqueeLoopSmall : TIME.marqueeLoop,
      ease: "none",
      repeat: -1
    });
    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onToggle: function (self) { if (self.isActive) loop.play(); else loop.pause(); },
      onUpdate: function (self) {
        var boost = Math.min(Math.abs(self.getVelocity()) / 900, 3);
        gsap.to(loop, {
          timeScale: 1 + boost,
          duration: 0.3,
          ease: "none",
          overwrite: true,
          onComplete: function () { gsap.to(loop, { timeScale: 1, duration: 0.9, ease: "none" }); }
        });
      }
    });
  }

  /* 6. Section headings: masked line-by-line reveal, once. ---------------- */
  function headingReveals() {
    gsap.utils.toArray(".reveal").forEach(function (heading) {
      var split = SplitText.create(heading, { type: "lines", mask: "lines" });
      splits.push(split);
      gsap.from(split.lines, {
        yPercent: 110,
        duration: TIME.headingLine,
        stagger: TIME.headingStagger,
        ease: ENTER,
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
        // Unwrap once done so the masks never clip descenders afterwards.
        onComplete: function () { split.revert(); }
      });
    });
  }

  /* 8. Color-block wipes between sections. -------------------------------- */
  function sectionWipes() {
    gsap.utils.toArray(".wipe span").forEach(function (fill) {
      gsap.fromTo(fill,
        { scaleX: 0 },
        { scaleX: 1, duration: TIME.sectionWipe, ease: ENTER,
          scrollTrigger: { trigger: fill.parentNode, start: "top 92%", once: true } });
    });
  }

  /* 9. E-commerce accordions: measured height, no layout jump. ----------- */
  function accordions() {
    var boxes = gsap.utils.toArray(".point-box");
    var others = gsap.utils.toArray(".step-box");

    function animate(box, open) {
      var body = box.querySelector(".point-body, .step-body");
      if (!body || box.dataset.busy === "1" || box.open === open) return;
      gsap.killTweensOf(body);
      if (open) {
        box.open = true;
        gsap.fromTo(body, { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: TIME.accordionOpen, ease: ENTER, clearProps: "height,opacity",
            onComplete: function () { ScrollTrigger.refresh(); } });
      } else {
        box.dataset.busy = "1";
        gsap.to(body, {
          height: 0, opacity: 0, duration: TIME.accordionClose, ease: EXIT,
          onComplete: function () {
            box.open = false;
            gsap.set(body, { clearProps: "height,opacity" });
            box.dataset.busy = "";
            ScrollTrigger.refresh();
          }
        });
      }
    }

    boxes.concat(others).forEach(function (box) {
      box.querySelector("summary").addEventListener("click", function (e) {
        e.preventDefault();
        animate(box, !box.open);
      });
    });

    // "Open all points" also animates. Capture runs before main.js's handler.
    document.addEventListener("click", function (e) {
      if (!e.target.closest || !e.target.closest("#toggle-all")) return;
      e.stopPropagation();
      var openAll = boxes.some(function (b) { return !b.open; });
      boxes.forEach(function (b, i) {
        gsap.delayedCall(i * 0.03, function () { animate(b, openAll); });
      });
    }, true);
  }

  /* 10. Journal filters: FLIP between layouts. ---------------------------- */
  function journalFlip() {
    var state = null;
    document.addEventListener("site:beforefilter", function (e) {
      state = Flip.getState(e.detail.items);
    });
    document.addEventListener("site:afterfilter", function () {
      if (!state) return;
      Flip.from(state, {
        duration: TIME.flip,
        ease: ENTER,
        absolute: true,
        onEnter: function (els) {
          return gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: TIME.flip, ease: ENTER });
        },
        onLeave: function (els) {
          return gsap.to(els, { opacity: 0, duration: TIME.flipFade, ease: EXIT });
        },
        onComplete: function () { ScrollTrigger.refresh(); }
      });
      state = null;
    });
  }

  /* 11. Micro-interactions: progress bar, magnetic buttons, cursor. ------- */
  function progressBar() {
    var bar = document.getElementById("progress-bar");
    if (!bar) return;
    var set = gsap.quickSetter(bar, "scaleX");
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: function (self) { set(self.progress); } });
  }

  function pointerToys() {
    mm.add("(hover: hover) and (pointer: fine) and (min-width: 700px)", function () {
      var cleanups = [];

      // Magnetic buttons
      gsap.utils.toArray(".btn, .filter").forEach(function (btn) {
        var xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: ENTER });
        var yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: ENTER });
        function move(e) {
          if (e.pointerType !== "mouse") return;
          var r = btn.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        }
        function leave() { xTo(0); yTo(0); }
        btn.addEventListener("pointermove", move);
        btn.addEventListener("pointerleave", leave);
        cleanups.push(function () {
          btn.removeEventListener("pointermove", move);
          btn.removeEventListener("pointerleave", leave);
          gsap.set(btn, { clearProps: "transform" });
        });
      });

      // Cursor ring: an extra, never a replacement for the system cursor.
      var dot = document.createElement("div");
      dot.className = "cursor";
      dot.setAttribute("aria-hidden", "true");
      document.body.appendChild(dot);
      gsap.set(dot, { opacity: 0 });
      var cx = gsap.quickTo(dot, "x", { duration: 0.25, ease: ENTER });
      var cy = gsap.quickTo(dot, "y", { duration: 0.25, ease: ENTER });
      var shown = false;

      function follow(e) {
        if (e.pointerType !== "mouse") return;
        if (!shown) {
          gsap.set(dot, { x: e.clientX, y: e.clientY });
          gsap.to(dot, { opacity: 1, duration: 0.3, ease: ENTER });
          shown = true;
        }
        cx(e.clientX);
        cy(e.clientY);
      }
      function over(e) {
        var hit = e.target.closest && e.target.closest("a, button, summary");
        gsap.to(dot, { scale: hit ? 2.6 : 1, duration: 0.3, ease: ENTER, overwrite: "auto" });
      }
      function out() {
        gsap.to(dot, { opacity: 0, duration: 0.3, ease: EXIT });
        shown = false;
      }
      window.addEventListener("pointermove", follow);
      document.addEventListener("pointerover", over);
      root.addEventListener("pointerleave", out);
      cleanups.push(function () {
        window.removeEventListener("pointermove", follow);
        document.removeEventListener("pointerover", over);
        root.removeEventListener("pointerleave", out);
        dot.remove();
      });

      return function () { cleanups.forEach(function (fn) { fn(); }); };
    });
  }

  /* 12. Ambient shape: the starburst drifts with scroll, not on small screens. */
  function ambient() {
    mm.add("(min-width: 700px)", function () {
      gsap.to(".shape-burst", {
        yPercent: 70, rotation: 50, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    });
  }

  /* 13. Self-introduction video: the stage. CSS runs the calm loops (ring, glow, badge,
     floating stickers); GSAP adds the one-time entrance and the pointer play. */
  function videoStage() {
    var stage = document.getElementById("vstage");
    var frame = document.getElementById("vframe");
    var tilt = document.getElementById("vtilt");
    if (!stage || !frame || !tilt) return;

    // The frame draws itself in once, then the viewfinder corners tighten.
    var dirs = { "c-tl": [-1, -1], "c-tr": [1, -1], "c-bl": [-1, 1], "c-br": [1, 1] };
    var corners = gsap.utils.toArray(".vcorner");
    var tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 80%", once: true } });
    tl.fromTo(frame, { clipPath: "inset(0% 100% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: TIME.frameWipe, ease: ENTER, clearProps: "clipPath" })
      .fromTo(".vglow", { opacity: 0 }, { opacity: 0.45, duration: TIME.frameWipe, ease: "none", clearProps: "opacity" }, 0)
      .fromTo(corners,
        { x: function (i, c) { return (dirs[c.classList[1]] || [0, 0])[0] * 16; },
          y: function (i, c) { return (dirs[c.classList[1]] || [0, 0])[1] * 16; }, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: TIME.bracketTighten, ease: ENTER, stagger: 0.05, clearProps: "transform,opacity" }, "-=0.35");

    var stickers = gsap.utils.toArray(".vsticker");
    var depth = [0.6, 1, 0.8, 1.2, 0.9];

    // Gentle scroll parallax (not on small screens).
    mm.add("(min-width: 700px)", function () {
      stickers.forEach(function (s, i) {
        gsap.fromTo(s, { y: 18 * depth[i % depth.length] }, {
          y: -18 * depth[i % depth.length], ease: "none",
          scrollTrigger: { trigger: stage, start: "top bottom", end: "bottom top", scrub: true }
        });
      });
    });

    // Fine pointer: the frame tilts (at most TIME.tiltMax degrees) and the
    // stickers lean toward the mouse.
    mm.add("(hover: hover) and (pointer: fine) and (min-width: 700px)", function () {
      gsap.set(tilt, { transformPerspective: 900 });
      var rx = gsap.quickTo(tilt, "rotationX", { duration: 0.5, ease: ENTER });
      var ry = gsap.quickTo(tilt, "rotationY", { duration: 0.5, ease: ENTER });
      var pulls = stickers.map(function (s) {
        return gsap.quickTo(s, "x", { duration: 0.6, ease: ENTER });
      });
      function move(e) {
        if (e.pointerType !== "mouse" || stage.dataset.playing) return;
        var r = stage.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        rx(-ny * 2 * TIME.tiltMax);
        ry(nx * 2 * TIME.tiltMax);
        pulls.forEach(function (pull, i) { pull(nx * TIME.stickerPull * depth[i % depth.length] * 2); });
      }
      function leave() {
        rx(0);
        ry(0);
        pulls.forEach(function (pull) { pull(0); });
      }
      stage.addEventListener("pointermove", move);
      stage.addEventListener("pointerleave", leave);
      return function () {
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", leave);
        gsap.set(tilt, { clearProps: "transform" });
      };
    });

    // Once a real player is showing, the tilt rests so the controls stay steady.
    document.addEventListener("site:videoloaded", function () {
      gsap.to(tilt, { rotationX: 0, rotationY: 0, duration: 0.4, ease: EXIT, overwrite: true });
      stage.dataset.playing = "1";
    });
  }

  /* 14. Galleries: items enter in a short stagger, once. Works the same with
     empty placeholders or real photos. */
  function galleries() {
    gsap.utils.toArray(".gallery").forEach(function (g) {
      gsap.fromTo(g.children, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.5, ease: ENTER, stagger: 0.07, clearProps: "transform,opacity",
        scrollTrigger: { trigger: g, start: "top 88%", once: true }
      });
    });
  }

  /* Boot. ----------------------------------------------------------------- */
  try {
    root.classList.add("js-motion");
    var intro = loadSequence();   // sets the hidden starting states right away

    // Setup is split across frames so no single task blocks the intro.
    var later = window.requestIdleCallback
      ? function (fn) { window.requestIdleCallback(fn, { timeout: 300 }); }
      : function (fn) { setTimeout(fn, 60); };

    waitForDisplayFont().then(guarded(function () {
      intro.play();
      requestAnimationFrame(guarded(function () {
        smoothScroll();
        heroScroll();
        marquee();
        progressBar();
        later(guarded(function () {
          headingReveals();
          sectionWipes();
          later(guarded(function () {
            accordions();
            journalFlip();
            ambient();
            pointerToys();
            videoStage();
            galleries();
            document.addEventListener("site:layoutchange", function () { ScrollTrigger.refresh(); });
            ScrollTrigger.refresh();
          }));
        }));
      }));
    }));
  } catch (err) {
    teardown(err);
  }
})();
