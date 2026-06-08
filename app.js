/**
 * app.js — ByaheNa Vacation Cost Estimator
 * Main application logic: estimates, charts, itinerary rendering
 */

"use strict";

// ============================================================
// STATE
// ============================================================
let state = {
  origin:      "naga",
  destination: "caramoan",
  travelers:   2,
  nights:      3,
  days:        4,
  tier:        "mid",
  transport:   { enabled: true,  mode: "bus_van" },
  hotel:       { enabled: true,  type: "standard" },
  food:        { enabled: true,  type: "casual" },
  activities:  { enabled: true,  type: "semi_private" },
  local:       { enabled: true,  type: "rent_bike" },
  shopping:    { enabled: true,  type: "moderate" },
  contingency: { enabled: true,  pct: 0.10 }
};

let breakdownChart = null;
let compareDestination = "boracay";

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  bindFormEvents();
  applyTierPreset("mid");
  renderDestinationInfo();
  updateTierRanges();
  updateEstimate();
  renderItinerary();
  updateCompareSection();
  updateBudgetTable();
});

// ============================================================
// FORM BINDINGS
// ============================================================
function bindFormEvents() {
  document.getElementById("origin").addEventListener("change", (e) => {
    state.origin = e.target.value;
    // Suggest transport mode based on route availability
    suggestTransportMode();
    updateEstimate();
    updateTierRanges();
  });

  document.getElementById("destination").addEventListener("change", (e) => {
    state.destination = e.target.value;
    suggestTransportMode();
    renderDestinationInfo();
    updateEstimate();
    updateTierRanges();
    renderItinerary();
    updateItineraryHeader();
  });

  // Counter: travelers
  document.getElementById("minus-travelers").addEventListener("click", () => {
    if (state.travelers > 1) {
      state.travelers--;
      document.getElementById("travelers-count").textContent = state.travelers;
      updateEstimate();
      updateTierRanges();
    }
  });
  document.getElementById("plus-travelers").addEventListener("click", () => {
    if (state.travelers < 20) {
      state.travelers++;
      document.getElementById("travelers-count").textContent = state.travelers;
      updateEstimate();
      updateTierRanges();
    }
  });

  // Counter: nights
  document.getElementById("minus-nights").addEventListener("click", () => {
    if (state.nights > 1) {
      state.nights--;
      if (state.days <= state.nights) {
        state.days = state.nights + 1;
        document.getElementById("days-count").textContent = state.days;
      }
      document.getElementById("nights-count").textContent = state.nights;
      updateEstimate();
      updateTierRanges();
      renderItinerary();
    }
  });
  document.getElementById("plus-nights").addEventListener("click", () => {
    if (state.nights < 14) {
      state.nights++;
      if (state.days <= state.nights) {
        state.days = state.nights + 1;
        document.getElementById("days-count").textContent = state.days;
      }
      document.getElementById("nights-count").textContent = state.nights;
      updateEstimate();
      updateTierRanges();
      renderItinerary();
    }
  });

  // Counter: days
  document.getElementById("minus-days").addEventListener("click", () => {
    if (state.days > state.nights + 1) {
      state.days--;
      document.getElementById("days-count").textContent = state.days;
      updateEstimate();
      updateTierRanges();
      renderItinerary();
    }
  });
  document.getElementById("plus-days").addEventListener("click", () => {
    if (state.days < 21) {
      state.days++;
      document.getElementById("days-count").textContent = state.days;
      updateEstimate();
      updateTierRanges();
      renderItinerary();
    }
  });

  // Dropdowns
  document.getElementById("transport-mode").addEventListener("change", (e) => {
    state.transport.mode = e.target.value;
    updateEstimate();
  });
  document.getElementById("hotel-type").addEventListener("change", (e) => {
    state.hotel.type = e.target.value;
    updateEstimate();
  });
  document.getElementById("food-type").addEventListener("change", (e) => {
    state.food.type = e.target.value;
    updateEstimate();
  });
  document.getElementById("activity-type").addEventListener("change", (e) => {
    state.activities.type = e.target.value;
    updateEstimate();
  });
  document.getElementById("local-type").addEventListener("change", (e) => {
    state.local.type = e.target.value;
    updateEstimate();
  });
  document.getElementById("shopping-type").addEventListener("change", (e) => {
    state.shopping.type = e.target.value;
    updateEstimate();
  });
  document.getElementById("contingency-pct").addEventListener("change", (e) => {
    state.contingency.pct = parseFloat(e.target.value);
    updateEstimate();
  });

  // Toggles
  ["transport", "hotel", "food", "activities", "local", "shopping", "contingency"].forEach(key => {
    const el = document.getElementById(`toggle-${key}`);
    if (el) {
      el.addEventListener("change", (e) => {
        state[key].enabled = e.target.checked;
        const card = document.getElementById(`card-${key}`);
        if (card) card.classList.toggle("disabled", !e.target.checked);
        updateEstimate();
      });
    }
  });

  const compareEl = document.getElementById("compare-destination");
  if (compareEl) {
    compareEl.value = compareDestination;
    compareEl.addEventListener("change", (e) => {
      compareDestination = e.target.value;
      updateCompareSection();
    });
  }
}

// ============================================================
// TIER SELECTION
// ============================================================
function selectTier(tier) {
  state.tier = tier;
  document.querySelectorAll(".tier-card").forEach(card => {
    card.classList.remove("tier-selected");
  });
  document.querySelector(`[data-tier="${tier}"]`).classList.add("tier-selected");
  applyTierPreset(tier);
  updateEstimate();
}

function applyTierPreset(tier) {
  const preset = TIER_PRESETS[tier];
  if (!preset) return;

  // Update state
  state.transport.mode = preset.transport;
  state.hotel.type     = preset.hotel;
  state.food.type      = preset.food;
  state.activities.type = preset.activity;
  state.local.type     = preset.local;
  state.shopping.type  = preset.shopping;
  state.contingency.pct = preset.contingency;

  // Update selects
  setSelectValue("transport-mode", preset.transport);
  setSelectValue("hotel-type",     preset.hotel);
  setSelectValue("food-type",      preset.food);
  setSelectValue("activity-type",  preset.activity);
  setSelectValue("local-type",     preset.local);
  setSelectValue("shopping-type",  preset.shopping);
  setSelectValue("contingency-pct",String(preset.contingency));
}

function setSelectValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    // Check if the option exists, otherwise pick closest
    const opts = Array.from(el.options).map(o => o.value);
    el.value = opts.includes(value) ? value : opts[0];
  }
}

// ============================================================
// SUGGEST TRANSPORT MODE
// ============================================================
function suggestTransportMode() {
  const region = ORIGIN_REGION[state.origin] || "luzon_other";
  const regionData = TRANSPORT[region] || TRANSPORT.manila;
  if (!regionData) return;
  const destData = regionData[state.destination];
  if (!destData) return;

  const tier = state.tier || "mid";
  const preset = TIER_PRESETS[tier];
  const preferred = preset.transport;

  if (destData[preferred]) {
    state.transport.mode = preferred;
  } else {
    // Pick first available
    const order = ["bus_van", "boat_ferry", "budget_airline", "full_airline", "private_car"];
    for (const m of order) {
      if (destData[m]) { state.transport.mode = m; break; }
    }
  }

  setSelectValue("transport-mode", state.transport.mode);

  // Update route note
  const note = getTransportNote(state.origin, state.destination);
  const subEl = document.getElementById("transport-sub");
  if (subEl && note) subEl.textContent = note;
}

// ============================================================
// TIER RANGES (update tier card price badges)
// ============================================================
function updateTierRanges() {
  ["budget", "mid", "premium"].forEach(tier => {
    const total = calculateTierTotal(tier, state.origin, state.destination, state.nights, state.days, state.travelers);
    const el = document.getElementById(`${tier}-range`);
    if (el) {
      const perPerson = Math.round(total / state.travelers);
      el.textContent = `~${formatPeso(perPerson)}/person`;
    }
  });
}

// ============================================================
// MAIN ESTIMATE CALCULATION & UI UPDATE
// ============================================================
function updateEstimate() {
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

  // Update individual cost cards
  updateCostCard("transport",   result.items.transport);
  updateCostCard("hotel",       result.items.hotel);
  updateCostCard("food",        result.items.food);
  updateCostCard("activities",  result.items.activities);
  updateCostCard("local",       result.items.local);
  updateCostCard("shopping",    result.items.shopping);
  updateCostCard("contingency", result.items.contingency);

  // Update hotel sub-label
  const hotelSub = document.getElementById("hotel-sub");
  if (hotelSub) {
    hotelSub.textContent = `${state.nights} nights × per person`;
  }

  // Update activities sub-label
  const actSub = document.getElementById("activities-sub");
  if (actSub && result.destination) {
    const actKey = state.activities.type;
    const act = result.destination.activities[actKey];
    if (act) actSub.textContent = act.label;
  }

  // Update summary cards
  el("per-person-total").textContent  = formatPeso(result.totalPerPerson);
  el("per-person-sub").textContent    = `for ${state.nights} night${state.nights !== 1 ? "s" : ""} / ${state.days} days`;
  el("grand-total").textContent       = formatPeso(result.grandTotal);
  el("grand-total-sub").textContent   = `for ${state.travelers} traveler${state.travelers !== 1 ? "s" : ""}`;
  el("per-day-total").textContent     = formatPeso(result.perDay);

  // Update breakdown list & chart
  updateBreakdownChart(result);
  updateBreakdownList(result);

  // Tier comparison
  updateTierComparison();
  updateCompareSection();
  updateBudgetTable();
}

function updateCostCard(key, amount) {
  const el = document.getElementById(`${key}-amount`);
  if (el) el.textContent = formatPeso(amount);
}

// ============================================================
// CHART
// ============================================================
function updateBreakdownChart(result) {
  const labels  = [];
  const values  = [];
  const colors  = [];
  const pairs = [
    { key: "transport",  label: "🚍 Transport",       color: "#0097B2" },
    { key: "hotel",      label: "🏨 Accommodation",   color: "#27AE60" },
    { key: "food",       label: "🍽️ Food & Drinks",   color: "#F39C12" },
    { key: "activities", label: "🌴 Activities",      color: "#E74C3C" },
    { key: "local",      label: "🚕 Local Transport", color: "#8E44AD" },
    { key: "shopping",   label: "🛍️ Shopping",        color: "#E67E22" },
    { key: "contingency",label: "⚠️ Contingency",     color: "#95A5A6" }
  ];

  pairs.forEach(p => {
    const v = result.items[p.key];
    if (v > 0) {
      labels.push(p.label);
      values.push(v);
      colors.push(p.color);
    }
  });

  const chartValue = document.getElementById("breakdown-chart-value");
  if (chartValue) {
    chartValue.textContent = formatPeso(result.totalPerPerson);
  }

  const ctx = document.getElementById("breakdown-chart");
  if (!ctx) return;

  if (breakdownChart) {
    breakdownChart.data.labels  = labels;
    breakdownChart.data.datasets[0].data = values;
    breakdownChart.data.datasets[0].backgroundColor = colors;
    breakdownChart.update();
    return;
  }

  breakdownChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data:            values,
        backgroundColor: colors,
        borderWidth:     3,
        borderColor:     "rgba(255,255,255,0.18)",
        hoverOffset:     10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "62%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = ctx.parsed;
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = ((val / total) * 100).toFixed(1);
              return ` ${ctx.label}: ${formatPeso(val)} (${pct}%)`;
            }
          },
          backgroundColor: "rgba(0,31,61,0.95)",
          titleFont: { family: "'DM Sans', sans-serif", size: 13 },
          bodyFont:  { family: "'DM Sans', sans-serif", size: 12 },
          padding: 12
        }
      }
    }
  });
}

function updateBreakdownList(result) {
  const container = document.getElementById("breakdown-list");
  if (!container) return;

  const pairs = [
    { key: "transport",   label: "🚍 Transport",         color: "#0097B2" },
    { key: "hotel",       label: "🏨 Accommodation",     color: "#27AE60" },
    { key: "food",        label: "🍽️ Food & Drinks",     color: "#F39C12" },
    { key: "activities",  label: "🌴 Activities",        color: "#E74C3C" },
    { key: "local",       label: "🚕 Local Transport",   color: "#8E44AD" },
    { key: "shopping",    label: "🛍️ Shopping",          color: "#E67E22" },
    { key: "contingency", label: "⚠️ Contingency",       color: "#95A5A6" }
  ];

  const total = result.totalPerPerson || 1;
  container.innerHTML = pairs
    .filter(p => result.items[p.key] > 0)
    .map(p => {
      const value = result.items[p.key];
      const pct = ((value / total) * 100).toFixed(1);
      return `
        <div class="breakdown-row">
          <div class="breakdown-meta">
            <div class="breakdown-label">${p.label}</div>
            <div class="breakdown-pct">${pct}%</div>
          </div>
          <div class="breakdown-value">${formatPeso(value)}</div>
          <div class="breakdown-bar-track">
            <div class="breakdown-bar-fill" style="width:${pct}%; background:${p.color};"></div>
          </div>
        </div>`;
    }).join("") +
    `<div class="breakdown-row breakdown-summary-card">
      <div class="breakdown-meta">
        <div class="breakdown-label">Total per person</div>
        <div class="breakdown-pct">Your share</div>
      </div>
      <div class="breakdown-value">${formatPeso(result.totalPerPerson)}</div>
      <div class="breakdown-bar-track">
        <div class="breakdown-bar-fill" style="width: 100%; background: linear-gradient(90deg, #00B4D8, #6F42C1);"></div>
      </div>
    </div>`;
}

// ============================================================
// TIER COMPARISON BARS
// ============================================================
function updateTierComparison() {
  const budgetTotal   = calculateTierTotal("budget",  state.origin, state.destination, state.nights, state.days, state.travelers);
  const midTotal      = calculateTierTotal("mid",     state.origin, state.destination, state.nights, state.days, state.travelers);
  const premiumTotal  = calculateTierTotal("premium", state.origin, state.destination, state.nights, state.days, state.travelers);
  const maxVal        = Math.max(budgetTotal, midTotal, premiumTotal) || 1;

  const container = document.getElementById("comparison-bars");
  if (!container) return;

  const rows = [
    { tier: "budget",  label: "Budget",     total: budgetTotal,  color: "budget", note: "Cheaper, local-style budget" },
    { tier: "mid",     label: "Mid-Range",   total: midTotal,     color: "mid",    note: "Comfortable and balanced" },
    { tier: "premium", label: "Premium",    total: premiumTotal, color: "premium", note: "More premium resort-style trip" }
  ];

  container.innerHTML = rows.map(r => {
    const pct = (r.total / maxVal) * 100;
    const perPerson = Math.round(r.total / state.travelers);
    return `
      <div class="comparison-row">
        <div class="comparison-label">${r.label}</div>
        <div class="comparison-bar-wrap">
          <div class="comparison-bar ${r.color}" style="width:${pct}%"></div>
        </div>
        <div class="comparison-amount">
          ${formatPeso(r.total)}<br>
          <span style="font-size:12px;opacity:0.6">${formatPeso(perPerson)}/person</span>
        </div>
      </div>`;
  }).join("");
}

function renderDestinationInfo() {
  const dest = DESTINATIONS[state.destination];
  const container = document.getElementById("dest-info-inner");
  if (!container || !dest) return;

  container.innerHTML = `
    <div class="dest-info-card">
      <div class="dest-info-name">${dest.name}</div>
      <div class="dest-info-tagline">${dest.tagline}</div>
      <div class="dest-info-meta">
        <span class="dest-info-badge">${dest.region}</span>
        <span class="dest-info-badge">${capitalizeWords(dest.type.replace(/_/g, ' '))}</span>
      </div>
      <div class="dest-info-desc">${dest.description}</div>
      <div class="dest-info-climate">🌤️ ${dest.climate_note}</div>
    </div>`;
}

function capitalizeWords(value) {
  return value.replace(/\b[a-z]/g, (m) => m.toUpperCase());
}

function updateBudgetTable() {
  const rows = [
    { key: "budget", label: "Cheaper experience" },
    { key: "mid", label: "Average experience" },
    { key: "premium", label: "More premium experience" }
  ];

  const body = document.getElementById("budget-table-body");
  if (!body) return;

  body.innerHTML = rows.map(row => {
    const total = calculateTierTotal(row.key, state.origin, state.destination, state.nights, state.days, state.travelers);
    const perPerson = Math.round(total / state.travelers);
    return `
      <tr>
        <td>${row.label}</td>
        <td><strong>${formatPeso(perPerson)}</strong><span class="cell-note">per person</span></td>
        <td><strong>${formatPeso(total)}</strong><span class="cell-note">total trip</span></td>
      </tr>`;
  }).join("");
}

function updateCompareSection() {
  const currentName = DESTINATIONS[state.destination]?.name || "Current";
  const compareDest = DESTINATIONS[compareDestination] ? compareDestination : state.destination;
  const compareName = DESTINATIONS[compareDest]?.name || "Compare";

  const currentTitle = document.getElementById("compare-current-title");
  const otherTitle   = document.getElementById("compare-other-title");
  if (currentTitle) currentTitle.textContent = `Current: ${currentName}`;
  if (otherTitle) otherTitle.textContent = `Compare: ${compareName}`;

  const rows = [
    { label: "Cheaper experience", key: "budget" },
    { label: "Average experience", key: "mid" },
    { label: "More premium experience", key: "premium" }
  ];

  const body = document.getElementById("compare-table-body");
  if (!body) return;

  body.innerHTML = rows.map(row => {
    const currentTotal = calculateTierTotal(row.key, state.origin, state.destination, state.nights, state.days, state.travelers);
    const otherTotal   = calculateTierTotal(row.key, state.origin, compareDest, state.nights, state.days, state.travelers);
    const currentPer   = Math.round(currentTotal / state.travelers);
    const otherPer     = Math.round(otherTotal / state.travelers);

    return `
      <tr>
        <td>${row.label}</td>
        <td class="compare-value"><strong>${formatPeso(currentPer)}</strong><span class="cell-note">${formatPeso(currentTotal)} total</span></td>
        <td class="compare-value"><strong>${formatPeso(otherPer)}</strong><span class="cell-note">${formatPeso(otherTotal)} total</span></td>
      </tr>`;
  }).join("");

  const summaryEl = document.getElementById("compare-summary");
  if (summaryEl) {
    const baseCurrent = calculateTierTotal("mid", state.origin, state.destination, state.nights, state.days, state.travelers);
    const baseOther = calculateTierTotal("mid", state.origin, compareDest, state.nights, state.days, state.travelers);
    const diff = baseOther - baseCurrent;
    const diffText = diff === 0
      ? "the same as"
      : `${formatPeso(Math.abs(diff))} ${diff > 0 ? "higher than" : "lower than"}`;
    summaryEl.textContent = `Mid-range travel to ${compareName} is ${diffText} ${currentName} for the same trip details.`;
  }
}

// ============================================================
// ITINERARY
// ============================================================
function updateItineraryHeader() {
  const dest = DESTINATIONS[state.destination];
  if (!dest) return;
  const nameEl = document.getElementById("dest-name");
  if (nameEl) nameEl.textContent = dest.name;
}

function renderItinerary() {
  const dest = DESTINATIONS[state.destination];
  if (!dest) return;

  updateItineraryHeader();
  renderDayCards(dest);
  renderTips(dest);
  renderPacking(dest);
}

function renderDayCards(dest) {
  const container = document.getElementById("day-cards");
  if (!container) return;

  const template = dest.itinerary_template || [];
  const nights   = state.nights;
  const days     = state.days;
  const tier     = state.tier || "mid";

  // Use available template days, or generate generic ones for longer trips
  const displayDays = [];
  for (let i = 0; i < days; i++) {
    if (template[i]) {
      displayDays.push(template[i]);
    } else {
      // Generic extra day
      displayDays.push({
        title: `More Exploration`,
        subtitle: `Day ${i + 1} — extend your adventure`,
        events: [
          { time: "Morning",   icon: "", name: "Morning at leisure", desc: "Sleep in, relax at the resort, or join a morning activity. No rush." },
          { time: "Midday",    icon: "", name: "Lunch & Rest",        desc: "Grab a meal at a local restaurant and recharge for the afternoon." },
          { time: "Afternoon", icon: "", name: "Explore at Your Pace", desc: "Revisit your favorite spot, try a new activity, or simply lounge on the beach." },
          { time: "Evening",   icon: "", name: "Dinner & Wind Down",  desc: "Enjoy your last or second-to-last evening with local flavors and stories to share." }
        ]
      });
    }
  }

  const tierCostNote = (costKey) => {
    if (!costKey) return "";
    const tierLabel = TIER_PRESETS[tier]?.label || "Comfort Traveler";
    const notes = {
      transport:  { budget: "Bus / van (cheapest)", mid: "Budget airline or van hire", premium: "Full-service airline" },
      activities: { budget: "Group tour (shared)",  mid: "Semi-private or combo",      premium: "Private boat / exclusive" },
      food:       { budget: "Carinderia / street food", mid: "Casual restaurants",     premium: "Mid-range to fine dining" },
      hotel:      { budget: "Fan room / hostel",    mid: "Standard hotel",             premium: "Beach resort / 4-star" },
      local:      { budget: "Tricycle / habal-habal", mid: "Motorbike / e-bike",       premium: "Private van / Grab" },
      shopping:   { budget: "Pasalubong only",       mid: "Moderate shopping",         premium: "Craft items + pasalubong" }
    };
    const n = notes[costKey];
    if (!n) return "";
    return `<div class="day-event-cost">${n[tier] || ""}</div>`;
  };

  container.innerHTML = displayDays.map((day, idx) => {
    const eventsHtml = day.events.map(ev => `
      <div class="day-event">
        <div class="day-event-time">${ev.time || ""}</div>
        <div class="day-event-icon"></div>
        <div class="day-event-details">
          <div class="day-event-name">${ev.name}</div>
          <div class="day-event-desc">${ev.desc}</div>
          ${tierCostNote(ev.cost_key)}
        </div>
      </div>`).join("");

    return `
      <div class="day-card fade-up fade-up-${Math.min(idx + 1, 3)}">
        <div class="day-card-header">
          <div class="day-num">0${idx + 1}</div>
          <div>
            <div class="day-title">${day.title}</div>
            <div class="day-subtitle">${day.subtitle}</div>
          </div>
        </div>
        <div class="day-card-body">${eventsHtml}</div>
      </div>`;
  }).join("");
}

function renderTips(dest) {
  const container = document.getElementById("tips-grid");
  if (!container || !dest.tips) return;
  container.innerHTML = dest.tips.map(tip => `
    <div class="tip-card">
      <div class="tip-icon"></div>
      <div class="tip-title">${tip.title}</div>
      <div class="tip-text">${tip.text}</div>
    </div>`).join("");
}

function renderPacking(dest) {
  const container = document.getElementById("packing-grid");
  if (!container || !dest.packing) return;

  const categories = [
    { key: "essentials", icon: "", label: "Essentials" },
    { key: "gear",       icon: "", label: "Gear & Tech" },
    { key: "clothing",   icon: "", label: "Clothing" },
    { key: "health",     icon: "", label: "Health & Safety" }
  ];

  container.innerHTML = categories.map(cat => {
    const items = dest.packing[cat.key] || [];
    if (!items.length) return "";
    return `
      <div class="packing-cat">
        <div class="packing-cat-title">${cat.label}</div>
        <ul class="packing-items">
          ${items.map(item => `<li>${item}</li>`).join("")}
        </ul>
      </div>`;
  }).join("");
}

// ============================================================
// TAB SWITCHING
// ============================================================
function switchItinerary(btn, contentId) {
  document.querySelectorAll(".itinerary-tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".itinerary-content").forEach(c => c.classList.remove("active"));
  btn.classList.add("active");
  const panel = document.getElementById(contentId);
  if (panel) panel.classList.add("active");
}

// ============================================================
// UTILITIES
// ============================================================
function formatPeso(amount) {
  if (!amount && amount !== 0) return "₱0";
  return "₱" + Math.round(amount).toLocaleString("en-PH");
}

function el(id) {
  return document.getElementById(id) || { textContent: "" };
}

// ============================================================
// EXPORT to global scope for inline HTML event handlers
// ============================================================
window.selectTier      = selectTier;
window.switchItinerary = switchItinerary;
window.updateEstimate  = updateEstimate;