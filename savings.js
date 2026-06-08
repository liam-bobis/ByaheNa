/**
 * savings.js — ByaheNa
 * Savings Goal Planner: calculates how much to save per month
 * to afford the estimated trip. Opens as a modal overlay.
 */

"use strict";

(function () {

  let modal, overlay;

  // ── Build the modal DOM ─────────────────────────────────────────
  function buildModal() {
    overlay = document.createElement("div");
    overlay.id = "savings-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "savings-title");

    modal = document.createElement("div");
    modal.id = "savings-modal";

    modal.innerHTML = `
      <div class="savings-header">
        <div class="savings-header-left">
          <div class="savings-icon"></div>
          <div>
            <h2 class="savings-title" id="savings-title">Savings Goal Planner</h2>
            <p class="savings-subtitle">Find out how much to set aside each month</p>
          </div>
        </div>
        <button class="savings-close" id="savings-close" aria-label="Close">&times;</button>
      </div>

      <div class="savings-body">

        <!-- Trip Summary Strip -->
        <div class="savings-trip-summary" id="savings-trip-summary">
          <div class="savings-summary-item">
            <span class="savings-summary-label">Destination</span>
            <span class="savings-summary-val" id="sv-dest">—</span>
          </div>
          <div class="savings-summary-item">
            <span class="savings-summary-label">Trip Style</span>
            <span class="savings-summary-val" id="sv-tier">—</span>
          </div>
          <div class="savings-summary-item">
            <span class="savings-summary-label">Total Cost</span>
            <span class="savings-summary-val highlight" id="sv-total">₱0</span>
          </div>
          <div class="savings-summary-item">
            <span class="savings-summary-label">Travelers</span>
            <span class="savings-summary-val" id="sv-travelers">—</span>
          </div>
        </div>

        <!-- Inputs -->
        <div class="savings-inputs">

          <div class="savings-form-row">
            <div class="savings-form-group">
              <label class="savings-label" for="savings-already-have">
                I already have saved
              </label>
              <div class="savings-input-wrap">
                <span class="savings-currency">₱</span>
                <input
                  type="number"
                  id="savings-already-have"
                  class="savings-input"
                  placeholder="0"
                  min="0"
                  step="100"
                  value="0"
                />
              </div>
            </div>

            <div class="savings-form-group">
              <label class="savings-label" for="savings-months">
                I want to travel in
              </label>
              <div class="savings-months-wrap">
                <input
                  type="range"
                  id="savings-months-range"
                  min="1"
                  max="24"
                  value="6"
                  class="savings-range"
                />
                <div class="savings-months-display">
                  <span id="savings-months-num">6</span>
                  <span class="savings-months-unit">months</span>
                </div>
              </div>
            </div>
          </div>

          <div class="savings-form-row">
            <div class="savings-form-group">
              <label class="savings-label" for="savings-income">
                Monthly income / salary
              </label>
              <div class="savings-input-wrap">
                <span class="savings-currency">₱</span>
                <input
                  type="number"
                  id="savings-income"
                  class="savings-input"
                  placeholder="e.g. 25000"
                  min="0"
                  step="500"
                />
              </div>
            </div>

            <div class="savings-form-group">
              <label class="savings-label" for="savings-monthly-expenses">
                Monthly fixed expenses
              </label>
              <div class="savings-input-wrap">
                <span class="savings-currency">₱</span>
                <input
                  type="number"
                  id="savings-monthly-expenses"
                  class="savings-input"
                  placeholder="e.g. 12000"
                  min="0"
                  step="500"
                />
              </div>
            </div>
          </div>

        </div><!-- end savings-inputs -->

        <!-- Results -->
        <div class="savings-results" id="savings-results">

          <div class="savings-result-main">
            <div class="savings-result-label">Save this much per month</div>
            <div class="savings-result-amount" id="savings-per-month">₱0</div>
            <div class="savings-result-sub" id="savings-per-month-sub">to reach your goal</div>
          </div>

          <div class="savings-result-details">

            <div class="savings-detail-row">
              <span class="savings-detail-label">Trip total</span>
              <span class="savings-detail-val" id="sd-trip-total">₱0</span>
            </div>
            <div class="savings-detail-row">
              <span class="savings-detail-label">Already saved</span>
              <span class="savings-detail-val savings-minus" id="sd-already-have">−₱0</span>
            </div>
            <div class="savings-detail-row savings-detail-divider">
              <span class="savings-detail-label"><strong>Still needed</strong></span>
              <span class="savings-detail-val" id="sd-still-needed"><strong>₱0</strong></span>
            </div>
            <div class="savings-detail-row">
              <span class="savings-detail-label">Months to save</span>
              <span class="savings-detail-val" id="sd-months">6</span>
            </div>
            <div class="savings-detail-row">
              <span class="savings-detail-label">Monthly savings needed</span>
              <span class="savings-detail-val highlight" id="sd-monthly-savings">₱0</span>
            </div>

          </div>

          <!-- Feasibility meter -->
          <div class="savings-feasibility" id="savings-feasibility">
            <div class="feasibility-label" id="feasibility-label">Calculating...</div>
            <div class="feasibility-bar-bg">
              <div class="feasibility-bar" id="feasibility-bar"></div>
            </div>
            <div class="feasibility-desc" id="feasibility-desc"></div>
          </div>

          <!-- Tips -->
          <div class="savings-tips" id="savings-tips-box">
            <div class="savings-tips-title">Smart Savings Tips</div>
            <div class="savings-tips-list" id="savings-tips-list">
              <div class="savings-tip-item">Set up automatic transfers to a dedicated travel fund on payday.</div>
              <div class="savings-tip-item">Book flights 2–3 months in advance for the lowest fares.</div>
              <div class="savings-tip-item">Flexible dates? Mid-week check-in is often 15–25% cheaper than weekend stays.</div>
              <div class="savings-tip-item">Keep your travel fund in a separate savings account to avoid accidental spending.</div>
              <div class="savings-tip-item">Cut one restaurant meal per week and redirect the savings into your fund.</div>
            </div>
          </div>

        </div><!-- end savings-results -->

      </div><!-- end savings-body -->

      <div class="savings-footer">
        <button class="savings-btn-secondary" id="savings-reset-btn">Reset</button>
        <button class="savings-btn-primary" id="savings-copy-btn">Copy Plan</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  // ── Populate with current trip data ────────────────────────────
  function populateTripData() {
    // Pull from app state if available
    const tripTotal = getTripTotal();
    const dest      = getDestName();
    const tier      = getTierName();
    const travelers = getTravelers();

    document.getElementById("sv-dest").textContent      = dest;
    document.getElementById("sv-tier").textContent      = tier;
    document.getElementById("sv-total").textContent     = formatPeso(tripTotal);
    document.getElementById("sv-travelers").textContent = travelers + " pax";
    document.getElementById("sd-trip-total").textContent = formatPeso(tripTotal);
  }

  // ── Calculate ───────────────────────────────────────────────────
  function calculate() {
    const tripTotal    = getTripTotal();
    const alreadyHave  = parseFloat(document.getElementById("savings-already-have").value) || 0;
    const months       = parseInt(document.getElementById("savings-months-range").value) || 6;
    const income       = parseFloat(document.getElementById("savings-income").value) || 0;
    const expenses     = parseFloat(document.getElementById("savings-monthly-expenses").value) || 0;

    const stillNeeded  = Math.max(0, tripTotal - alreadyHave);
    const monthlyNeeded = months > 0 ? stillNeeded / months : stillNeeded;
    const disposable    = Math.max(0, income - expenses);
    const savingsPct    = disposable > 0 ? (monthlyNeeded / disposable) * 100 : 0;

    // Update display
    document.getElementById("savings-per-month").textContent  = formatPeso(monthlyNeeded);
    document.getElementById("sd-already-have").textContent    = "−" + formatPeso(alreadyHave);
    document.getElementById("sd-still-needed").innerHTML      = "<strong>" + formatPeso(stillNeeded) + "</strong>";
    document.getElementById("sd-months").textContent          = months;
    document.getElementById("sd-monthly-savings").textContent = formatPeso(monthlyNeeded);

    // Per-month sub text
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    const month = targetDate.toLocaleString("en-PH", { month: "long", year: "numeric" });
    document.getElementById("savings-per-month-sub").textContent =
      `to travel by ${month}`;

    // Feasibility
    updateFeasibility(savingsPct, income, monthlyNeeded, disposable);
  }

  function updateFeasibility(pct, income, needed, disposable) {
    const bar   = document.getElementById("feasibility-bar");
    const label = document.getElementById("feasibility-label");
    const desc  = document.getElementById("feasibility-desc");

    const clampedPct = Math.min(pct, 100);
    bar.style.width = clampedPct + "%";

    if (income === 0) {
      label.textContent = "Enter your income to see feasibility";
      label.className   = "feasibility-label";
      desc.textContent  = "";
      bar.style.width   = "0%";
      bar.className     = "feasibility-bar";
      return;
    }

    if (pct <= 15) {
      bar.className     = "feasibility-bar green";
      label.textContent = "✅ Very Achievable";
      desc.textContent  = `Only ${Math.round(pct)}% of your disposable income. Easy! Consider shorter timeline or upgrade your tier.`;
    } else if (pct <= 30) {
      bar.className     = "feasibility-bar green";
      label.textContent = "✅ Achievable";
      desc.textContent  = `${Math.round(pct)}% of disposable income — this is a healthy savings rate. You're on track!`;
    } else if (pct <= 50) {
      bar.className     = "feasibility-bar yellow";
      label.textContent = "⚠️ Moderate Stretch";
      desc.textContent  = `${Math.round(pct)}% of disposable income. Doable, but you'll need to cut non-essentials. Consider extending your timeline.`;
    } else if (pct <= 80) {
      bar.className     = "feasibility-bar orange";
      label.textContent = "⚠️ Challenging";
      desc.textContent  = `${Math.round(pct)}% of disposable income is a lot. Extend your savings timeline or reduce the trip cost.`;
    } else if (pct <= 100) {
      bar.className     = "feasibility-bar red";
      label.textContent = "🚨 Very Tight";
      desc.textContent  = `This would require almost all your disposable income. Consider: longer timeline, budget tier, or fewer travelers.`;
    } else {
      bar.className     = "feasibility-bar red";
      label.textContent = "❌ Not Feasible with Current Budget";
      desc.textContent  = `You'd need ${formatPeso(needed)}/month but only have ${formatPeso(disposable)} disposable. Try: more months, less trip cost, or an additional income stream.`;
    }
  }

  // ── Open / Close ────────────────────────────────────────────────
  function openSavingsPlanner() {
    populateTripData();
    calculate();
    overlay.classList.add("open");
    document.body.classList.add("modal-open");
    document.getElementById("savings-already-have").focus();
  }

  function closeSavingsPlanner() {
    overlay.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  // ── Copy plan ───────────────────────────────────────────────────
  function copyPlan() {
    const dest    = document.getElementById("sv-dest").textContent;
    const total   = document.getElementById("sv-total").textContent;
    const months  = document.getElementById("savings-months-range").value;
    const monthly = document.getElementById("savings-per-month").textContent;
    const needed  = document.getElementById("sd-still-needed").textContent;
    const date    = document.getElementById("savings-per-month-sub").textContent;

    const text = [
      "MY BYAHENA SAVINGS PLAN",
      "================================",
      `Destination:       ${dest}`,
      `Total Trip Cost:   ${total}`,
      `Still Need to Save: ${needed}`,
      `Months to Save:    ${months}`,
      `Monthly Target:    ${monthly}`,
      `Goal:              ${date}`,
      "",
      "Plan generated by ByaheNa — Philippine Vacation Estimator",
    ].join("\n");

    navigator.clipboard.writeText(text)
      .then(() => {
        const btn = document.getElementById("savings-copy-btn");
        const orig = btn.textContent;
        btn.textContent = "✅ Copied!";
        setTimeout(() => { btn.textContent = orig; }, 2000);
      })
      .catch(() => {
        alert("Could not copy automatically. Please take a screenshot instead.");
      });
  }

  // ── Helpers pulling from app state ─────────────────────────────
  function getTripTotal() {
    // Try to read from live state in app.js
    if (typeof state !== "undefined" && typeof calculateEstimate === "function") {
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
      return result ? result.grandTotal : 0;
    }
    // Fallback: read from displayed value
    const el = document.getElementById("grand-total");
    if (el) return parseInt(el.textContent.replace(/[^0-9]/g, "")) || 0;
    return 0;
  }

  function getDestName() {
    if (typeof DESTINATIONS !== "undefined" && typeof state !== "undefined") {
      return DESTINATIONS[state.destination]?.name || "—";
    }
    const el = document.getElementById("dest-name");
    return el ? el.textContent : "—";
  }

  function getTierName() {
    if (typeof TIER_PRESETS !== "undefined" && typeof state !== "undefined") {
      return TIER_PRESETS[state.tier]?.label || "—";
    }
    return "—";
  }

  function getTravelers() {
    if (typeof state !== "undefined") return state.travelers;
    const el = document.getElementById("travelers-count");
    return el ? el.textContent : "2";
  }

  function formatPeso(amount) {
    return "₱" + Math.round(amount).toLocaleString("en-PH");
  }

  // ── Init ────────────────────────────────────────────────────────
  function init() {
    buildModal();

    // Months range
    const rangeEl = document.getElementById("savings-months-range");
    const numEl   = document.getElementById("savings-months-num");
    rangeEl.addEventListener("input", () => {
      numEl.textContent = rangeEl.value;
      calculate();
    });

    // Input changes
    ["savings-already-have", "savings-income", "savings-monthly-expenses"].forEach(id => {
      document.getElementById(id).addEventListener("input", calculate);
    });

    // Close button
    document.getElementById("savings-close").addEventListener("click", closeSavingsPlanner);

    // Close on overlay click
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSavingsPlanner();
    });

    // Keyboard
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("open")) {
        closeSavingsPlanner();
      }
    });

    // Reset
    document.getElementById("savings-reset-btn").addEventListener("click", () => {
      document.getElementById("savings-already-have").value = "0";
      document.getElementById("savings-months-range").value = "6";
      document.getElementById("savings-months-num").textContent = "6";
      document.getElementById("savings-income").value = "";
      document.getElementById("savings-monthly-expenses").value = "";
      calculate();
    });

    // Copy
    document.getElementById("savings-copy-btn").addEventListener("click", copyPlan);

    // Custom event from nav.js
    window.addEventListener("byahena:openSavings", openSavingsPlanner);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose globally
  window.openSavingsPlanner = openSavingsPlanner;

})();