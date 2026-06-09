/**
 * routes.js — Lakbay PH
 * Multi-leg transport routing engine.
 *
 * Each route is defined as an array of OPTIONS.
 * Each OPTION is one complete way to get from origin → destination,
 * consisting of one or more LEGS (segments of travel).
 *
 * Structure:
 *  ROUTES[origin][destination] = [
 *    { id, label, legs: [{ mode, desc, cost, duration_hrs }], total_cost, total_hrs, note },
 *    ...
 *  ]
 *
 * Costs are per person, one-way. getRouteOptions() doubles for roundtrip.
 * Duration is approximate travel hours (one-way).
 *
 * TRANSPORT MODES:
 *  bus       — provincial bus
 *  van       — hired van / shuttle / RHK
 *  car       — private car / taxi
 *  tricycle  — tricycle / habal-habal
 *  airline_budget  — Cebu Pacific / AirAsia / SkyJet
 *  airline_full    — Philippine Airlines / Airphil
 *  ferry     — RORO / SuperCat / OceanJet
 *  bangka    — pump boat / outrigger
 *  jeepney   — local jeepney
 */

"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// AIRPORTS & PORTS reference (for display)
// ─────────────────────────────────────────────────────────────────────────────
const AIRPORTS = {
  MNL:  { name: "NAIA (Manila)",           city: "Metro Manila" },
  WNP:  { name: "Naga Airport (WNP)",      city: "Naga City" },
  LGP:  { name: "Legazpi / Daraga Airport (LGP)", city: "Daraga, Albay" },
  CYP:  { name: "Calbayog Airport",        city: "Calbayog, Samar" },
  DVO:  { name: "Francisco Bangoy Intl (DVO)", city: "Davao City" },
  GES:  { name: "Gen. Santos Airport (GES)", city: "General Santos" },
  BXU:  { name: "Bancasi Airport (BXU)",   city: "Butuan City" },
  CGY:  { name: "Laguindingan Airport (CGY)", city: "Cagayan de Oro" },
  ZAM:  { name: "Zamboanga Airport (ZAM)", city: "Zamboanga City" },
  CEB:  { name: "Mactan-Cebu Intl (CEB)", city: "Cebu City" },
  ILO:  { name: "Iloilo Airport (ILO)",   city: "Iloilo City" },
  BCD:  { name: "Bacolod-Silay Airport (BCD)", city: "Bacolod City" },
  TAC:  { name: "Daniel Z. Romualdez (TAC)", city: "Tacloban City" },
  DGT:  { name: "Dumaguete Airport (DGT)", city: "Dumaguete City" },
  RXS:  { name: "Roxas Airport (RXS)",    city: "Roxas City" },
  MPH:  { name: "Caticlan Airport (MPH)", city: "Malay, Aklan" },
  KLO:  { name: "Kalibo Airport (KLO)",   city: "Kalibo, Aklan" },
  PPS:  { name: "Puerto Princesa Airport (PPS)", city: "Puerto Princesa" },
  ENI:  { name: "El Nido Airport (ENI)",  city: "El Nido, Palawan" },
  USU:  { name: "Coron Airport (USU)",    city: "Coron, Palawan" },
  IAO:  { name: "Sayak Airport (IAO)",    city: "Del Carmen, Siargao" },
  TAG:  { name: "Tagbilaran Airport (TAG)", city: "Tagbilaran, Bohol" },
  BSO:  { name: "Basco Airport (BSO)",    city: "Basco, Batanes" },
  SFE:  { name: "San Fernando Airport",   city: "La Union" },
  LAO:  { name: "Laoag Airport (LAO)",    city: "Laoag City" },
  TUG:  { name: "Tuguegarao Airport (TUG)", city: "Tuguegarao" },
  BAG:  { name: "Baguio (no airport)",    city: "Baguio City" },
  LUZ:  { name: "Lucena (no airport)",    city: "Lucena City" },
  SFP:  { name: "San Fernando, Pampanga (no airport)", city: "San Fernando, Pampanga" },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE DATA
// Format: per person, ONE-WAY costs (PHP). getRouteOptions doubles for roundtrip.
// ─────────────────────────────────────────────────────────────────────────────
const ROUTES = {};

function addRoute(origin, dest, options) {
  if (!ROUTES[origin]) ROUTES[origin] = {};
  ROUTES[origin][dest] = options;
}

// ═══════════════════════════════════════════════════════════════════════════
// NAGA CITY → all destinations
// ═══════════════════════════════════════════════════════════════════════════
addRoute("naga", "caramoan", [
  {
    id: "naga_caramoan_van",
    label: "Van (RHK Transport) — Direct",
    legs: [
      { mode: "van", desc: "RHK Van: Naga CBD → Caramoan town", cost: 180, duration_hrs: 2.5 }
    ],
    note: "Departs from Naga Grand Central Terminal. ~4 trips/day. Book ahead during peak season."
  },
  {
    id: "naga_caramoan_bus_van",
    label: "Bus to San Jose + Van to Caramoan",
    legs: [
      { mode: "bus", desc: "Naga → San Jose, Camarines Sur (Isarog Bus)", cost: 80, duration_hrs: 1.5 },
      { mode: "van", desc: "San Jose → Caramoan", cost: 120, duration_hrs: 1.5 }
    ],
    note: "More frequent departures. Total ~3 hrs."
  }
]);

addRoute("naga", "siruma", [
  {
    id: "naga_siruma_bus",
    label: "Bus (Penafrancia / Isarog) — Direct",
    legs: [
      { mode: "bus", desc: "Naga → Siruma town via national highway", cost: 120, duration_hrs: 3 }
    ],
    note: "Limited buses. Check schedule at Naga Central Terminal."
  },
  {
    id: "naga_siruma_van",
    label: "Van + Habal-Habal to coast",
    legs: [
      { mode: "van", desc: "Naga → Tinambac or Siruma junction", cost: 150, duration_hrs: 2.5 },
      { mode: "tricycle", desc: "Junction → Siruma barangay / port", cost: 80, duration_hrs: 0.5 }
    ],
    note: "More comfortable option. Arrange habal-habal at junction."
  }
]);

addRoute("naga", "calaguas", [
  {
    id: "naga_calaguas_bus_bangka",
    label: "Bus to Daet + Van to Capalonga + Bangka",
    legs: [
      { mode: "bus", desc: "Naga → Daet, Camarines Norte (Philtranco/Isarog)", cost: 150, duration_hrs: 2.5 },
      { mode: "van", desc: "Daet → Capalonga port", cost: 80, duration_hrs: 1 },
      { mode: "bangka", desc: "Capalonga → Calaguas Islands (Mahabang Buhangin)", cost: 250, duration_hrs: 1.75 }
    ],
    note: "Most popular route. Last bangka usually departs by 9 AM."
  },
  {
    id: "naga_calaguas_bus_vinzons",
    label: "Bus to Daet + Van to Vinzons + Bangka",
    legs: [
      { mode: "bus", desc: "Naga → Daet (Philtranco)", cost: 150, duration_hrs: 2.5 },
      { mode: "van", desc: "Daet → Vinzons port", cost: 60, duration_hrs: 0.5 },
      { mode: "bangka", desc: "Vinzons → Calaguas", cost: 300, duration_hrs: 2 }
    ],
    note: "Alternative port. Vinzons route is slightly longer by sea but bangkas more frequent."
  }
]);

addRoute("naga", "boracay", [
  {
    id: "naga_boracay_fly_wn_mph",
    label: "✈ Fly Naga → Manila → Caticlan (Recommended)",
    legs: [
      { mode: "van", desc: "Naga CBD → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL (Cebu Pacific ~1 hr)", cost: 1800, duration_hrs: 1 },
      { mode: "car", desc: "NAIA → domestic terminal / transfer", cost: 150, duration_hrs: 0.5 },
      { mode: "airline_budget", desc: "MNL → MPH Caticlan (Cebu Pacific ~1 hr)", cost: 1500, duration_hrs: 1 },
      { mode: "bangka", desc: "Caticlan port → Boracay (Cagban Jetty)", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Fastest option: ~4–5 hrs total. Check WNP→MNL schedule (limited flights)."
  },
  {
    id: "naga_boracay_fly_lgp_mph",
    label: "✈ Bus to Legazpi → Fly Daraga → Manila → Caticlan",
    legs: [
      { mode: "bus", desc: "Naga → Legazpi / Daraga, Albay (1 hr)", cost: 80, duration_hrs: 1 },
      { mode: "tricycle", desc: "Legazpi CBD → Daraga Airport (LGP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "LGP → MNL (Cebu Pacific ~1 hr)", cost: 1600, duration_hrs: 1 },
      { mode: "car", desc: "NAIA transfer / wait", cost: 150, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → MPH Caticlan", cost: 1500, duration_hrs: 1 },
      { mode: "bangka", desc: "Caticlan port → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Good if Daraga (LGP) has more convenient schedules than Naga (WNP)."
  },
  {
    id: "naga_boracay_bus_manila_fly",
    label: "🚌 Bus Naga → Manila → Fly to Caticlan",
    legs: [
      { mode: "bus", desc: "Naga → Cubao/Pasay, Manila (Philtranco, overnight ~8 hrs)", cost: 700, duration_hrs: 8 },
      { mode: "car", desc: "Manila bus terminal → NAIA", cost: 200, duration_hrs: 0.5 },
      { mode: "airline_budget", desc: "MNL → MPH Caticlan", cost: 1500, duration_hrs: 1 },
      { mode: "bangka", desc: "Caticlan port → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Cheapest overall. Overnight bus saves a night's accommodation. Total ~10+ hrs."
  },
  {
    id: "naga_boracay_fly_klo",
    label: "✈ Fly via Naga/Legazpi → Manila → Kalibo (Cheaper flights)",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport or Daraga", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP or LGP → MNL", cost: 1700, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → KLO Kalibo", cost: 1200, duration_hrs: 1 },
      { mode: "van", desc: "Kalibo Airport → Caticlan port (~2 hrs)", cost: 200, duration_hrs: 2 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Kalibo flights are often cheaper but add ~2 hrs of van ride. Total ~5–6 hrs travel."
  }
]);

addRoute("naga", "palawan", [
  {
    id: "naga_eln_fly",
    label: "✈ Fly Naga/Legazpi → Manila → El Nido (ENI)",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL (Cebu Pacific)", cost: 1800, duration_hrs: 1 },
      { mode: "car", desc: "NAIA transfer / terminal hop", cost: 150, duration_hrs: 0.5 },
      { mode: "airline_budget", desc: "MNL → ENI El Nido (AirSWIFT / Cebu Pacific)", cost: 2500, duration_hrs: 1.25 }
    ],
    note: "ENI airport has limited capacity — book months ahead. Direct from Manila is best."
  },
  {
    id: "naga_pps_fly",
    label: "✈ Fly Naga → Manila → Puerto Princesa (PPS) + van",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → PPS Puerto Princesa", cost: 1800, duration_hrs: 1.25 },
      { mode: "van", desc: "PPS → El Nido by van (~5–6 hrs, ₱700 shared)", cost: 700, duration_hrs: 5.5 }
    ],
    note: "PPS flights more frequent and cheaper. Long van ride to El Nido is scenic."
  }
]);

addRoute("naga", "siargao", [
  {
    id: "naga_iao_fly",
    label: "✈ Fly Naga → Manila → Siargao (IAO)",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → IAO Siargao (Cebu Pacific)", cost: 2500, duration_hrs: 1.5 },
      { mode: "van", desc: "Sayak Airport → General Luna (~30 min shared van)", cost: 250, duration_hrs: 0.5 }
    ],
    note: "Direct Manila–Siargao now daily. Total ~5 hrs door-to-door."
  },
  {
    id: "naga_iao_via_cebu",
    label: "✈ Fly Naga → Cebu → Siargao",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → CEB Cebu (via Manila or direct)", cost: 2000, duration_hrs: 1.5 },
      { mode: "airline_budget", desc: "CEB → IAO Siargao (Cebu Pacific, ~1 hr)", cost: 1800, duration_hrs: 1 },
      { mode: "van", desc: "Sayak → General Luna", cost: 250, duration_hrs: 0.5 }
    ],
    note: "Good if Cebu connection is tighter. Cebu Pacific has multiple CEB-IAO flights daily."
  }
]);

addRoute("naga", "bohol", [
  {
    id: "naga_bohol_fly_ferry",
    label: "✈ Fly Naga → Cebu → Ferry to Bohol",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → CEB (via MNL or direct)", cost: 2000, duration_hrs: 2 },
      { mode: "car", desc: "Mactan Airport → Cebu South Bus Terminal / Pier", cost: 150, duration_hrs: 0.5 },
      { mode: "ferry", desc: "Cebu City → Tagbilaran, Bohol (OceanJet / SuperCat, 2 hrs)", cost: 450, duration_hrs: 2 }
    ],
    note: "Most reliable route. OceanJet departs Pier 1 Cebu several times daily."
  },
  {
    id: "naga_bohol_fly_direct",
    label: "✈ Fly Naga → Manila → Tagbilaran (BPH)",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → TAG Tagbilaran (Cebu Pacific)", cost: 2200, duration_hrs: 1.25 }
    ],
    note: "Direct Manila–Bohol flight. Convenient if layover is tight."
  }
]);

addRoute("naga", "batanes", [
  {
    id: "naga_bsc_fly",
    label: "✈ Fly Naga → Manila → Basco (BSO)",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL (Cebu Pacific)", cost: 1800, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → BSO Basco, Batanes (PAL / SkyJet)", cost: 5000, duration_hrs: 1.5 }
    ],
    note: "Very expensive and limited seats. Book 2–3 months ahead. SkyJet uses small ATR aircraft."
  }
]);

addRoute("naga", "la_union", [
  {
    id: "naga_launion_bus",
    label: "🚌 Bus: Naga → Manila → La Union (overnight)",
    legs: [
      { mode: "bus", desc: "Naga → Pasay/Cubao, Manila (Philtranco overnight)", cost: 700, duration_hrs: 8 },
      { mode: "bus", desc: "Manila Cubao → La Union / San Fernando (Partas Bus)", cost: 400, duration_hrs: 5 }
    ],
    note: "Cheapest. Overnight Naga→Manila, then morning bus to La Union. ~13 hrs total."
  },
  {
    id: "naga_launion_fly_bus",
    label: "✈ Fly Naga → Manila → Bus to La Union",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL (Cebu Pacific)", cost: 1800, duration_hrs: 1 },
      { mode: "car", desc: "NAIA → Cubao / Pasay bus terminal", cost: 200, duration_hrs: 0.5 },
      { mode: "bus", desc: "Manila → La Union / San Fernando (Partas Bus, ~5 hrs)", cost: 400, duration_hrs: 5 }
    ],
    note: "Faster and more comfortable. Total ~7–8 hrs door-to-door."
  }
]);

addRoute("naga", "sagada", [
  {
    id: "naga_sagada_bus",
    label: "🚌 Bus: Naga → Manila → Sagada (2 nights of travel)",
    legs: [
      { mode: "bus", desc: "Naga → Pasay/Cubao (Philtranco overnight)", cost: 700, duration_hrs: 8 },
      { mode: "bus", desc: "Cubao/Dangwa → Bontoc, Mountain Province (overnight)", cost: 600, duration_hrs: 9 },
      { mode: "van", desc: "Bontoc → Sagada (~1 hr)", cost: 80, duration_hrs: 1 }
    ],
    note: "Two overnight buses. Very long journey. Build in a rest day in Manila if possible."
  },
  {
    id: "naga_sagada_fly_bus",
    label: "✈ Fly Naga → Manila → Bus to Baguio → Bus to Sagada",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "bus", desc: "Manila → Baguio (Victory Liner, ~5 hrs)", cost: 350, duration_hrs: 5 },
      { mode: "bus", desc: "Baguio → Sagada via Bontoc (GL Trans, ~5–6 hrs)", cost: 250, duration_hrs: 5.5 }
    ],
    note: "Fly saves 8 hrs vs bus. Baguio→Sagada bus is scenic but slow. Total ~12–14 hrs."
  }
]);

addRoute("naga", "camiguin", [
  {
    id: "naga_camiguin_fly_ferry",
    label: "✈ Fly Naga → Cebu → Bus/Van → CdO → Ferry to Camiguin",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → CEB or MNL → CEB", cost: 2500, duration_hrs: 2.5 },
      { mode: "airline_budget", desc: "CEB → CGY Cagayan de Oro (Cebu Pacific, ~1 hr)", cost: 1500, duration_hrs: 1 },
      { mode: "bus", desc: "CDO → Balingoan port (2 hrs)", cost: 100, duration_hrs: 2 },
      { mode: "ferry", desc: "Balingoan → Camiguin (1 hr RORO)", cost: 200, duration_hrs: 1 }
    ],
    note: "Best option. Multiple daily CEB-CDO flights."
  }
]);

addRoute("naga", "bataan_corregidor", [
  {
    id: "naga_corregidor_bus",
    label: "🚌 Bus Naga → Manila → Bus to Bataan → Ferry to Corregidor",
    legs: [
      { mode: "bus", desc: "Naga → Pasay/Cubao (Philtranco, overnight)", cost: 700, duration_hrs: 8 },
      { mode: "bus", desc: "Manila → Balanga, Bataan (Genesis bus, ~2 hrs)", cost: 180, duration_hrs: 2 },
      { mode: "ferry", desc: "CCP Complex Manila → Corregidor Island (Sun Cruises)", cost: 1100, duration_hrs: 2 }
    ],
    note: "Sun Cruises departs CCP Manila at 7:30 AM. Must arrive Manila the night before."
  },
  {
    id: "naga_corregidor_fly",
    label: "✈ Fly Naga → Manila → Ferry to Corregidor",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL (Cebu Pacific)", cost: 1800, duration_hrs: 1 },
      { mode: "car", desc: "NAIA → CCP Complex, Manila Bay", cost: 200, duration_hrs: 0.5 },
      { mode: "ferry", desc: "CCP → Corregidor (Sun Cruises, 2 hrs)", cost: 1100, duration_hrs: 2 }
    ],
    note: "Fly + ferry combo. Day trip possible if morning flight connects in time for 7:30 AM departure."
  }
]);

addRoute("naga", "puerto_galera", [
  {
    id: "naga_pg_bus_ferry",
    label: "🚌 Bus Naga → Manila → Bus to Batangas → Ferry to Puerto Galera",
    legs: [
      { mode: "bus", desc: "Naga → Pasay/Cubao (Philtranco, overnight)", cost: 700, duration_hrs: 8 },
      { mode: "bus", desc: "Cubao/Pasay → Batangas Grand Terminal (Jam Liner, ~2 hrs)", cost: 150, duration_hrs: 2 },
      { mode: "ferry", desc: "Batangas Port → Sabang/Puerto Galera (bangka, 1.5 hrs)", cost: 350, duration_hrs: 1.5 }
    ],
    note: "Very common route. Overnight bus from Naga then morning ferry. Arrive PG before noon."
  },
  {
    id: "naga_pg_fly_ferry",
    label: "✈ Fly Naga → Manila → Bus to Batangas → Ferry",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "bus", desc: "NAIA area → Batangas (Jam Liner from Pasay)", cost: 150, duration_hrs: 2 },
      { mode: "ferry", desc: "Batangas → Sabang, Puerto Galera", cost: 350, duration_hrs: 1.5 }
    ],
    note: "Faster than overnight bus. Total ~5 hrs from Naga airport."
  }
]);

addRoute("naga", "davao_samal", [
  {
    id: "naga_davao_fly",
    label: "✈ Fly Naga → Manila → Davao → Ferry to Samal",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → DVO Davao (Cebu Pacific)", cost: 2500, duration_hrs: 1.75 },
      { mode: "car", desc: "Davao Airport → Sasa port", cost: 150, duration_hrs: 0.5 },
      { mode: "ferry", desc: "Sasa port → Samal Island (5 min, ₱20)", cost: 20, duration_hrs: 0.08 }
    ],
    note: "Multiple daily MNL-DVO flights. Total ~5–6 hrs door-to-door."
  }
]);

addRoute("naga", "cebu_kawasan", [
  {
    id: "naga_kawasan_fly",
    label: "✈ Fly Naga → Cebu → Bus to Badian",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport (WNP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → CEB (via MNL or direct)", cost: 2200, duration_hrs: 2 },
      { mode: "bus", desc: "Cebu South Bus Terminal → Badian (2.5 hrs)", cost: 100, duration_hrs: 2.5 }
    ],
    note: "Most practical. Cebu Pacific has WNP-CEB via Manila. Some seasonal directs."
  }
]);

addRoute("naga", "zamboanga_great_santa_cruz", [
  {
    id: "naga_zambo_fly",
    label: "✈ Fly Naga → Manila → Zamboanga (ZAM)",
    legs: [
      { mode: "van", desc: "Naga → Naga Airport", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "WNP → MNL", cost: 1800, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → ZAM Zamboanga (PAL / Cebu Pacific)", cost: 3000, duration_hrs: 1.5 }
    ],
    note: "2 legs total. Allow 3–4 hrs layover in Manila for security/connection."
  }
]);

// ═══════════════════════════════════════════════════════════════════════════
// MANILA → all destinations
// ═══════════════════════════════════════════════════════════════════════════
addRoute("manila", "caramoan", [
  {
    id: "mnl_caramoan_bus_van",
    label: "🚌 Bus Manila → Naga + Van to Caramoan",
    legs: [
      { mode: "bus", desc: "Pasay/Cubao → Naga City (Philtranco/DLTB, ~8 hrs)", cost: 700, duration_hrs: 8 },
      { mode: "van", desc: "Naga → Caramoan (RHK Van, ~2.5 hrs)", cost: 180, duration_hrs: 2.5 }
    ],
    note: "Budget option. Overnight bus recommended. Total ~10.5 hrs."
  },
  {
    id: "mnl_caramoan_fly_van",
    label: "✈ Fly Manila → Naga + Van to Caramoan",
    legs: [
      { mode: "airline_budget", desc: "MNL → WNP Naga Airport (Cebu Pacific, ~1 hr)", cost: 1800, duration_hrs: 1 },
      { mode: "van", desc: "Naga Airport → Naga CBD → Caramoan (van, ~2.5 hrs)", cost: 180, duration_hrs: 2.75 }
    ],
    note: "Fastest. WNP has limited daily flights — book early."
  },
  {
    id: "mnl_caramoan_fly_lgp_van",
    label: "✈ Fly Manila → Legazpi (LGP) + Van via Naga → Caramoan",
    legs: [
      { mode: "airline_budget", desc: "MNL → LGP Daraga Airport (Cebu Pacific/PAL, ~1 hr)", cost: 1600, duration_hrs: 1 },
      { mode: "bus", desc: "Legazpi → Naga City (~1 hr)", cost: 80, duration_hrs: 1 },
      { mode: "van", desc: "Naga → Caramoan (RHK)", cost: 180, duration_hrs: 2.5 }
    ],
    note: "LGP has more frequent flights than WNP. Add ~1.5 hrs vs direct Naga flight."
  }
]);

addRoute("manila", "siruma", [
  {
    id: "mnl_siruma_bus",
    label: "🚌 Bus Manila → Siruma (Direct overnight)",
    legs: [
      { mode: "bus", desc: "Pasay/Cubao → Siruma (Penafrancia Transport, ~9 hrs overnight)", cost: 750, duration_hrs: 9 }
    ],
    note: "Limited direct buses. Check schedule at Avenida bus terminals."
  },
  {
    id: "mnl_siruma_fly_bus",
    label: "✈ Fly Manila → Naga + Bus to Siruma",
    legs: [
      { mode: "airline_budget", desc: "MNL → WNP Naga", cost: 1800, duration_hrs: 1 },
      { mode: "bus", desc: "Naga → Siruma town", cost: 120, duration_hrs: 3 }
    ],
    note: "Faster and more comfortable. Total ~5 hrs door-to-door."
  }
]);

addRoute("manila", "boracay", [
  {
    id: "mnl_boracay_fly_caticlan",
    label: "✈ Fly Manila → Caticlan (Recommended)",
    legs: [
      { mode: "airline_budget", desc: "MNL → MPH Caticlan (Cebu Pacific/PAL, ~1 hr)", cost: 1500, duration_hrs: 1 },
      { mode: "tricycle", desc: "Caticlan Airport → port (3 min)", cost: 30, duration_hrs: 0.05 },
      { mode: "bangka", desc: "Caticlan port → Cagban Jetty, Boracay (10 min)", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Quickest route to Boracay. ~2 hrs door to island."
  },
  {
    id: "mnl_boracay_fly_kalibo",
    label: "✈ Fly Manila → Kalibo + Van to Boracay",
    legs: [
      { mode: "airline_budget", desc: "MNL → KLO Kalibo (AirAsia/Cebu Pacific, ~1 hr) — often cheaper", cost: 1200, duration_hrs: 1 },
      { mode: "van", desc: "Kalibo Airport → Caticlan port (~2 hrs, ₱200 shared)", cost: 200, duration_hrs: 2 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Kalibo flights are often cheaper. Trade off is 2 extra hours of van ride."
  }
]);

addRoute("manila", "palawan", [
  {
    id: "mnl_eln_fly",
    label: "✈ Fly Manila → El Nido (ENI) — Direct",
    legs: [
      { mode: "airline_budget", desc: "MNL → ENI El Nido (AirSWIFT / Cebu Pacific, ~1.25 hrs)", cost: 2500, duration_hrs: 1.25 }
    ],
    note: "Most convenient. ENI airport limited capacity — book early."
  },
  {
    id: "mnl_pps_van",
    label: "✈ Fly Manila → Puerto Princesa + Van to El Nido",
    legs: [
      { mode: "airline_budget", desc: "MNL → PPS Puerto Princesa (Cebu Pacific/PAL)", cost: 1800, duration_hrs: 1.25 },
      { mode: "van", desc: "PPS → El Nido shared van (~5–6 hrs, ₱700)", cost: 700, duration_hrs: 5.5 }
    ],
    note: "PPS has more/cheaper flights. El Nido van is available multiple times daily."
  },
  {
    id: "mnl_coron_fly",
    label: "✈ Fly Manila → Coron (USU) — For Coron divers",
    legs: [
      { mode: "airline_budget", desc: "MNL → USU Coron/Busuanga (Cebu Pacific, ~1 hr)", cost: 2000, duration_hrs: 1 }
    ],
    note: "Direct Manila-Coron daily. Ferry El Nido↔Coron available (₱1,500, 4 hrs) for combo trips."
  }
]);

addRoute("manila", "siargao", [
  {
    id: "mnl_iao_fly",
    label: "✈ Fly Manila → Siargao (IAO) — Direct",
    legs: [
      { mode: "airline_budget", desc: "MNL → IAO Siargao (Cebu Pacific, daily ~1.5 hrs)", cost: 2500, duration_hrs: 1.5 },
      { mode: "van", desc: "Sayak Airport → General Luna (~30 min)", cost: 250, duration_hrs: 0.5 }
    ],
    note: "Daily direct flights. Book at least 2–3 weeks ahead."
  },
  {
    id: "mnl_iao_via_cebu",
    label: "✈ Fly Manila → Cebu → Siargao",
    legs: [
      { mode: "airline_budget", desc: "MNL → CEB (Cebu Pacific, ~1.25 hrs)", cost: 1500, duration_hrs: 1.25 },
      { mode: "airline_budget", desc: "CEB → IAO (Cebu Pacific, ~1 hr)", cost: 1800, duration_hrs: 1 },
      { mode: "van", desc: "Sayak → General Luna", cost: 250, duration_hrs: 0.5 }
    ],
    note: "Good if direct IAO is full. More flight options via Cebu."
  }
]);

addRoute("manila", "la_union", [
  {
    id: "mnl_lu_bus",
    label: "🚌 Bus Manila → La Union / San Fernando",
    legs: [
      { mode: "bus", desc: "Cubao/Pasay → San Fernando, La Union (Partas/Dominion, ~5 hrs)", cost: 400, duration_hrs: 5 }
    ],
    note: "Frequent buses from Manila. Most popular surf weekend destination from Manila."
  },
  {
    id: "mnl_lu_car",
    label: "🚗 Private Car Manila → La Union",
    legs: [
      { mode: "car", desc: "Manila → San Juan, La Union via NLEX/TPLEX (~5 hrs)", cost: 800, duration_hrs: 5 }
    ],
    note: "Drive yourself or hire a car. NLEX toll ~₱300–₱450. Fastest during off-peak hours."
  }
]);

addRoute("manila", "batanes", [
  {
    id: "mnl_bsc_fly",
    label: "✈ Fly Manila → Basco (BSO)",
    legs: [
      { mode: "airline_budget", desc: "MNL → BSO Basco (PAL / SkyJet ATR-72, ~1.5 hrs)", cost: 5000, duration_hrs: 1.5 }
    ],
    note: "Very limited seats. Book 2–3 months ahead. SkyJet also operates Batanes routes."
  }
]);

addRoute("manila", "sagada", [
  {
    id: "mnl_sagada_bus",
    label: "🚌 Overnight Bus Manila → Sagada",
    legs: [
      { mode: "bus", desc: "Cubao/Dangwa → Bontoc (overnight, ~9 hrs)", cost: 600, duration_hrs: 9 },
      { mode: "van", desc: "Bontoc → Sagada (~1 hr)", cost: 80, duration_hrs: 1 }
    ],
    note: "Depart ~9–10 PM from Dangwa terminal, arrive Bontoc ~6 AM, Sagada ~7 AM."
  },
  {
    id: "mnl_sagada_bus_baguio",
    label: "🚌 Bus Manila → Baguio → Bus to Sagada",
    legs: [
      { mode: "bus", desc: "Manila → Baguio (Victory Liner, ~5 hrs)", cost: 350, duration_hrs: 5 },
      { mode: "bus", desc: "Baguio → Sagada (GL Trans via Bontoc, ~5.5 hrs)", cost: 250, duration_hrs: 5.5 }
    ],
    note: "Daytime option. Depart Manila early (5 AM), arrive Sagada by 4 PM."
  }
]);

addRoute("manila", "bohol", [
  {
    id: "mnl_bph_fly",
    label: "✈ Fly Manila → Tagbilaran (BPH) — Direct",
    legs: [
      { mode: "airline_budget", desc: "MNL → TAG Tagbilaran (Cebu Pacific/PAL, ~1.25 hrs)", cost: 2200, duration_hrs: 1.25 }
    ],
    note: "Daily direct flights to Bohol-Panglao International Airport."
  },
  {
    id: "mnl_bohol_cebu_ferry",
    label: "✈ Fly Manila → Cebu → Ferry to Bohol",
    legs: [
      { mode: "airline_budget", desc: "MNL → CEB (~1.25 hrs)", cost: 1500, duration_hrs: 1.25 },
      { mode: "ferry", desc: "Cebu Pier 1 → Tagbilaran (OceanJet, 2 hrs)", cost: 450, duration_hrs: 2 }
    ],
    note: "Often cheaper. OceanJet has many daily Cebu-Bohol trips."
  }
]);

addRoute("manila", "camiguin", [
  {
    id: "mnl_camiguin_fly_ferry",
    label: "✈ Fly Manila → Cagayan de Oro → Bus → Ferry to Camiguin",
    legs: [
      { mode: "airline_budget", desc: "MNL → CGY Cagayan de Oro (Cebu Pacific, ~1.5 hrs)", cost: 2000, duration_hrs: 1.5 },
      { mode: "bus", desc: "CDO → Balingoan port (2 hrs, ₱100)", cost: 100, duration_hrs: 2 },
      { mode: "ferry", desc: "Balingoan → Benoni port, Camiguin (1 hr)", cost: 200, duration_hrs: 1 }
    ],
    note: "Standard CDO route. Most reliable."
  },
  {
    id: "mnl_camiguin_via_cebu",
    label: "✈ Fly Manila → Cebu → Fly Cebu → Camiguin",
    legs: [
      { mode: "airline_budget", desc: "MNL → CEB", cost: 1500, duration_hrs: 1.25 },
      { mode: "airline_budget", desc: "CEB → Camiguin (limited schedule via Cebu Pacific)", cost: 2000, duration_hrs: 1 }
    ],
    note: "Check current Cebu Pacific CEB-XCN schedule — limited flights."
  }
]);

addRoute("manila", "cebu_kawasan", [
  {
    id: "mnl_kawasan_fly_bus",
    label: "✈ Fly Manila → Cebu → Bus to Badian",
    legs: [
      { mode: "airline_budget", desc: "MNL → CEB (Cebu Pacific, ~1.25 hrs)", cost: 1500, duration_hrs: 1.25 },
      { mode: "bus", desc: "Cebu South Bus Terminal → Badian (~2.5 hrs)", cost: 100, duration_hrs: 2.5 }
    ],
    note: "Standard Kawasan route. South Bus Terminal in Cebu City."
  }
]);

addRoute("manila", "bataan_corregidor", [
  {
    id: "mnl_corregidor_ferry",
    label: "⛴ Ferry Manila (CCP) → Corregidor Island",
    legs: [
      { mode: "car", desc: "Manila hotel/area → CCP Complex, Manila Bay", cost: 150, duration_hrs: 0.3 },
      { mode: "ferry", desc: "CCP → Corregidor Island (Sun Cruises, 2 hrs one-way, day tour)", cost: 1100, duration_hrs: 2 }
    ],
    note: "Sun Cruises all-inclusive package: ferry + tram + guide ≈ ₱2,200–₱2,800. Departs 7:30 AM."
  }
]);

addRoute("manila", "davao_samal", [
  {
    id: "mnl_davao_fly_ferry",
    label: "✈ Fly Manila → Davao → Ferry to Samal",
    legs: [
      { mode: "airline_budget", desc: "MNL → DVO Davao (Cebu Pacific/PAL, ~1.75 hrs)", cost: 2500, duration_hrs: 1.75 },
      { mode: "car", desc: "Davao Airport → Sasa port", cost: 150, duration_hrs: 0.5 },
      { mode: "ferry", desc: "Sasa → Samal Island (5 min)", cost: 20, duration_hrs: 0.08 }
    ],
    note: "Daily direct MNL-DVO. Multiple airlines fly this route."
  }
]);

addRoute("manila", "zamboanga_great_santa_cruz", [
  {
    id: "mnl_zambo_fly",
    label: "✈ Fly Manila → Zamboanga (ZAM)",
    legs: [
      { mode: "airline_budget", desc: "MNL → ZAM (PAL / Cebu Pacific, ~1.5 hrs)", cost: 3000, duration_hrs: 1.5 }
    ],
    note: "Daily flights. PAL has morning and afternoon options."
  }
]);

addRoute("manila", "calaguas", [
  {
    id: "mnl_calaguas_bus_bangka",
    label: "🚌 Bus Manila → Daet → Van → Bangka to Calaguas",
    legs: [
      { mode: "bus", desc: "Cubao/Pasay → Daet, Camarines Norte (Philtranco, ~7 hrs)", cost: 600, duration_hrs: 7 },
      { mode: "van", desc: "Daet → Capalonga port (~1 hr)", cost: 80, duration_hrs: 1 },
      { mode: "bangka", desc: "Capalonga → Calaguas (1.75 hrs)", cost: 250, duration_hrs: 1.75 }
    ],
    note: "Overnight bus is best. Last bangka to Calaguas ~9 AM — plan timing carefully."
  }
]);

addRoute("manila", "puerto_galera", [
  {
    id: "mnl_pg_bus_ferry",
    label: "🚌 Bus Manila → Batangas → Ferry to Puerto Galera",
    legs: [
      { mode: "bus", desc: "Pasay/Cubao → Batangas Grand Terminal (Jam Liner, ~2 hrs)", cost: 150, duration_hrs: 2 },
      { mode: "ferry", desc: "Batangas port → Sabang, Puerto Galera (bangka, 1.5 hrs)", cost: 350, duration_hrs: 1.5 }
    ],
    note: "Very easy weekend getaway. Buses run every 30 min from Pasay."
  }
]);

// ═══════════════════════════════════════════════════════════════════════════
// LEGAZPI → destinations
// ═══════════════════════════════════════════════════════════════════════════
addRoute("legazpi", "caramoan", [
  {
    id: "lgp_caramoan_bus_van",
    label: "🚌 Bus Legazpi → Naga + Van to Caramoan",
    legs: [
      { mode: "bus", desc: "Legazpi → Naga City (1 hr, ₱80)", cost: 80, duration_hrs: 1 },
      { mode: "van", desc: "Naga → Caramoan (RHK Van, 2.5 hrs)", cost: 180, duration_hrs: 2.5 }
    ],
    note: "Standard Legazpi-to-Caramoan route. ~3.5 hrs total."
  }
]);

addRoute("legazpi", "siruma", [
  {
    id: "lgp_siruma_bus",
    label: "🚌 Bus Legazpi → Naga + Bus to Siruma",
    legs: [
      { mode: "bus", desc: "Legazpi → Naga City (~1 hr)", cost: 80, duration_hrs: 1 },
      { mode: "bus", desc: "Naga → Siruma town (~3 hrs)", cost: 120, duration_hrs: 3 }
    ],
    note: "~4 hrs total. Early morning departure recommended."
  }
]);

addRoute("legazpi", "boracay", [
  {
    id: "lgp_boracay_fly_mph",
    label: "✈ Fly Legazpi (LGP) → Manila → Caticlan",
    legs: [
      { mode: "tricycle", desc: "Legazpi CBD → Daraga Airport (LGP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "LGP → MNL (Cebu Pacific, ~1 hr)", cost: 1600, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → MPH Caticlan", cost: 1500, duration_hrs: 1 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Straightforward. LGP has multiple daily flights to Manila."
  }
]);

addRoute("legazpi", "la_union", [
  {
    id: "lgp_lu_fly_bus",
    label: "✈ Fly Legazpi → Manila + Bus to La Union",
    legs: [
      { mode: "tricycle", desc: "Legazpi CBD → Daraga Airport (LGP)", cost: 80, duration_hrs: 0.25 },
      { mode: "airline_budget", desc: "LGP → MNL (~1 hr)", cost: 1600, duration_hrs: 1 },
      { mode: "bus", desc: "Manila → San Fernando, La Union (Partas, ~5 hrs)", cost: 400, duration_hrs: 5 }
    ],
    note: "Fly to Manila then bus north. Total ~7 hrs."
  }
]);

// ═══════════════════════════════════════════════════════════════════════════
// CEBU CITY → destinations
// ═══════════════════════════════════════════════════════════════════════════
addRoute("cebu", "boracay", [
  {
    id: "ceb_boracay_fly",
    label: "✈ Fly Cebu → Caticlan (Direct)",
    legs: [
      { mode: "airline_budget", desc: "CEB → MPH Caticlan (Cebu Pacific, ~1 hr)", cost: 1800, duration_hrs: 1 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Cebu Pacific has direct CEB-MPH. Very convenient."
  },
  {
    id: "ceb_boracay_ferry_iloilo",
    label: "⛴ Ferry Cebu → Iloilo + FastCraft to Caticlan",
    legs: [
      { mode: "ferry", desc: "Cebu → Iloilo City (Supercat/OceanJet, ~2 hrs)", cost: 400, duration_hrs: 2 },
      { mode: "ferry", desc: "Iloilo → Caticlan (FastCraft, 2 hrs)", cost: 400, duration_hrs: 2 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Budget option. All sea, ~4.5 hrs travel plus waiting."
  }
]);

addRoute("cebu", "bohol", [
  {
    id: "ceb_bohol_ferry",
    label: "⛴ Ferry Cebu → Bohol (OceanJet / SuperCat)",
    legs: [
      { mode: "ferry", desc: "Cebu City Pier 1 → Tagbilaran, Bohol (2 hrs, multiple daily)", cost: 450, duration_hrs: 2 }
    ],
    note: "Most popular route. Buy tickets at Pier 1 or online. Earliest boat ~6 AM."
  },
  {
    id: "ceb_bohol_fly",
    label: "✈ Fly Cebu → Tagbilaran (TAG)",
    legs: [
      { mode: "airline_budget", desc: "CEB → TAG (~30 min)", cost: 1500, duration_hrs: 0.5 }
    ],
    note: "Quick flight but often more expensive than ferry for short distances."
  }
]);

addRoute("cebu", "siargao", [
  {
    id: "ceb_siargao_fly",
    label: "✈ Fly Cebu → Siargao (IAO) — Direct",
    legs: [
      { mode: "airline_budget", desc: "CEB → IAO (Cebu Pacific, ~1 hr, multiple daily)", cost: 1800, duration_hrs: 1 },
      { mode: "van", desc: "Sayak Airport → General Luna", cost: 250, duration_hrs: 0.5 }
    ],
    note: "Direct and easy. Cebu Pacific has the most CEB-IAO frequency."
  }
]);

addRoute("cebu", "palawan", [
  {
    id: "ceb_pps_fly",
    label: "✈ Fly Cebu → Puerto Princesa (PPS)",
    legs: [
      { mode: "airline_budget", desc: "CEB → PPS (Cebu Pacific, ~1.25 hrs)", cost: 2000, duration_hrs: 1.25 },
      { mode: "van", desc: "PPS → El Nido shared van (~5.5 hrs)", cost: 700, duration_hrs: 5.5 }
    ],
    note: "Direct CEB-PPS available. Long van to El Nido afterward."
  }
]);

addRoute("cebu", "la_union", [
  {
    id: "ceb_lu_fly_bus",
    label: "✈ Fly Cebu → Manila + Bus to La Union",
    legs: [
      { mode: "airline_budget", desc: "CEB → MNL (~1.25 hrs)", cost: 1500, duration_hrs: 1.25 },
      { mode: "bus", desc: "Manila → San Fernando, La Union (Partas, ~5 hrs)", cost: 400, duration_hrs: 5 }
    ],
    note: "Fly to Manila then catch a bus north. Total ~7 hrs."
  }
]);

addRoute("cebu", "camiguin", [
  {
    id: "ceb_camiguin_fly_ferry",
    label: "✈ Fly Cebu → CDO + Bus → Ferry to Camiguin",
    legs: [
      { mode: "airline_budget", desc: "CEB → CGY Cagayan de Oro (~1 hr)", cost: 1500, duration_hrs: 1 },
      { mode: "bus", desc: "CDO → Balingoan port (~2 hrs)", cost: 100, duration_hrs: 2 },
      { mode: "ferry", desc: "Balingoan → Camiguin (~1 hr)", cost: 200, duration_hrs: 1 }
    ],
    note: "Multiple CEB-CGY flights daily."
  }
]);

// ═══════════════════════════════════════════════════════════════════════════
// ILOILO → destinations
// ═══════════════════════════════════════════════════════════════════════════
addRoute("iloilo", "boracay", [
  {
    id: "ilo_boracay_fastcraft",
    label: "⛴ FastCraft Iloilo → Caticlan (Direct — Best option!)",
    legs: [
      { mode: "ferry", desc: "Iloilo port → Caticlan (2GO / Weesam FastCraft, ~2 hrs)", cost: 400, duration_hrs: 2 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Cheapest and most scenic route to Boracay from Iloilo. Multiple daily trips."
  },
  {
    id: "ilo_boracay_fly",
    label: "✈ Fly Iloilo → Manila → Caticlan",
    legs: [
      { mode: "airline_budget", desc: "ILO → MNL (~1 hr)", cost: 1500, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → MPH Caticlan", cost: 1500, duration_hrs: 1 },
      { mode: "bangka", desc: "Caticlan → Boracay", cost: 200, duration_hrs: 0.17 }
    ],
    note: "Only worth it if ferry is not available. FastCraft is much better from Iloilo."
  }
]);

addRoute("iloilo", "palawan", [
  {
    id: "ilo_palawan_fly",
    label: "✈ Fly Iloilo → Manila → Puerto Princesa/El Nido",
    legs: [
      { mode: "airline_budget", desc: "ILO → MNL", cost: 1500, duration_hrs: 1 },
      { mode: "airline_budget", desc: "MNL → PPS / ENI", cost: 2000, duration_hrs: 1.25 }
    ],
    note: "Via Manila connection. Or check for ILO-PPS direct (seasonal)."
  }
]);

// ═══════════════════════════════════════════════════════════════════════════
// DAVAO → destinations
// ═══════════════════════════════════════════════════════════════════════════
addRoute("davao", "camiguin", [
  {
    id: "dvo_camiguin_bus_ferry",
    label: "🚌 Bus Davao → CDO + Bus → Ferry to Camiguin",
    legs: [
      { mode: "bus", desc: "Davao → Cagayan de Oro (bus, ~3 hrs)", cost: 300, duration_hrs: 3 },
      { mode: "bus", desc: "CDO → Balingoan port (~2 hrs)", cost: 100, duration_hrs: 2 },
      { mode: "ferry", desc: "Balingoan → Camiguin (~1 hr)", cost: 200, duration_hrs: 1 }
    ],
    note: "Totally doable by land+sea from Davao. No flights needed."
  },
  {
    id: "dvo_camiguin_fly_ferry",
    label: "✈ Fly Davao → CDO + Bus → Ferry to Camiguin",
    legs: [
      { mode: "airline_budget", desc: "DVO → CGY (~1 hr, if available)", cost: 1500, duration_hrs: 1 },
      { mode: "bus", desc: "CDO → Balingoan port", cost: 100, duration_hrs: 2 },
      { mode: "ferry", desc: "Balingoan → Camiguin", cost: 200, duration_hrs: 1 }
    ],
    note: "Flying saves ~2 hrs vs bus. Check for DVO-CGY schedule."
  }
]);

addRoute("davao", "siargao", [
  {
    id: "dvo_siargao_fly",
    label: "✈ Fly Davao → Cebu → Siargao",
    legs: [
      { mode: "airline_budget", desc: "DVO → CEB (~1 hr)", cost: 1500, duration_hrs: 1 },
      { mode: "airline_budget", desc: "CEB → IAO Siargao (~1 hr)", cost: 1800, duration_hrs: 1 },
      { mode: "van", desc: "Sayak → General Luna", cost: 250, duration_hrs: 0.5 }
    ],
    note: "Via Cebu is the standard Davao→Siargao connection."
  },
  {
    id: "dvo_siargao_bus_ferry",
    label: "🚌 Bus/Van Davao → Surigao City → Ferry to Siargao",
    legs: [
      { mode: "bus", desc: "Davao → Surigao City (bus, ~5–6 hrs)", cost: 400, duration_hrs: 5.5 },
      { mode: "ferry", desc: "Surigao port → Dapa, Siargao (RORO/FastFerry, 2 hrs)", cost: 250, duration_hrs: 2 },
      { mode: "van", desc: "Dapa → General Luna (~45 min)", cost: 100, duration_hrs: 0.75 }
    ],
    note: "Budget overland+sea option. Total ~8–9 hrs but much cheaper."
  }
]);

// ═══════════════════════════════════════════════════════════════════════════
// GENERIC FALLBACK BUILDER
// For origin-destination pairs not explicitly listed, build a reasonable
// estimate from known pricing tiers.
// ═══════════════════════════════════════════════════════════════════════════
const FALLBACK_COSTS = {
  // [origin_region][dest_tier] = approximate one-way fare per person
  luzon_bicol:    { budget: 700,  mid: 1900, premium: 3500 },
  luzon_luzon:    { budget: 600,  mid: 1600, premium: 3000 },
  luzon_visayas:  { budget: 1200, mid: 2800, premium: 5000 },
  luzon_mindanao: { budget: 1800, mid: 4000, premium: 6500 },
  visayas_bicol:  { budget: 1500, mid: 3200, premium: 5500 },
  visayas_luzon:  { budget: 1500, mid: 3000, premium: 5000 },
  visayas_visayas:{ budget: 700,  mid: 1800, premium: 3500 },
  visayas_mindanao:{ budget: 800, mid: 2000, premium: 3800 },
  mindanao_bicol:  { budget: 2000, mid: 4200, premium: 7000 },
  mindanao_luzon:  { budget: 1800, mid: 4000, premium: 6500 },
  mindanao_visayas:{ budget: 800,  mid: 2000, premium: 3800 },
  mindanao_mindanao:{ budget: 500, mid: 1500, premium: 3000 }
};

// Map origins to regions for fallback
const ORIGIN_MACRO_REGION = {
  manila: "luzon", naga: "luzon", legazpi: "luzon",
  cebu_luzon: "luzon", baguio: "luzon", san_fernando: "luzon",
  dagupan: "luzon", laoag: "luzon", tuguegarao: "luzon",
  cebu: "visayas", iloilo: "visayas", bacolod: "visayas",
  tacloban: "visayas", dumaguete: "visayas", roxas: "visayas",
  davao: "mindanao", cagayan: "mindanao", zamboanga: "mindanao",
  general_santos: "mindanao", butuan: "mindanao", cotabato: "mindanao"
};

// Map destinations to macro-regions for fallback
const DEST_MACRO_REGION = {
  caramoan: "bicol", siruma: "bicol", calaguas: "bicol",
  batanes: "luzon", la_union: "luzon", sagada: "luzon",
  bataan_corregidor: "luzon", puerto_galera: "luzon",
  boracay: "visayas", palawan: "visayas", cebu_kawasan: "visayas",
  bohol: "visayas", siargao: "visayas",
  camiguin: "mindanao", davao_samal: "mindanao",
  zamboanga_great_santa_cruz: "mindanao"
};

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all route options for an origin→destination pair.
 * Returns array of route option objects with .total_cost (roundtrip per person).
 */
function getRouteOptions(originKey, destKey) {
  const routes = ROUTES[originKey]?.[destKey];
  if (routes && routes.length > 0) {
    return routes.map(r => ({
      ...r,
      total_cost:    computeRouteCost(r) * 2, // roundtrip
      total_hrs:     computeRouteHours(r),
      total_cost_ow: computeRouteCost(r)      // one-way
    }));
  }
  // Try reverse and use same costs (symmetric)
  const reverse = ROUTES[destKey]?.[originKey];
  if (reverse && reverse.length > 0) {
    return reverse.map(r => ({
      ...r,
      total_cost:    computeRouteCost(r) * 2,
      total_hrs:     computeRouteHours(r),
      total_cost_ow: computeRouteCost(r)
    }));
  }
  // Fallback: generate a generic option
  return buildFallbackRoutes(originKey, destKey);
}

/**
 * Get cheapest route cost (roundtrip per person) for budget calculation.
 */
function getCheapestRouteCost(originKey, destKey) {
  const options = getRouteOptions(originKey, destKey);
  if (!options.length) return 3000;
  return Math.min(...options.map(r => r.total_cost));
}

/**
 * Get route cost by transport mode preference.
 * mode: "bus_van" | "budget_airline" | "full_airline" | "private_car" | "boat_ferry"
 */
function getRouteCostByMode(originKey, destKey, preferredMode) {
  const options = getRouteOptions(originKey, destKey);
  if (!options.length) return 3000;

  const modeMap = {
    bus_van:        ["bus", "van", "tricycle"],
    budget_airline: ["airline_budget", "bangka", "ferry"],
    full_airline:   ["airline_full", "airline_budget"],
    private_car:    ["car"],
    boat_ferry:     ["ferry", "bangka"]
  };

  const preferred = modeMap[preferredMode] || [];

  // Find best matching route
  let bestMatch = null;
  let bestCost  = Infinity;

  for (const opt of options) {
    const legModes = opt.legs.map(l => l.mode);
    const hasMatch = preferred.some(m => legModes.includes(m));
    if (hasMatch && opt.total_cost < bestCost) {
      bestMatch = opt;
      bestCost  = opt.total_cost;
    }
  }

  // If no mode-specific match, return cheapest overall
  return bestMatch ? bestMatch.total_cost : options[0].total_cost;
}

/**
 * Get the best (cheapest) single route option object.
 */
function getBestRoute(originKey, destKey) {
  const options = getRouteOptions(originKey, destKey);
  if (!options.length) return null;
  return options.reduce((a, b) => a.total_cost < b.total_cost ? a : b);
}

/**
 * Format a route option for display in the transport sub-label.
 */
function formatRouteLabel(route) {
  if (!route) return "Via connecting transport";
  const legs = route.legs.map(l => l.desc).join(" → ");
  const hrs  = route.total_hrs;
  const hrsLabel = hrs >= 1 ? `~${Math.round(hrs)}h travel` : `~${Math.round(hrs * 60)}min travel`;
  return `${route.label} (${hrsLabel})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function computeRouteCost(route) {
  return route.legs.reduce((sum, leg) => sum + (leg.cost || 0), 0);
}

function computeRouteHours(route) {
  return route.legs.reduce((sum, leg) => sum + (leg.duration_hrs || 0), 0);
}

function buildFallbackRoutes(originKey, destKey) {
  const oRegion = ORIGIN_MACRO_REGION[originKey] || "luzon";
  const dRegion = DEST_MACRO_REGION[destKey]     || "visayas";
  const key     = `${oRegion}_${dRegion}`;
  const costs   = FALLBACK_COSTS[key] || FALLBACK_COSTS.luzon_visayas;

  return [
    {
      id:          `fallback_budget_${originKey}_${destKey}`,
      label:       "Budget Option (Bus / Ferry combination)",
      legs:        [{ mode: "bus", desc: "Overland + ferry combination", cost: costs.budget, duration_hrs: 8 }],
      total_cost:  costs.budget * 2,
      total_hrs:   8,
      total_cost_ow: costs.budget,
      note:        "Approximate cost. Check local terminals for schedules."
    },
    {
      id:          `fallback_mid_${originKey}_${destKey}`,
      label:       "Mid-Range Option (Budget airline)",
      legs:        [{ mode: "airline_budget", desc: "Budget airline + local transfer", cost: costs.mid, duration_hrs: 3 }],
      total_cost:  costs.mid * 2,
      total_hrs:   3,
      total_cost_ow: costs.mid,
      note:        "Cebu Pacific / AirAsia fare estimate. Book 2–3 weeks ahead for best price."
    },
    {
      id:          `fallback_premium_${originKey}_${destKey}`,
      label:       "Premium Option (Full-service airline)",
      legs:        [{ mode: "airline_full", desc: "PAL or Cebu Pacific + private transfer", cost: costs.premium, duration_hrs: 3 }],
      total_cost:  costs.premium * 2,
      total_hrs:   3,
      total_cost_ow: costs.premium,
      note:        "Includes comfort seating, baggage allowance, and private airport transfer."
    }
  ];
}