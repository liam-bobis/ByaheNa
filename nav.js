/**
 * nav.js — ByaheNa
 * Sticky navigation, scroll progress bar, mobile menu,
 * active section highlighting, and back-to-top button.
 */

"use strict";

(function () {

  // ── DOM refs (injected by this script) ──────────────────────────
  let navbar, mobileMenuBtn, mobileMenu, backToTop;

  // ── Sections for scroll-spy ──────────────────────────────────────
  const SECTIONS = [
    { id: "step1",    label: "Setup",      icon: "" },
    { id: "step2",    label: "Style",      icon: "" },
    { id: "step3",    label: "Customize",  icon: "" },
    { id: "results",  label: "Estimate",   icon: "" },
    { id: "itinerary",label: "Itinerary",  icon: "" }
  ];

  // ── Build & inject the navbar ────────────────────────────────────
  function buildNav() {
    // Navbar element
    navbar = document.createElement("nav");
    navbar.id = "sticky-nav";
    navbar.setAttribute("aria-label", "Page navigation");

    const logo = `
      <a href="#" class="nav-logo" aria-label="ByaheNa Home">
        <span>ByaheNa</span>
      </a>`;

    const navLinks = SECTIONS.map(s => `
      <a href="#${s.id}" class="nav-link" data-section="${s.id}">
        <span class="nav-link-text">${s.label}</span>
      </a>`).join("");

    const actions = `
      <div class="nav-actions">
        <button class="nav-action-btn" id="nav-save-btn" title="Save estimate" aria-label="Save estimate">
          Save
        </button>
        <button class="nav-action-btn" id="nav-share-btn" title="Share / Export" aria-label="Share or export">
          Export
        </button>
        <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>`;

    navbar.innerHTML = `
      ${logo}
      <div class="nav-links" id="nav-links">${navLinks}</div>
      ${actions}`;

    // Mobile dropdown
    mobileMenu = document.createElement("div");
    mobileMenu.id = "mobile-menu";
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.innerHTML = SECTIONS.map(s => `
      <a href="#${s.id}" class="mobile-nav-link" data-section="${s.id}">
        ${s.label}
      </a>`).join("") +
      `<div class="mobile-nav-actions">
        <button class="mobile-action-btn" id="mobile-save-btn">Save Estimate</button>
        <button class="mobile-action-btn" id="mobile-share-btn">Export</button>
        <button class="mobile-action-btn" id="mobile-savings-btn">Savings Planner</button>
      </div>`;

    // Back-to-top
    backToTop = document.createElement("button");
    backToTop.id = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = "↑";

    // Mount
    document.body.prepend(navbar);
    document.body.appendChild(mobileMenu);
    document.body.appendChild(backToTop);

    // Cache refs
    mobileMenuBtn = document.getElementById("nav-hamburger");
  }

  // ── Scroll handler ───────────────────────────────────────────────
  function onScroll() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Navbar state
    if (navbar) {
      if (scrollTop > 80) {
        navbar.classList.add("nav-scrolled");
      } else {
        navbar.classList.remove("nav-scrolled");
      }
    }

    // Back-to-top visibility
    if (backToTop) {
      backToTop.classList.toggle("visible", scrollTop > 600);
    }

    // Scroll-spy: highlight active section
    updateActiveSection(scrollTop);
  }

  function updateActiveSection(scrollTop) {
    let current = "";
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (!el) continue;
      if (el.offsetTop - 120 <= scrollTop) {
        current = s.id;
      }
    }
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
      link.classList.toggle("active", link.dataset.section === current);
    });
  }

  // ── Hamburger / mobile menu ──────────────────────────────────────
  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.toggle("open");
    mobileMenuBtn.classList.toggle("open", isOpen);
    mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("open");
    mobileMenuBtn && mobileMenuBtn.classList.remove("open");
    mobileMenuBtn && mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  // ── Smooth scroll for anchor links ──────────────────────────────
  function handleAnchorClick(e) {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    closeMobileMenu();
    const target = document.querySelector(href);
    if (target) {
      const offset = navbar ? navbar.offsetHeight + 8 : 64;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }

  // ── Wire events ──────────────────────────────────────────────────
  function bindEvents() {
    // Hamburger
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", toggleMobileMenu);
    }

    // Close menu on outside click
    document.addEventListener("click", (e) => {
      if (
        mobileMenu &&
        mobileMenu.classList.contains("open") &&
        !mobileMenu.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });

    // Anchor links — desktop
    document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
      link.addEventListener("click", handleAnchorClick);
    });

    // Hero CTA button
    const heroCta = document.querySelector(".cta-btn");
    if (heroCta) heroCta.addEventListener("click", handleAnchorClick);

    // Back to top
    if (backToTop) {
      backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Scroll
    window.addEventListener("scroll", onScroll, { passive: true });

    // Nav action buttons → delegate to export.js / savings.js
    document.addEventListener("click", (e) => {
      const id = e.target.id || e.target.closest("button")?.id;
      if (id === "nav-save-btn" || id === "mobile-save-btn") {
        if (typeof openSavingsPlanner === "function") openSavingsPlanner();
        else window.dispatchEvent(new CustomEvent("byahena:openSavings"));
      }
      if (id === "nav-share-btn" || id === "mobile-share-btn") {
        if (typeof openExportModal === "function") openExportModal();
        else window.dispatchEvent(new CustomEvent("byahena:openExport"));
      }
      if (id === "mobile-savings-btn") {
        closeMobileMenu();
        if (typeof openSavingsPlanner === "function") openSavingsPlanner();
        else window.dispatchEvent(new CustomEvent("byahena:openSavings"));
      }
    });

    // Push body down so content isn't hidden under fixed nav
    function applyNavOffset() {
      if (navbar) {
        document.body.style.paddingTop = navbar.offsetHeight + "px";
      }
    }
    applyNavOffset();
    window.addEventListener("resize", applyNavOffset);
  }

  // ── Init ─────────────────────────────────────────────────────────
  function init() {
    buildNav();
    bindEvents();
    onScroll(); // run once to set initial state
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();