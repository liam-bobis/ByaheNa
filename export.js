/**
 * export.js — ByaheNa
 * Export / Share modal: copy summary, print, web share API.
 */

"use strict";

(function () {

  let modal, overlay;

  // ── Build ────────────────────────────────────────────────────────
  function buildModal() {
    overlay = document.createElement("div");
    overlay.id = "export-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "export-title");

    modal = document.createElement("div");
    modal.id = "export-modal";

    modal.innerHTML = `
      <div class="export-header">
        <h2 class="export-title" id="export-title">Share Your Trip Plan</h2>
        <button class="export-close" id="export-close" aria-label="Close">&times;</button>
      </div>

      <div class="export-body">

        <!-- Preview card -->
        <div class="export-preview-card" id="export-preview-card">
          <div class="export-card-header">
            <div class="export-card-logo">ByaheNa</div>
            <div class="export-card-dest" id="ec-dest">Caramoan, Camarines Sur</div>
          </div>
          <div class="export-card-body">
            <div class="export-card-row">
              <span class="ec-label">Travelers</span>
              <span class="ec-val" id="ec-travelers">2</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Duration</span>
              <span class="ec-val" id="ec-duration">3 nights / 4 days</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Travel Style</span>
              <span class="ec-val" id="ec-tier">Comfort Traveler</span>
            </div>
            <div class="export-card-divider"></div>
            <div class="export-card-row">
              <span class="ec-label">Transport</span>
              <span class="ec-val" id="ec-transport">₱0</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Accommodation</span>
              <span class="ec-val" id="ec-hotel">₱0</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Food & Drinks</span>
              <span class="ec-val" id="ec-food">₱0</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Activities</span>
              <span class="ec-val" id="ec-activities">₱0</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Local Transport</span>
              <span class="ec-val" id="ec-local">₱0</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Shopping</span>
              <span class="ec-val" id="ec-shopping">₱0</span>
            </div>
            <div class="export-card-row">
              <span class="ec-label">Contingency</span>
              <span class="ec-val" id="ec-contingency">₱0</span>
            </div>
            <div class="export-card-divider"></div>
            <div class="export-card-total-row">
              <span class="ec-total-label">Per Person</span>
              <span class="ec-total-val" id="ec-per-person">₱0</span>
            </div>
            <div class="export-card-total-row highlight-row">
              <span class="ec-grand-label">Total Trip Cost</span>
              <span class="ec-grand-val" id="ec-grand-total">₱0</span>
            </div>
          </div>
          <div class="export-card-footer">
            Estimated by ByaheNa — byahena.com (prices as of 2024–2025)
          </div>
        </div>

        <!-- Action buttons -->
        <div class="export-actions">

          <button class="export-action-btn" id="export-copy-text-btn">
            <span class="export-action-label">Copy as Text</span>
            <span class="export-action-sub">Paste into chat, notes, or email</span>
          </button>

          <button class="export-action-btn" id="export-print-btn">
            <span class="export-action-label">Print / Save as PDF</span>
            <span class="export-action-sub">Use browser's print dialog</span>
          </button>

          <button class="export-action-btn" id="export-share-btn" style="display:none">
            <span class="export-action-label">Share</span>
            <span class="export-action-sub">Send to friends & family</span>
          </button>

          <button class="export-action-btn" id="export-savings-btn">
            <span class="export-action-label">Open Savings Planner</span>
            <span class="export-action-sub">How much to save per month</span>
          </button>

        </div>

      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // ── Populate the preview card ───────────────────────────────────
  function populateCard() {
    if (typeof state === "undefined" || typeof calculateEstimate === "undefined") return;

    const params = {
      originKey:      state.origin,
      destKey:        state.destination,
      travelers:      state.travelers,
      nights:         state.nights,
      days:           state.days,
      transportMode:  state.transport.mode,
      hotelType:      state.hotel.type,
      foodType:       state.food.type,
      activityType:   state.activities.type,
      localType:      state.local.type,
      shoppingType:   state.shopping.type,
      contingencyPct: state.contingency.pct,
      transportEnabled:   state.transport.enabled,
      hotelEnabled:       state.hotel.enabled,
      foodEnabled:        state.food.enabled,
      activitiesEnabled:  state.activities.enabled,
      localEnabled:       state.local.enabled,
      shoppingEnabled:    state.shopping.enabled,
      contingencyEnabled: state.contingency.enabled
    };

    const result = calculateEstimate(params);
    if (!result) return;

    const dest     = DESTINATIONS[state.destination];
    const destName = dest ? `${dest.name}, ${dest.province}` : state.destination;
    const tierLabel= TIER_PRESETS[state.tier]?.label || state.tier;

    setVal("ec-dest",        destName);
    setVal("ec-travelers",   state.travelers + " pax");
    setVal("ec-duration",    `${state.nights} night${state.nights !== 1 ? "s" : ""} / ${state.days} days`);
    setVal("ec-tier",        tierLabel);
    setVal("ec-transport",   fp(result.items.transport));
    setVal("ec-hotel",       fp(result.items.hotel));
    setVal("ec-food",        fp(result.items.food));
    setVal("ec-activities",  fp(result.items.activities));
    setVal("ec-local",       fp(result.items.local));
    setVal("ec-shopping",    fp(result.items.shopping));
    setVal("ec-contingency", fp(result.items.contingency));
    setVal("ec-per-person",  fp(result.totalPerPerson));
    setVal("ec-grand-total", fp(result.grandTotal));
  }

  // ── Build text summary ──────────────────────────────────────────
  function buildTextSummary() {
    if (typeof state === "undefined" || typeof calculateEstimate === "undefined") return "";

    const params = {
      originKey:      state.origin,
      destKey:        state.destination,
      travelers:      state.travelers,
      nights:         state.nights,
      days:           state.days,
      transportMode:  state.transport.mode,
      hotelType:      state.hotel.type,
      foodType:       state.food.type,
      activityType:   state.activities.type,
      localType:      state.local.type,
      shoppingType:   state.shopping.type,
      contingencyPct: state.contingency.pct,
      transportEnabled:   state.transport.enabled,
      hotelEnabled:       state.hotel.enabled,
      foodEnabled:        state.food.enabled,
      activitiesEnabled:  state.activities.enabled,
      localEnabled:       state.local.enabled,
      shoppingEnabled:    state.shopping.enabled,
      contingencyEnabled: state.contingency.enabled
    };

    const result   = calculateEstimate(params);
    if (!result) return "";

    const dest     = DESTINATIONS[state.destination];
    const destName = dest ? `${dest.name}, ${dest.province}` : state.destination;
    const tierLabel= TIER_PRESETS[state.tier]?.label || state.tier;
    const origin   = document.getElementById("origin");
    const originLabel = origin
      ? origin.options[origin.selectedIndex]?.text
      : state.origin;

    const line = "─".repeat(38);
    return [
      "BYAHENA — Trip Estimate",
      line,
      `From:          ${originLabel}`,
      `To:            ${destName}`,
      `Travelers:     ${state.travelers} pax`,
      `Duration:      ${state.nights} nights / ${state.days} days`,
      `Travel Style:  ${tierLabel}`,
      "",
      "COST BREAKDOWN (per person)",
      line,
      `Transport:     ${fp(result.items.transport)}`,
      `Accommodation: ${fp(result.items.hotel)}`,
      `Food & Drinks: ${fp(result.items.food)}`,
      `Activities:    ${fp(result.items.activities)}`,
      `Local Travel:  ${fp(result.items.local)}`,
      `Shopping:      ${fp(result.items.shopping)}`,
      `Contingency:   ${fp(result.items.contingency)}`,
      line,
      `Per Person:    ${fp(result.totalPerPerson)}`,
      `TOTAL TRIP:    ${fp(result.grandTotal)}`,
      "",
      "Estimate generated by ByaheNa",
      "Prices approximate as of 2024–2025 (PHP)",
    ].join("\n");
  }

  // ── Open / Close ────────────────────────────────────────────────
  function openExportModal() {
    populateCard();

    // Show native share button if supported
    const shareBtn = document.getElementById("export-share-btn");
    if (shareBtn && navigator.share) {
      shareBtn.style.display = "flex";
    }

    overlay.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeExportModal() {
    overlay.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  // ── Copy text ───────────────────────────────────────────────────
  function copyText() {
    const text = buildTextSummary();
    navigator.clipboard.writeText(text)
      .then(() => {
        const btn = document.getElementById("export-copy-text-btn");
        const label = btn.querySelector(".export-action-label");
        const orig  = label.textContent;
        label.textContent = "✅ Copied!";
        setTimeout(() => { label.textContent = orig; }, 2000);
      })
      .catch(() => {
        // Fallback: prompt
        const ta = document.createElement("textarea");
        ta.value = buildTextSummary();
        ta.style.cssText = "position:fixed;opacity:0;left:0;top:0;";
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        alert("Summary copied!");
      });
  }

  // ── Print ───────────────────────────────────────────────────────
  function triggerPrint() {
    closeExportModal();
    setTimeout(() => window.print(), 300);
  }

  // ── Native share ────────────────────────────────────────────────
  function nativeShare() {
    if (!navigator.share) return;
    const text = buildTextSummary();
    navigator.share({
      title: "My ByaheNa Trip Estimate",
      text:  text,
      url:   window.location.href
    }).catch(() => {});
  }

  // ── Helpers ─────────────────────────────────────────────────────
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function fp(amount) {
    return "₱" + Math.round(amount || 0).toLocaleString("en-PH");
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    buildModal();

    document.getElementById("export-close").addEventListener("click", closeExportModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeExportModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) closeExportModal();
    });

    document.getElementById("export-copy-text-btn").addEventListener("click", copyText);
    document.getElementById("export-print-btn").addEventListener("click", triggerPrint);

    const shareBtn = document.getElementById("export-share-btn");
    if (shareBtn) shareBtn.addEventListener("click", nativeShare);

    document.getElementById("export-savings-btn").addEventListener("click", () => {
      closeExportModal();
      setTimeout(() => {
        if (typeof openSavingsPlanner === "function") openSavingsPlanner();
      }, 200);
    });

    window.addEventListener("byahena:openExport", openExportModal);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.openExportModal = openExportModal;

})();