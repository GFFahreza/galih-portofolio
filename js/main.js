/*
  Content and behavior. Everything here works without GSAP.
  js/motion.js adds animation on top through the "site:*" events below.
*/
(function () {
  "use strict";

  var CONFIG = window.CONFIG || {};
  var JOURNALS = Array.isArray(window.JOURNALS) ? window.JOURNALS : [];

  var NEW_TAB_NOTE = " (opens in a new tab)";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function hiddenText(text) {
    return el("span", "visually-hidden", text);
  }

  function externalLink(href, className, label, srExtra) {
    var a = el("a", className, label);
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.appendChild(hiddenText((srExtra || "") + NEW_TAB_NOTE));
    return a;
  }

  function emit(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail }));
  }

  /* Optional hero photo: hidden until CONFIG.photo is set. */
  function setupPhoto() {
    var figure = document.getElementById("hero-photo");
    var img = document.getElementById("hero-photo-img");
    if (!figure || !img || !CONFIG.photo) return;
    img.addEventListener("error", function () {
      figure.hidden = true;
    });
    img.alt = CONFIG.photoAlt || "Portrait of Galih Fajar Fahreza";
    img.src = CONFIG.photo;
    figure.hidden = false;
  }

  /* E-commerce debate: accordions, the balance scale, and "open all".
     The HTML ships every point open, so the essay reads fully without JS. */
  function setupDebate() {
    var debate = document.getElementById("debate");
    if (!debate) return;
    var boxes = Array.prototype.slice.call(debate.querySelectorAll(".point-box"));
    var scale = document.getElementById("scale");
    var beam = document.getElementById("scale-beam");
    var status = document.getElementById("scale-status");
    var toggleAll = document.getElementById("toggle-all");
    var total = boxes.length / 2;
    var ready = false;

    // One weight per point; a weight shows when its point is open.
    function makeWeights(id) {
      var pan = document.getElementById(id);
      var weights = [];
      for (var i = 0; pan && i < total; i++) {
        var w = el("span", "weight");
        pan.appendChild(w);
        weights.push(w);
      }
      return weights;
    }
    var weightsFor = makeWeights("weights-for");
    var weightsAgainst = makeWeights("weights-against");

    function fill(weights, count) {
      weights.forEach(function (w, i) { w.classList.toggle("is-on", i < count); });
    }

    function update(announce) {
      var forOpen = 0;
      var againstOpen = 0;
      boxes.forEach(function (b) {
        if (!b.open) return;
        if (b.dataset.side === "for") forOpen++;
        else againstOpen++;
      });

      var lean = forOpen > againstOpen ? "for" : againstOpen > forOpen ? "against" : "even";
      debate.dataset.lean = lean;

      // The heavier side goes down: 3.5 degrees per point of difference.
      if (beam) beam.style.setProperty("--tilt", ((againstOpen - forOpen) * 3.5) + "deg");
      fill(weightsFor, forOpen);
      fill(weightsAgainst, againstOpen);

      if (status && announce) {
        if (forOpen + againstOpen === 0) {
          status.textContent = "No points are open yet. Open one to see which side weighs more.";
        } else {
          var verdict = lean === "for" ? "The advantages weigh more." : lean === "against" ? "The disadvantages weigh more." : "The two sides are even.";
          status.textContent = forOpen + " open for, " + againstOpen + " open against. " + verdict;
        }
      }

      if (toggleAll) {
        var allOpen = forOpen + againstOpen === boxes.length;
        toggleAll.textContent = allOpen ? "Close all points" : "Open all points";
        toggleAll.setAttribute("aria-expanded", String(allOpen));
      }
    }

    boxes.forEach(function (b) {
      b.open = false;
      b.addEventListener("toggle", function () {
        // The toggles caused by closing everything on load stay silent.
        update(ready);
        emit("site:pointtoggle", { box: b });
      });
    });

    if (toggleAll) {
      toggleAll.addEventListener("click", function () {
        var openAll = boxes.some(function (b) { return !b.open; });
        boxes.forEach(function (b) { b.open = openAll; });
      });
    }

    if (scale) scale.hidden = false;
    update(false);
    setTimeout(function () { ready = true; }, 0);
  }

  /* Journals */
  var THEMES = { web: "Web application security", adv: "Adversarial attacks on IDS" };

  function renderJournals() {
    var list = document.getElementById("journals-list");
    if (!list) return [];
    list.textContent = "";

    return JOURNALS.map(function (j) {
      var item = el("li", "journal");
      item.dataset.tags = (j.tags || []).join(" ");

      item.appendChild(el("p", "journal-year", String(j.year)));

      var body = el("div", "journal-body");

      var title = el("h3", "journal-title");
      if (j.page) {
        var a = el("a", null, j.title);
        a.href = j.page;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        if (j.titleEn) a.lang = "id";
        a.appendChild(hiddenText(NEW_TAB_NOTE));
        title.appendChild(a);
      } else {
        title.textContent = j.title;
      }
      body.appendChild(title);

      if (j.titleEn) body.appendChild(el("p", "journal-title-en", "In English: " + j.titleEn));

      var meta = el("p", "journal-meta");
      meta.appendChild(el("span", "journal-authors", j.authors));
      meta.appendChild(el("span", "journal-venue", j.venue));
      body.appendChild(meta);

      if (j.type && j.type !== "Journal article") {
        body.appendChild(el("span", "journal-note", j.type));
      }

      body.appendChild(el("p", "journal-summary", j.summary));

      var links = el("div", "journal-links");
      [["pdf", "Download PDF", "jlink jlink-pdf"], ["page", "Article page", "jlink"], ["doi", "DOI", "jlink"]].forEach(function (spec) {
        if (j[spec[0]]) {
          links.appendChild(externalLink(j[spec[0]], spec[2], spec[1], " for " + j.title));
        }
      });
      body.appendChild(links);

      item.appendChild(body);

      var tag = (j.tags || [])[0];
      if (THEMES[tag]) item.appendChild(el("p", "journal-theme theme-" + tag, THEMES[tag]));

      list.appendChild(item);
      return item;
    });
  }

  function setupFilters(items) {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter"));
    var status = document.getElementById("filter-status");
    if (!buttons.length) return;

    function apply(filter, announce) {
      // motion.js records positions on "before" and animates on "after" (FLIP).
      emit("site:beforefilter", { items: items });
      var shown = 0;
      items.forEach(function (item) {
        var tags = item.dataset.tags.split(" ");
        var visible = filter === "all" || tags.indexOf(filter) !== -1;
        item.hidden = !visible;
        if (visible) shown++;
      });
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.dataset.filter === filter));
      });
      if (status) {
        var text = "Showing " + shown + " of " + items.length + " papers";
        status.textContent = announce ? text + "." : text;
      }
      emit("site:afterfilter", { items: items });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("aria-pressed") === "true") return;
        apply(b.dataset.filter, true);
      });
    });

    apply("all", false);
  }

  /* Calls onChange with whichever target crosses a thin line `topPct` percent
     down the viewport. IntersectionObserver never forces a layout read, so
     this stays cheap while GSAP animates. Gaps between targets keep the
     previous answer. Shared with js/cv.js. */
  function watchLine(targets, topPct, onChange) {
    if (!("IntersectionObserver" in window) || !targets.length) return;
    var inside = [];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = inside.indexOf(e.target);
        if (e.isIntersecting && i < 0) inside.push(e.target);
        if (!e.isIntersecting && i >= 0) inside.splice(i, 1);
      });
      var current = null;
      targets.forEach(function (t) { if (inside.indexOf(t) >= 0) current = t; });
      if (current) onChange(current);
    }, { rootMargin: "-" + topPct + "% 0px -" + (99 - topPct) + "% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }
  window.watchLine = watchLine;

  /* Nav: underline the section you are reading (none while in the hero). */
  function setupNavActive() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
    var hero = document.getElementById("top");
    var targets = [];
    var linkFor = new Map();
    if (hero) { targets.push(hero); linkFor.set(hero, null); }
    links.forEach(function (a) {
      var section = document.getElementById(a.getAttribute("href").slice(1));
      if (section) { targets.push(section); linkFor.set(section, a); }
    });
    watchLine(targets, 35, function (section) {
      var current = linkFor.get(section);
      links.forEach(function (a) {
        if (a === current) a.setAttribute("aria-current", "location");
        else a.removeAttribute("aria-current");
      });
    });
  }

  /* Self-introduction video. Nothing loads until the visitor presses
     play (a click-to-load facade), and nothing ever autoplays on its own. */
  function setupVideo() {
    var v = CONFIG.video || {};
    var stage = document.getElementById("vstage");
    var frame = document.getElementById("vframe");
    var screen = document.getElementById("vscreen");
    var poster = document.getElementById("vposter");
    var play = document.getElementById("vplay");
    var status = document.getElementById("vstatus");
    var recLabel = document.getElementById("vrec-label");
    var time = document.getElementById("vtime");
    if (!frame || !screen || !play) return;

    // The CSS loops (ring, glow, badge, stickers) only run while the stage is on screen.
    if (stage) {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          stage.classList.toggle("is-onscreen", entries[0].isIntersecting);
        }).observe(stage);
      } else {
        stage.classList.add("is-onscreen");
      }
    }

    var title = v.title || "Self-introduction by Galih Fajar Fahreza";
    var ytId = v.provider === "youtube" && /^[A-Za-z0-9_-]{11}$/.test(v.id || "") ? v.id : "";
    var fileSrc = v.provider === "file" && v.src ? v.src : "";

    if (!ytId && !fileSrc) {
      // Empty state: only the designed placeholder inside the frame.
      frame.dataset.state = "empty";
      return;
    }

    frame.dataset.state = "ready";
    play.disabled = false;
    play.removeAttribute("aria-describedby");
    play.querySelector(".visually-hidden").textContent = "Play the video: " + title;
    if (status) status.textContent = "Press play to watch";
    if (recLabel) recLabel.textContent = "Press play";
    var slotPoster = window.PhotoSlots && window.PhotoSlots.get("video-poster");
    if (!v.poster && slotPoster && slotPoster.src && !slotPoster.hidden) v.poster = slotPoster.src;
    if (v.poster) poster.style.backgroundImage = "url(\"" + encodeURI(v.poster).replace(/"/g, "%22") + "\")";

    function showPlayer(node) {
      screen.appendChild(node);
      poster.hidden = true;
      frame.classList.add("has-player");
      emit("site:videoloaded", { player: node });
    }

    function loadYouTube() {
      var iframe = document.createElement("iframe");
      // Loaded only after a click, from the privacy-enhanced domain. The
      // visitor already pressed play, so the player starts right away.
      iframe.src = "https://www.youtube-nocookie.com/embed/" + ytId + "?rel=0&autoplay=1";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      showPlayer(iframe);
      if (recLabel) recLabel.textContent = "YouTube";
      iframe.focus();
    }

    function stamp(seconds) {
      var t = Math.floor(seconds || 0);
      var parts = [Math.floor(t / 3600), Math.floor(t / 60) % 60, t % 60];
      return parts.map(function (n) { return n < 10 ? "0" + n : String(n); }).join(":");
    }

    function loadFile() {
      var video = document.createElement("video");
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", title);
      if (v.poster) video.poster = v.poster;
      var source = document.createElement("source");
      source.src = fileSrc;
      source.type = /\.webm$/i.test(fileSrc) ? "video/webm" : "video/mp4";
      video.appendChild(source);
      if (v.captions) {
        var track = document.createElement("track");
        track.kind = "captions";
        track.src = v.captions;
        track.srclang = "en";
        track.label = "English";
        track.default = true;
        video.appendChild(track);
      }
      // REC dot, timecode, and equalizer follow the real play state.
      video.addEventListener("play", function () {
        frame.classList.add("is-playing");
        if (recLabel) recLabel.textContent = "REC";
        if (time) time.hidden = false;
      });
      ["pause", "ended"].forEach(function (type) {
        video.addEventListener(type, function () {
          frame.classList.remove("is-playing");
          if (recLabel) recLabel.textContent = type === "ended" ? "Ended" : "Paused";
        });
      });
      video.addEventListener("timeupdate", function () {
        if (time) time.textContent = stamp(video.currentTime);
      });
      showPlayer(video);
      video.focus();
      var started = video.play();
      if (started && started.catch) started.catch(function () { /* the controls stay available */ });
    }

    play.addEventListener("click", function () {
      if (ytId) loadYouTube();
      else loadFile();
    });
  }


  /* Footer contact links: only the ones that are set. */
  function renderContacts() {
    var list = document.getElementById("footer-links");
    if (!list) return;
    list.textContent = "";

    var entries = [];
    if (CONFIG.github) entries.push({ label: "GitHub", href: CONFIG.github, external: true });
    if (CONFIG.linkedin) entries.push({ label: "LinkedIn", href: CONFIG.linkedin, external: true });
    if (CONFIG.email) entries.push({ label: "Email", href: "mailto:" + CONFIG.email, external: false });

    entries.forEach(function (e) {
      var li = el("li");
      if (e.external) {
        li.appendChild(externalLink(e.href, null, e.label));
      } else {
        var a = el("a", null, e.label);
        a.href = e.href;
        li.appendChild(a);
      }
      list.appendChild(li);
    });

    list.hidden = entries.length === 0;
  }

  setupNavActive();
  setupVideo();
  setupPhoto();
  setupDebate();
  setupFilters(renderJournals());
  renderContacts();
})();
