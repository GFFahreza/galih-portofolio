/*
  Photo slots (data/photos.js). A slot with an empty `src` renders a designed
  placeholder; a slot with a `src` renders a real, lazy-loaded image.
  Gallery images open in a lightbox (<dialog>: Esc closes, arrows move).
  Any element with data-photo="id" in the HTML is upgraded on load.
  Exposes window.PhotoSlots = { render, gallery, get }.
*/
(function () {
  "use strict";

  var CONFIG = window.CONFIG || {};
  var list = Array.isArray(window.PHOTOS) ? window.PHOTOS : [];
  var byId = {};
  list.forEach(function (p) { byId[p.id] = p; });

  // Backward compatibility: CONFIG.photo still fills the portrait slots.
  if (CONFIG.photo) {
    ["portrait", "cv-photo"].forEach(function (id) {
      if (byId[id] && !byId[id].src) byId[id].src = CONFIG.photo;
    });
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  var CAMERA = '<svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false">' +
    '<path d="M4 10h6l2-3h8l2 3h6v16H4Z" fill="#FFE45C" stroke="#15142B" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<circle cx="16" cy="17" r="5" fill="#F3F2EE" stroke="#15142B" stroke-width="2.5"/></svg>';

  /* opts: { caption: bool, lightbox: group name, className } */
  function render(id, opts) {
    opts = opts || {};
    var p = byId[id];
    if (!p || p.hidden) return null;
    if (opts.forceEmpty) p = Object.assign({}, p, { src: "" });

    var fig = el("figure", "photo-slot" + (opts.className ? " " + opts.className : ""));
    fig.dataset.photoId = id;
    if (p.frame) fig.classList.add("frame-" + p.frame);
    var box = el("div", "photo-box");
    box.style.setProperty("--ratio", p.ratio || "3 / 2");

    if (p.src) {
      fig.classList.add("has-photo");
      var img = el("img");
      img.src = p.src;
      img.alt = p.alt || "";
      img.width = p.width || 1600;
      img.height = p.height || 1067;
      img.loading = opts.eager ? "eager" : "lazy";
      img.decoding = "async";
      if (p.position) img.style.objectPosition = p.position;
      // If the file fails to load, fall back to the designed placeholder.
      img.addEventListener("error", function () {
        var fallback = render(id, Object.assign({}, opts, { forceEmpty: true }));
        if (fallback && fig.parentNode) fig.replaceWith(fallback);
      });
      if (opts.lightbox) {
        var open = el("button", "photo-open");
        open.type = "button";
        open.setAttribute("aria-label", "Enlarge photo: " + (p.caption || p.alt || ""));
        open.appendChild(img);
        open.addEventListener("click", function () { lightbox(opts.lightbox, id, open); });
        box.appendChild(open);
      } else {
        box.appendChild(img);
      }
    } else {
      fig.classList.add("is-empty");
      var ph = el("div", "photo-ph");
      ph.setAttribute("aria-hidden", "true");
      var icon = el("span", "ph-icon");
      icon.innerHTML = CAMERA; // static markup defined above, not data
      ph.appendChild(icon);
      if (p.caption) ph.appendChild(el("span", "ph-cap", p.caption));
      ph.appendChild(el("span", "ph-path", p.path || ""));
      ph.appendChild(el("span", "ph-spec", (p.spec || "") + (p.ratio ? ", ratio " + p.ratio.replace(/ /g, "") : "")));
      box.appendChild(ph);
      box.appendChild(el("span", "visually-hidden", "Photo coming soon" + (p.caption ? ": " + p.caption : "")));
    }

    fig.appendChild(box);
    if (opts.caption && p.caption) fig.appendChild(el("figcaption", "photo-cap", p.caption));
    return fig;
  }

  function members(group) {
    return list.filter(function (p) { return p.group === group && !p.hidden; });
  }

  function gallery(group, opts) {
    opts = opts || {};
    var items = members(group);
    if (!items.length) return null;
    var ul = el("ul", "gallery gallery-" + group);
    if (opts.label) ul.setAttribute("aria-label", opts.label);
    items.forEach(function (p) {
      var li = el("li", "gallery-item");
      var slot = render(p.id, { caption: true, lightbox: group });
      if (slot) { li.appendChild(slot); ul.appendChild(li); }
    });
    return ul;
  }

  /* ---- Lightbox ---------------------------------------------------- */
  var dialog = null;
  var state = { group: null, index: 0, opener: null };

  function buildDialog() {
    dialog = el("dialog", "lightbox");
    dialog.setAttribute("aria-label", "Photo viewer");
    var fig = el("figure", "lightbox-figure");
    var img = el("img", "lightbox-img");
    img.alt = "";
    var cap = el("figcaption", "lightbox-cap");
    fig.appendChild(img);
    fig.appendChild(cap);
    var prev = el("button", "lightbox-btn lightbox-prev", "Previous");
    var next = el("button", "lightbox-btn lightbox-next", "Next");
    var close = el("button", "lightbox-btn lightbox-close", "Close");
    [prev, next, close].forEach(function (b) { b.type = "button"; });
    prev.addEventListener("click", function () { step(-1); });
    next.addEventListener("click", function () { step(1); });
    close.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      if (state.opener && document.contains(state.opener)) state.opener.focus();
    });
    dialog.appendChild(close);
    dialog.appendChild(fig);
    dialog.appendChild(prev);
    dialog.appendChild(next);
    document.body.appendChild(dialog);
  }

  function shown() {
    return members(state.group).filter(function (p) { return p.src; });
  }

  function paint() {
    var items = shown();
    var p = items[state.index];
    if (!p) return;
    var img = dialog.querySelector(".lightbox-img");
    img.src = p.src;
    img.alt = p.alt || "";
    dialog.querySelector(".lightbox-cap").textContent = p.caption || "";
    var many = items.length > 1;
    dialog.querySelector(".lightbox-prev").hidden = !many;
    dialog.querySelector(".lightbox-next").hidden = !many;
  }

  function step(d) {
    var n = shown().length;
    if (!n) return;
    state.index = (state.index + d + n) % n;
    paint();
  }

  function lightbox(group, id, opener) {
    if (!dialog) buildDialog();
    state.group = group;
    state.opener = opener;
    state.index = Math.max(0, shown().map(function (p) { return p.id; }).indexOf(id));
    paint();
    if (dialog.showModal) dialog.showModal(); else dialog.setAttribute("open", "");
    dialog.querySelector(".lightbox-close").focus();
  }

  /* Upgrade data-photo placeholders in the static HTML. */
  function upgrade() {
    Array.prototype.slice.call(document.querySelectorAll("[data-photo]")).forEach(function (host) {
      var slot = render(host.getAttribute("data-photo"), {
        caption: host.hasAttribute("data-caption"),
        eager: host.hasAttribute("data-eager"),
        className: host.getAttribute("data-class") || ""
      });
      if (slot) host.replaceWith(slot);
      else host.remove();
    });
  }

  window.PhotoSlots = {
    render: render,
    gallery: gallery,
    get: function (id) { return byId[id]; }
  };

  upgrade();
})();
