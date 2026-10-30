/*
  CV section: Galih's finished CV (data/cv.js), laid out in the order of the
  CV guide (Steps 3 to 10), with a master version and four tailored versions.
  Every visible sentence comes from data/cv.js; this file only builds the
  layout and the version switch. Works without GSAP.
*/
(function () {
  "use strict";

  var CV = window.CV || {};
  var CONFIG = window.CONFIG || {};
  var versions = CV.versions || {};
  var keys = Object.keys(versions);
  var steps = CV.steps || {};
  var state = { version: keys[0] || "master" };
  var NEW_TAB_NOTE = " (opens in a new tab)";

  function $(id) { return document.getElementById(id); }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function link(item) {
    var a = el("a", null, item.label);
    a.href = item.href;
    if (!/^#/.test(item.href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.appendChild(el("span", "visually-hidden", NEW_TAB_NOTE));
    }
    return a;
  }

  function slot(id, className, caption) {
    return window.PhotoSlots ? window.PhotoSlots.render(id, { className: className, caption: !!caption }) : null;
  }

  function reduced() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

  /* One part of the CV, with the guide step it follows. */
  function part(id, title) {
    var section = el("section", "cv-part");
    section.id = "cv-part-" + id;
    var head = el("h4", "cv-part-title", title);
    section.appendChild(head);
    var step = steps[id];
    if (step) {
      var tag = el("span", "cv-mark", String(step.n));
      tag.setAttribute("aria-label", "Guide step " + step.n + ": " + step.label);
      tag.title = "Guide step " + step.n + ": " + step.label;
      section.appendChild(tag);
    }
    return section;
  }

  function entryNode(e) {
    var item = el("div", "cv-entry");
    var head = el("div", "cv-entry-head");
    var title = el("p", "cv-entry-title", e.title || "");
    if (e.note) {
      title.appendChild(document.createTextNode(" "));
      title.appendChild(el("span", "cv-entry-note", e.note));
    }
    if (e.tag) {
      title.appendChild(document.createTextNode(" "));
      title.appendChild(el("span", "cv-entry-tag", e.tag));
    }
    head.appendChild(title);
    if (e.period) head.appendChild(el("p", "cv-entry-period", e.period));
    item.appendChild(head);
    var org = [e.org, e.place].filter(Boolean).join(", ");
    if (org) item.appendChild(el("p", "cv-entry-org", org));
    (e.groups || []).forEach(function (g) {
      var row = el("p", "cv-group");
      row.appendChild(el("span", "cv-group-label", g.label + ": "));
      row.appendChild(document.createTextNode(g.items.join(", ")));
      item.appendChild(row);
    });
    if (e.pending) item.appendChild(el("p", "cv-entry-pending", "Details coming soon."));
    if (e.summary) item.appendChild(el("p", "cv-entry-summary", e.summary));
    if (e.scope) item.appendChild(el("p", "cv-entry-org", e.scope));
    if (Array.isArray(e.bullets) && e.bullets.length) {
      var ul = el("ul");
      e.bullets.forEach(function (b) { ul.appendChild(el("li", null, b)); });
      item.appendChild(ul);
    }
    if (e.story) item.appendChild(el("p", "cv-entry-story", e.story));
    if (Array.isArray(e.chips) && e.chips.length) {
      var chips = el("ul", "chips cv-chips");
      chips.setAttribute("aria-label", "Skills");
      e.chips.forEach(function (c) { chips.appendChild(el("li", "chip", c)); });
      item.appendChild(chips);
    }
    if (e.gallery && window.PhotoSlots) {
      var g = window.PhotoSlots.gallery(e.gallery, { label: "Photos: " + (e.title || "") });
      if (g) item.appendChild(g);
    }
    if (e.link) {
      var p = el("p", "cv-entry-link");
      p.appendChild(link(e.link));
      item.appendChild(p);
    }
    if (e.photo) {
      var ph = slot(e.photo, e.photoWide ? "cv-inline-photo" : "cv-entry-photo", !!e.photoWide);
      if (ph) item.appendChild(ph);
    }
    (e.images || []).forEach(function (img) {
      if (!img.src) return;
      var fig = el("figure", "cv-figure");
      var im = el("img");
      im.src = img.src;
      im.alt = img.alt || "";
      im.loading = "lazy";
      im.width = 480;
      im.height = 320;
      fig.appendChild(im);
      if (img.caption) fig.appendChild(el("figcaption", null, img.caption));
      item.appendChild(fig);
    });
    return item;
  }

  /* "id" or "id:variant" (a variant overrides fields of the base entry). */
  function experienceEntry(ref) {
    var id = ref.split(":")[0];
    var base = (CV.experience || {})[id];
    if (!base) return null;
    return Object.assign({}, base, (CV.variants || {})[ref] || {});
  }

  function renderSheet(key) {
    var sheet = $("cv-sheet");
    if (!sheet) return;
    var v = versions[key] || {};
    var master = versions[keys[0]] || {};
    sheet.textContent = "";

    // Step 3: name and contact details (no phone, no email)
    var top = part("contact", "");
    top.classList.add("cv-top");
    top.removeChild(top.querySelector(".cv-part-title"));
    var id = el("div", "cv-id");
    id.appendChild(el("p", "cv-name", CV.name || ""));
    if (CV.headline) id.appendChild(el("p", "cv-headline", CV.headline));
    var contact = el("p", "cv-contact");
    if (CV.city) contact.appendChild(el("span", null, CV.city));
    (CV.links || []).forEach(function (l) { contact.appendChild(link(l)); });
    id.appendChild(contact);
    if (CV.contactNote) id.appendChild(el("p", "cv-contact-note", CV.contactNote));
    top.appendChild(id);
    var cvPhoto = slot("cv-photo", "cv-photo-slot");
    if (cvPhoto) top.appendChild(cvPhoto);
    sheet.appendChild(top);

    var changes = [];

    // Step 4: profile
    var profile = part("profile", "Professional profile");
    profile.appendChild(el("p", null, v.profile || ""));
    if (key !== keys[0] && v.profile !== master.profile) {
      mark(profile, "Rewritten");
      changes.push("the profile");
    }
    sheet.appendChild(profile);

    // Step 5: education, with coursework and academic projects
    var edu = part("education", "Education");
    (CV.education || []).forEach(function (e) { edu.appendChild(entryNode(e)); });
    sheet.appendChild(edu);

    // Step 6: experience, in this version's order
    var exp = part("experience", "Experience");
    (v.experience || []).forEach(function (ref) {
      var entry = experienceEntry(ref);
      if (entry) exp.appendChild(entryNode(entry));
    });
    if (key !== keys[0] && (v.experience || []).join() !== (master.experience || []).join()) {
      mark(exp, "Reordered");
      changes.push("the experience");
    }
    sheet.appendChild(exp);

    // Step 7: skills and languages
    var skills = part("skills", "Skills");
    var sk = el("p", "cv-group");
    sk.appendChild(el("span", "cv-group-label", "Technical: "));
    sk.appendChild(document.createTextNode((v.skills || []).join(", ")));
    skills.appendChild(sk);
    var lang = el("p", "cv-group");
    lang.appendChild(el("span", "cv-group-label", "Languages: "));
    lang.appendChild(document.createTextNode((CV.languages || []).join("; ")));
    skills.appendChild(lang);
    if (key !== keys[0] && (v.skills || []).join() !== (master.skills || []).join()) {
      mark(skills, "Refocused");
      changes.push("the skills");
    }
    sheet.appendChild(skills);

    // Steps 8 and 9: projects and portfolio
    var port = part("portfolio", "Projects and portfolio");
    var ul = el("ul", "cv-links");
    (v.portfolio || []).forEach(function (item) {
      var li = el("li");
      li.appendChild(link(item));
      ul.appendChild(li);
    });
    port.appendChild(ul);
    (v.photos || []).forEach(function (id) {
      var ph = slot(id, "cv-inline-photo", true);
      if (ph) port.appendChild(ph);
    });
    if (key !== keys[0] && JSON.stringify(v.portfolio) !== JSON.stringify(master.portfolio)) {
      mark(port, "Refocused");
      changes.push("the portfolio");
    }
    sheet.appendChild(port);

    // Step 8: certifications and achievements
    var cert = part("certifications", "Certifications and achievements");
    var cl = el("ul");
    (CV.certifications || []).forEach(function (c) { cl.appendChild(el("li", null, c)); });
    cert.appendChild(cl);
    var certPhoto = slot("codelamp-cert", "cv-inline-photo", true);
    if (certPhoto) cert.appendChild(certPhoto);
    sheet.appendChild(cert);

    // Step 10: references
    var ref = part("references", "References");
    ref.appendChild(el("p", null, CV.references || ""));
    sheet.appendChild(ref);

    var note = $("cv-change-note");
    if (note) {
      note.textContent = key === keys[0] || !changes.length ? "" :
        "Changed in this version: " + changes.slice(0, -1).join(", ") + (changes.length > 1 ? " and " : "") + changes[changes.length - 1] + ".";
    }
  }

  function mark(section, text) {
    section.classList.add("is-changed");
    section.querySelector(".cv-part-title").appendChild(el("span", "cv-changed", text));
  }

  function renderSwitch() {
    var host = $("cv-switch");
    var sheet = $("cv-sheet");
    if (!host) return;
    host.setAttribute("role", "tablist");
    host.setAttribute("aria-label", "CV version");
    sheet.setAttribute("role", "tabpanel");
    sheet.removeAttribute("aria-label");
    var tabs = keys.map(function (key) {
      var b = el("button", "filter cv-tab", versions[key].label || key);
      b.type = "button";
      b.id = "cv-tab-" + key;
      b.dataset.version = key;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "cv-sheet");
      b.addEventListener("click", function () { switchVersion(key); });
      b.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(b);
        var next = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : null;
        if (next === null) return;
        e.preventDefault();
        var t = tabs[(next + tabs.length) % tabs.length];
        t.focus();
        switchVersion(t.dataset.version);
      });
      host.appendChild(b);
      return b;
    });
    syncTabs();
  }

  function syncTabs() {
    Array.prototype.slice.call(document.querySelectorAll("#cv-switch .cv-tab")).forEach(function (b) {
      var on = b.dataset.version === state.version;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
    });
    $("cv-sheet").setAttribute("aria-labelledby", "cv-tab-" + state.version);
  }

  function switchVersion(key) {
    if (!versions[key] || key === state.version) return;
    state.version = key;
    syncTabs();
    var sheet = $("cv-sheet");
    function swap() {
      renderSheet(key);
      document.dispatchEvent(new CustomEvent("site:layoutchange"));
    }
    if (reduced()) { swap(); return; }
    sheet.classList.add("is-swapping");
    setTimeout(function () { swap(); sheet.classList.remove("is-swapping"); }, 180);
  }

  function renderExtras() {
    var intro = $("cv-intro");
    (CV.intro || []).forEach(function (t) { intro.appendChild(el("p", null, t)); });
    var spec = $("cv-spec");
    if (spec && CV.spec) spec.textContent = "Format: " + CV.spec;

    var list = $("cv-checks");
    if (list && Array.isArray(CV.checklist) && CV.checklist.length) {
      CV.checklist.forEach(function (c) {
        var li = el("li", "cv-check");
        li.appendChild(el("span", "cv-check-box", "✓"));
        li.firstChild.setAttribute("aria-hidden", "true");
        var body = el("p");
        body.appendChild(el("strong", null, c.text));
        if (c.proof) body.appendChild(document.createTextNode(": " + c.proof));
        li.appendChild(body);
        list.appendChild(li);
      });
      $("cv-review").hidden = false;
    }

    var pdf = $("cv-pdf");
    if (pdf && CONFIG.cvPdf) { pdf.href = CONFIG.cvPdf; pdf.hidden = false; }
  }

  /* Every item flagged placeholder: true is dummy text that must be replaced
     before publishing. List them in the console so they are easy to find. */
  function reportPlaceholders() {
    var found = [];
    Object.keys(CV.experience || {}).forEach(function (id) {
      if (CV.experience[id].placeholder) found.push("experience." + id + " (" + CV.experience[id].title + ")");
    });
    Object.keys(CV.variants || {}).forEach(function (id) {
      if (CV.variants[id].placeholder) found.push("variants[\"" + id + "\"]");
    });
    if (found.length && window.console && console.info) {
      console.info("data/cv.js: placeholder content to replace before publishing:\n- " + found.join("\n- "));
    }
  }

  if (!$("cv-sheet") || !keys.length) return;
  reportPlaceholders();
  renderExtras();
  renderSwitch();
  renderSheet(state.version);
})();
