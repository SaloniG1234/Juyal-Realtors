/* =========================================================
   Juyal Realtors - site behaviour
   Vanilla JS, no dependencies. Safe to load on every page.
   ========================================================= */
(function () {
  "use strict";

  /* ---- single place to change the business number ---- */
  var WA_NUMBER = "919810328027";          // WhatsApp (country code, no +, no spaces)
  var WA_BASE = "https://wa.me/" + WA_NUMBER + "?text=";

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* Turn "3 &amp; 4 BHK" into "3 & 4 BHK" for plain-text WhatsApp messages. */
  function plain(html) {
    var d = document.createElement("div");
    d.innerHTML = String(html == null ? "" : html);
    return (d.textContent || "").trim();
  }

  function openWhatsApp(message) {
    window.open(WA_BASE + encodeURIComponent(message), "_blank", "noopener");
  }

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  $$("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------- */
  var toggle = $("#navToggle");
  var links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal (degrades to always-visible)
     --------------------------------------------------------- */
  var reveals = $$(".reveal");
  if (reveals.length) {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) {
      reveals.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach(function (el, i) {
        el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + "ms";
        io.observe(el);
      });
    }
  }

  /* ---------------------------------------------------------
     Featured mandates: render + filter
     --------------------------------------------------------- */
  var grid = document.getElementById("listingGrid");
  if (grid && Array.isArray(window.JR_LISTINGS)) {
    var data = window.JR_LISTINGS;

    function cardHTML(item) {
      var specs = (item.specs || []).map(function (row) {
        return '<div class="spec"><dt>' + row[0] + "</dt><dd>" + row[1] + "</dd></div>";
      }).join("");

      var msg = "Hello Juyal Realtors, I'd like details on " + plain(item.title) +
                " (Ref " + item.ref + "). Please share current availability and price.";

      return '' +
        '<article class="listing reveal" data-category="' + item.category + '">' +
          '<div class="listing-top">' +
            '<div><h3>' + item.title + "</h3>" +
            '<div class="loc">' + item.location + "</div></div>" +
            '<span class="tag">' + item.tag + "</span>" +
          "</div>" +
          '<div class="listing-body">' +
            "<dl>" + specs + "</dl>" +
            '<div class="listing-foot">' +
              '<span class="ref">' + item.ref + " &middot; " + item.price + "</span>" +
              '<a class="btn btn--gold btn--sm" href="' + WA_BASE + encodeURIComponent(msg) + '" target="_blank" rel="noopener">Enquire</a>' +
            "</div>" +
          "</div>" +
        "</article>";
    }

    function render(filter) {
      var rows = filter === "all" ? data : data.filter(function (d) { return d.category === filter; });
      if (!rows.length) {
        grid.innerHTML = '<p class="empty" style="grid-column:1/-1">Nothing listed under this category right now. Call <a href="tel:+91' + WA_NUMBER.slice(2) + '">+91 98103 28027</a> for current options.</p>';
        return;
      }
      grid.innerHTML = rows.map(cardHTML).join("");
      // newly injected cards should fade in too
      $$(".reveal", grid).forEach(function (el) { el.classList.add("in"); });
    }

    var chips = $$("[data-filter]");
    function setFilter(filter) {
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c.dataset.filter === filter ? "true" : "false");
      });
      render(filter);
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () { setFilter(chip.dataset.filter); });
    });

    // deep link support: properties.html?f=commercial
    var wanted = new URLSearchParams(window.location.search).get("f");
    var valid = ["plot", "residential", "commercial"];
    setFilter(valid.indexOf(wanted) > -1 ? wanted : "all");
  }

  /* ---------------------------------------------------------
     Map: static address card by default, live Google map where
     embedded frames are permitted.

     The card in the HTML is the baseline, so the address and the
     directions link always work - including with JavaScript off,
     and on hosts that block third-party frames. Where the embed
     is allowed (your own hosting), we swap in the live map and
     fall back automatically if it does not load.
     --------------------------------------------------------- */
  $$("[data-map]").forEach(function (box) {
    var query = box.getAttribute("data-map");
    if (!query) return;

    var fallback = box.innerHTML;
    var loaded = false;

    var frame = document.createElement("iframe");
    frame.title = "Juyal Realtors office location on Google Maps";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.addEventListener("load", function () { loaded = true; });
    frame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(query) + "&z=16&output=embed";

    box.innerHTML = "";
    box.appendChild(frame);

    window.setTimeout(function () {
      if (!loaded) box.innerHTML = fallback;
    }, 2500);
  });

  /* ---------------------------------------------------------
     Forms -> WhatsApp (no backend, nothing stored on the site)
     --------------------------------------------------------- */
  $$("form[data-wa-form]").forEach(function (form) {
    var status = $("[data-form-status]", form);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = $$("input[name], select[name], textarea[name]", form);
      var missing = fields.filter(function (f) { return f.required && !f.value.trim(); });

      if (missing.length) {
        if (status) {
          status.textContent = "Please add your " +
            missing.map(function (f) { return f.name.toLowerCase(); }).join(" and ") + ".";
          status.style.color = "#B4832A";
        }
        missing[0].focus();
        return;
      }

      var lines = ["Website enquiry - Juyal Realtors", ""];
      fields.forEach(function (f) {
        var v = f.value.trim();
        if (v) lines.push(f.name + ": " + plain(v));
      });
      lines.push("", "Sent from " + window.location.hostname + window.location.pathname);

      openWhatsApp(lines.join("\n"));

      if (status) {
        status.textContent = "Opening WhatsApp with your enquiry. If nothing opens, call +91 98103 28027.";
        status.style.color = "";
      }
    });
  });
})();
