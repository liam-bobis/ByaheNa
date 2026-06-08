/**
 * data.js — ByaheNa Vacation Cost Estimator
 *
 * PRICING DATA (Philippine Pesos, as of 2024–2025)
 *
 * HOW TO KEEP THIS UP TO DATE:
 * Option A — Google Sheets: Replace this file's contents with a fetch()
 *   call to the Sheets API. Each "table" below mirrors a Sheet tab.
 *   See: sheets-integration-guide.md for full instructions.
 *
 * Option B — Local JSON: Edit prices.json and import here.
 *
 * STRUCTURE:
 *  DESTINATIONS  — per-destination metadata & activity costs
 *  TRANSPORT     — origin→destination transport costs by mode
 *  HOTELS        — nightly rates by hotel type & destination tier
 *  FOOD          — daily food budgets by dining style
 *  LOCAL_TRANSPORT — in-destination daily costs
 *  SHOPPING      — pasalubong / shopping estimates
 *
 * All amounts are PER PERSON unless noted.
 * ------------------------------------------------------------ */

"use strict";

// ============================================================
// DESTINATIONS
// ============================================================
const DESTINATIONS = {
  caramoan: {
    name: "Caramoan",
    province: "Camarines Sur",
    region: "Bicol",
    tagline: "Hidden limestone karsts and pristine lagoons",
    description: "A remote paradise in the tip of Camarines Sur, famous for its Survivor-worthy islands, crystal-clear coves, and undiscovered beaches.",
    type: "island",
    climate_note: "Best visited Nov–May. Avoid June–Oct (typhoon season).",
    tier: "budget_friendly", // affects hotel base prices
    activities: {
      group:         { label: "Group Island-Hopping Tour (shared bangka)", price: 800,  desc: "Includes 4–5 island stops, snorkeling gear rental extra" },
      semi_private:  { label: "Semi-Private Boat Tour (4–6 pax)", price: 1500, desc: "Dedicated boat, guide, lunch sometimes included" },
      private:       { label: "Private Bangka + Full-Day Tour", price: 2800, desc: "Private boat, flexible itinerary, guide included" },
      premium_package: { label: "Premium Island Package + Kayak", price: 4500, desc: "Private boat, kayak, lunch, snorkeling, drone shot extra" }
    },
    entrance_fees: 150, // municipal/environment fee per person
    tips: [
      { icon: "🚐", title: "Getting Around Caramoan Town", text: "Tricycles are the main local transport. Expect ₱30–₱50 per trip within town. Habal-habal (motorcycle taxi) for farther barangays." },
      { icon: "💵", title: "Bring Cash!", text: "Caramoan has very limited ATMs and most establishments are cash-only. Withdraw in Naga or San Jose before heading in." },
      { icon: "🌊", title: "Best Beaches", text: "Hunongan Cove, Matukad Beach, Lahos Island, and Cotivas Island are the top picks. Ask your boatman for hidden spots not on tours." },
      { icon: "📵", title: "Limited Signal", text: "Mobile data is weak/non-existent in most coves. Download offline maps (Maps.me or Google Maps offline) before arriving." },
      { icon: "🏠", title: "Accommodation Note", text: "Most resorts are basic fan-room style. Book ahead during Holy Week and summer peak (March–May). Few 3-star options exist." },
      { icon: "🎣", title: "Eat Like a Local", text: "Fresh seafood is incredibly cheap here. Ask your boatman to buy directly from fishing boats — you can have your catch cooked at the resort for a small fee." }
    ],
    packing: {
      essentials: ["Sun protection (SPF 50+ reef-safe)", "Rash guard", "Cash (enough for the whole trip)", "Waterproof bag", "Flip-flops + sneakers"],
      gear: ["Snorkeling set (rentals available but limited)", "Underwater camera or dry bag for phone", "Portable charger", "Headlamp / flashlight"],
      clothing: ["Light breathable clothes", "Cover-up for boat rides", "Quick-dry shorts & swimwear", "Light jacket (evenings on the water)"],
      health: ["Motion sickness tablets (boat rides can be rocky)", "Mosquito repellent", "First-aid basics", "Hydration salts"]
    },
    itinerary_template: [
      {
        title: "Arrival Day",
        subtitle: "Travel from origin → Caramoan",
        events: [
          { time: "Early AM", icon: "🚌", name: "Depart from Origin", desc: "Bus or van to Naga City / San Jose terminal. From Naga: 2.5–3 hrs via RHK Transport van (₱180/person).", cost_key: "transport" },
          { time: "Mid-day",  icon: "🏘️", name: "Arrive in Caramoan Town", desc: "Check in to your accommodation, freshen up, and explore the town proper." },
          { time: "Afternoon",icon: "🚤", name: "Sunset Boat Ride (Optional)", desc: "Quick afternoon cruise to catch golden hour on the lagoons. Ask your resort for arrangements.", cost_key: "optional" },
          { time: "Evening",  icon: "🍽️", name: "Dinner at Caramoan Town", desc: "Fresh grilled seafood at local eateries near the town plaza. Try the fried panga (tuna jaw).", cost_key: "food" }
        ]
      },
      {
        title: "Island-Hopping Day",
        subtitle: "The main event — karst islands & crystal coves",
        events: [
          { time: "7:00 AM",  icon: "🌅", name: "Early Breakfast", desc: "Rice, egg, and instant coffee at the resort or nearby carinderia. Early start is important to beat other tour groups.", cost_key: "food" },
          { time: "8:00 AM",  icon: "🚤", name: "Island-Hopping Tour Departs", desc: "Head out by bangka. Typical stops: Matukad Beach, Cotivas, Hunongan Cove, Lahos Island, and Sabitang Laya.", cost_key: "activities" },
          { time: "12:00 PM", icon: "🍱", name: "Packed Lunch on the Island", desc: "Most tour packages include a packed meal. Budget travelers: bring your own; premium: your guide prepares a spread.", cost_key: "food" },
          { time: "3:00 PM",  icon: "🏄", name: "Free Swim & Snorkeling", desc: "Snorkeling around Gota Beach area. Clear waters, diverse marine life.", cost_key: null },
          { time: "5:00 PM",  icon: "🛶", name: "Return to Town", desc: "Head back to your resort, rinse gear, rest." },
          { time: "7:00 PM",  icon: "🦞", name: "Seafood Dinner", desc: "Grilled lobster, squid, and shells at local seafood restaurants. Prices are set per kilo — negotiate and choose your own catch.", cost_key: "food" }
        ]
      },
      {
        title: "Final Day",
        subtitle: "Leisurely morning, then head home",
        events: [
          { time: "7:00 AM",  icon: "🌄", name: "Sunrise at the Port", desc: "Short walk to the Caramoan port for a beautiful sunrise over the sea." },
          { time: "8:00 AM",  icon: "☕", name: "Breakfast & Check-out", desc: "Last meal in Caramoan, pack up, check out from your resort.", cost_key: "food" },
          { time: "9:30 AM",  icon: "🛍️", name: "Pasalubong Shopping", desc: "Buy dried fish, bottled bagoong, and local shrimp paste at the public market before leaving.", cost_key: "shopping" },
          { time: "10:30 AM", icon: "🚐", name: "Depart for Home", desc: "Van or bus back to Naga / your connecting point. About 2.5–3 hours to Naga.", cost_key: "transport" },
          { time: "Afternoon",icon: "🏠", name: "Arrive Home / Connecting City", desc: "End of your Caramoan adventure!" }
        ]
      }
    ]
  },

  boracay: {
    name: "Boracay",
    province: "Aklan",
    region: "Western Visayas",
    tagline: "World-famous White Beach and vibrant nightlife",
    description: "The Philippines' most iconic island — 4km of powdery white sand, turquoise waters, world-class water sports, and a buzzing nightlife scene.",
    type: "island_resort",
    climate_note: "Best Oct–May. Peak Dec–Apr. Avoid Jun–Sep (Amihan winds shift, Habagat season).",
    tier: "premium_friendly",
    activities: {
      group:         { label: "Group Paraw Sailing (sunset sail)", price: 800,  desc: "Traditional Filipino sailboat sunset cruise, ~1 hour" },
      semi_private:  { label: "Water Sports Package (3–4 activities)", price: 2500, desc: "Parasailing, banana boat, helmet dive, or jet ski combo" },
      private:       { label: "Private Island Tour + Cliff Jumping", desc: "Crocodile Island snorkeling, Puka Shell Beach, Bat Cave", price: 3500 },
      premium_package: { label: "Helmet Dive + Parasailing + Private Paraw", price: 6000, desc: "Best of Boracay water activities, guided & flexible" }
    },
    entrance_fees: 150,
    tips: [
      { icon: "✈️", title: "Getting to Boracay", text: "Fly to Caticlan (Godofredo P. Ramos Airport) for the quickest access — just a short tricycle + boat ride away. Kalibo airport is cheaper but adds 2+ hours on the road." },
      { icon: "🚌", title: "E-Trikes Only on the Island", text: "Private cars are banned. Only e-trikes and walking. Station 1 (north) is quieter; Station 3 (south) is livelier. D'Mall is the commercial center." },
      { icon: "💰", title: "Negotiate Everything", text: "Water sports prices are almost always negotiable, especially during off-peak. Book at the beach directly rather than through your hotel's concierge." },
      { icon: "🌅", title: "Best Free Activity: Sunset", text: "White Beach's sunset is legendary and free. Grab a cheap beer from a convenience store and watch from the beach — same view as the bars at 1/10 the price." },
      { icon: "🍹", title: "Eat Away from the Beach", text: "Restaurants on White Beach have a premium. Walk one street back (Real Street / Main Road) for the same quality food at 40–60% less." },
      { icon: "🏨", title: "Book Accommodation Early", text: "December–April is peak season. Book resorts 2–3 months ahead. Budget guesthouses in Station 3 can be as low as ₱800/night; Station 1 resorts go up to ₱30,000+." }
    ],
    packing: {
      essentials: ["Reef-safe sunscreen (required)", "Cash + cards", "Government-issued ID", "Return ferry ticket", "Portable charger"],
      gear: ["Snorkeling set (cheaper to bring than rent)", "Dry bag", "GoPro / waterproof phone case", "Sarong / beach cover"],
      clothing: ["Multiple swimsuits (you'll be in the water a lot)", "Light evening dress/shirt for bars", "Walking sandals", "Hat & sunglasses"],
      health: ["Seasickness meds (boat to island can be rough)", "After-sun lotion", "Insect repellent", "Reef shoes for rocky spots"]
    },
    itinerary_template: [
      {
        title: "Arrival — White Beach Hello",
        subtitle: "Fly in, check in, soak it all in",
        events: [
          { time: "Morning",   icon: "✈️", name: "Fly to Caticlan / Kalibo", desc: "Board your flight from your nearest airport. Caticlan is closer but Kalibo flights are cheaper. Budget 30 min Caticlan vs 2 hrs Kalibo to Boracay.", cost_key: "transport" },
          { time: "Midday",    icon: "⛵", name: "Bangka Ride to Boracay", desc: "5-minute ferry from Caticlan port. Terminal fee + tourism fee required (₱200 approx).", cost_key: "local" },
          { time: "Afternoon", icon: "🏨", name: "Check-in & Explore", desc: "Drop bags, change into beachwear, and walk White Beach from end to end." },
          { time: "6:00 PM",   icon: "🌅", name: "Sunset at White Beach", desc: "Watch the famous Boracay sunset — one of the best in Asia. Free!", cost_key: null },
          { time: "8:00 PM",   icon: "🍽️", name: "Dinner at D'Mall / Station 2", desc: "Wide variety of restaurants: Filipino, Korean, Italian. Mid-range budget: Spider House or Nonie's.", cost_key: "food" }
        ]
      },
      {
        title: "Water Sports & Island Life",
        subtitle: "Make the most of the ocean",
        events: [
          { time: "7:30 AM",  icon: "🌄", name: "Early Morning Swim", desc: "White Beach is calm and near-empty in the early morning — best time to swim.", cost_key: null },
          { time: "9:00 AM",  icon: "🤿", name: "Water Sports Session", desc: "Choose from parasailing, banana boat, helmet dive, cliff jumping (Ariel's Point), or jet skiing at the beach activity stalls.", cost_key: "activities" },
          { time: "12:30 PM", icon: "🍜", name: "Lunch — Real Street", desc: "Head one block back from White Beach for affordable Filipino meals. Try Aplaya or Lemon i Cafe.", cost_key: "food" },
          { time: "2:30 PM",  icon: "🚤", name: "Puka Shell Beach or Diniwid", desc: "E-trike to Puka Beach (quieter, locals' fave) or tiny Diniwid Beach. Snorkel off the shore.", cost_key: "local" },
          { time: "5:30 PM",  icon: "⛵", name: "Paraw Sunset Sailing", desc: "Traditional sailboat sunset cruise — a must-do Boracay bucket list item. Book on the beach.", cost_key: "activities" },
          { time: "8:00 PM",  icon: "🎵", name: "Evening at Station 1 or Dos Mestizos", desc: "Cocktails, live music, night market. Budget: beachside bars. Mid: Epic Bar. Premium: Aria/Aria Chill.", cost_key: "food" }
        ]
      },
      {
        title: "Explore & Depart",
        subtitle: "Last morning, last swim, head home",
        events: [
          { time: "7:00 AM",  icon: "🧘", name: "Morning Yoga or Walk", desc: "Many free yoga sessions on the beach in the morning. Or just walk from Station 1 to Station 3." },
          { time: "9:00 AM",  icon: "🥞", name: "Brunch", desc: "Tratoria d'Isola for Italian breakfast, or Jonah's Fruit Shakes (legendary!) on the beach.", cost_key: "food" },
          { time: "10:30 AM", icon: "🛍️", name: "Last-Minute Shopping", desc: "D'Mall night market has pasalubong: ukay, local crafts, shell jewelry, Boracay shirts.", cost_key: "shopping" },
          { time: "12:00 PM", icon: "🏨", name: "Check-out", desc: "Most hotels are 12 NN checkout. Request late checkout if your flight is afternoon." },
          { time: "2:00 PM",  icon: "⛵", name: "Ferry Back to Caticlan", desc: "Head to the port, take the 5-min bangka ride, and catch your flight home.", cost_key: "transport" }
        ]
      }
    ]
  },

  palawan: {
    name: "El Nido / Coron",
    province: "Palawan",
    region: "MIMAROPA",
    tagline: "UNESCO-listed lagoons and WWII wreck diving",
    description: "Home to the world's best beaches (UNESCO, CNN Travel rankings). El Nido's limestone karsts and Coron's crystal-clear shipwreck diving are bucket-list experiences.",
    type: "island_premium",
    climate_note: "Best Nov–May. Wet season Jun–Oct can make island-hopping difficult.",
    tier: "premium_friendly",
    activities: {
      group:         { label: "Tour A, B, C, or D (group boat)", price: 1200, desc: "Lagoons, beaches, snorkeling — 4–6 stops per tour" },
      semi_private:  { label: "Semi-Private Palawan Tour (4–6 pax)", price: 2500, desc: "More flexibility, less crowding, 5–7 stops" },
      private:       { label: "Private Boat Full-Day Tour", price: 5500, desc: "Charter a bangka for the whole day, customize stops" },
      premium_package: { label: "Premium Lagoon + Kayak + Snorkel Package", price: 8500, desc: "Best lagoons incl. restricted areas, guides, lunch, transfers" }
    },
    entrance_fees: 200,
    tips: [
      { icon: "🛫", title: "Fly Direct to Puerto Princesa or El Nido", text: "Puerto Princesa (PPS) is the main hub. El Nido Airport (ENI) now has flights from Manila — much faster. Coron (Busuanga) also has direct flights." },
      { icon: "🌊", title: "Lagoon Booking Tips", text: "The Big and Small Lagoon require permits (₱400 pp, limited daily). Book through accredited El Nido tour operators or the PCSDS office online at least a week ahead." },
      { icon: "💧", title: "Reef-Safe Sunscreen", text: "Non-negotiable in Palawan. They actively check and turn back tourists with chemical sunscreen at the lagoons. Bring mineral/zinc oxide sunscreen." },
      { icon: "📅", title: "Book Coron vs El Nido", text: "Can't decide? El Nido = lagoons, karst formations. Coron = wreck diving, thermal lakes. Both in one trip via ferry (₱1,500, 4 hrs) is doable for 6+ day trips." },
      { icon: "🍽️", title: "Food in El Nido Town", text: "Amboy's, Happiness Beach Bar, and El Nido Boutique are local favorites. Avoid restaurants on the waterfront road — same food, double the price." },
      { icon: "🌿", title: "Environmental Fees", text: "El Nido charges a tourism development fee (₱200) plus lagoon fees (₱400 for each restricted lagoon). Budget for these — they fund conservation." }
    ],
    packing: {
      essentials: ["Reef-safe (mineral) sunscreen ONLY", "Waterproof daypack", "Cash (ATMs limited in El Nido)", "Anti-seasickness meds", "Reusable water bottle"],
      gear: ["Snorkeling set", "Underwater camera", "Life vest (provided on tours)", "Trekking sandals", "Dry bag"],
      clothing: ["Rash guard (sun is intense)", "Swimwear × 3", "Light layers for evenings", "Waterproof sandals"],
      health: ["Sunburn treatment", "Diarrhea medicine", "Mosquito repellent (dengue risk)", "Water purification tablets"]
    },
    itinerary_template: [
      {
        title: "Arrival in Puerto Princesa / El Nido",
        subtitle: "Gateway to the last frontier",
        events: [
          { time: "Morning",   icon: "✈️", name: "Flight to Puerto Princesa (PPS)", desc: "Most flights route through Manila. PPS to El Nido by van: 5–6 hrs (₱700 shared van). El Nido airport direct: 30 mins.", cost_key: "transport" },
          { time: "Midday",    icon: "🌿", name: "Underground River (optional)", desc: "If arriving via Puerto Princesa, do the Puerto Princesa Underground River (UNESCO World Heritage Site). Book ahead — daily visitor cap applies.", cost_key: "activities" },
          { time: "Late PM",   icon: "🏘️", name: "Arrive El Nido / Check-in", desc: "Most accommodations are in or near El Nido town. Budget: Fan rooms near town. Mid: Inns with sea views. Premium: Lagen Island Resort or Miniloc." },
          { time: "Evening",   icon: "🦐", name: "Dinner at El Nido Town", desc: "Try Happiness Beach Bar or Amboy's for fresh catch. Iced halo-halo at the market.", cost_key: "food" }
        ]
      },
      {
        title: "Lagoon Day — Tour A or B",
        subtitle: "The iconic Big Lagoon, Small Lagoon, and beyond",
        events: [
          { time: "7:00 AM",  icon: "🌅", name: "Early Pickup from Resort", desc: "Tours depart from the beach in front of town. Bring ALL reef-safe sunscreen, water, and snacks." },
          { time: "8:00 AM",  icon: "🚤", name: "Tour A Departs", desc: "Stop 1: Small Lagoon (kayak inside). Stop 2: Big Lagoon. Stop 3: Secret Lagoon. Stop 4: Shimizu Island for snorkeling. Stop 5: Seven Commandos Beach.", cost_key: "activities" },
          { time: "12:00 PM", icon: "🍱", name: "Beach Lunch Included", desc: "Tour operators serve a packed Filipino lunch on one of the beaches — typically grilled fish, rice, and fruit." },
          { time: "4:00 PM",  icon: "🏖️", name: "Return to El Nido Town", desc: "Time to shower, rest, and buy pasalubong or explore Corong-Corong." },
          { time: "7:00 PM",  icon: "🌟", name: "Stargazing on the Beach", desc: "El Nido has minimal light pollution. Head to Las Cabanas Beach for one of the best night skies in the Philippines.", cost_key: null }
        ]
      },
      {
        title: "Island Hopping + Departure",
        subtitle: "More islands, then homeward bound",
        events: [
          { time: "7:00 AM",  icon: "🤿", name: "Tour B or C (Snorkeling Focus)", desc: "Tour B: Cathedral Cave, Entalula, Pinagbuyutan. Tour C: Hidden Beach, Matinloc Shrine, Secret Beach.", cost_key: "activities" },
          { time: "12:00 PM", icon: "🍹", name: "Beach Lunch", desc: "As before — packed meal included with most group tour packages." },
          { time: "3:00 PM",  icon: "🏪", name: "Check-out & Last Shopping", desc: "El Nido has excellent souvenir shops: pearls, shell crafts, Palawan honey, local coffee.", cost_key: "shopping" },
          { time: "5:00 PM",  icon: "🚐", name: "Van to Puerto Princesa / Airport", desc: "Book ahead — vans fill up fast. 5–6 hrs to PPS, 30 min to El Nido Airport (ENI).", cost_key: "transport" }
        ]
      }
    ]
  },

  siargao: {
    name: "Siargao Island",
    province: "Surigao del Norte",
    region: "Caraga",
    tagline: "Surfing capital of the Philippines",
    description: "The Philippines' surf capital, with the legendary Cloud 9 wave, mangrove lagoons, rock pools, and a laid-back bohemian island vibe.",
    type: "island_surf",
    climate_note: "Best Jul–Nov for surfing (bigger waves). Dec–May calmer, better for island hopping.",
    tier: "mid_friendly",
    activities: {
      group:         { label: "3-Island Group Tour (Naked, Daku, Guyam)", price: 700,  desc: "Classic Siargao island hop, snorkeling included" },
      semi_private:  { label: "Surfing Lesson + Island Hop Combo", price: 2000, desc: "1.5-hr beginner surf lesson + half-day island tour" },
      private:       { label: "Private Island Tour + Magpupungko Tidal Pools", price: 3500, desc: "Private boat, all 3 islands + rock pools visit" },
      premium_package: { label: "Surf + Lagoon + Stonefish + Mangrove Day", price: 5500, desc: "Full day with surf guide, mangrove paddle, private island access" }
    }
  },

  bohol: {
    name: "Bohol (Panglao & Chocolate Hills)",
    province: "Bohol",
    region: "Central Visayas",
    tagline: "Tarsiers, rolling hills, and turquoise waters",
    description: "A wonderfully diverse island combining the unique Chocolate Hills geological formation, the world's tiniest primate (the tarsier), Spanish heritage churches, and Panglao's stunning white sand beaches.",
    type: "mixed",
    climate_note: "Best Nov–May. Dec–Feb is peak season. Jun–Oct can be rainy.",
    tier: "mid_friendly",
    activities: {
      group:         { label: "Bohol Group Land Tour (van + guide)", price: 1200, desc: "Chocolate Hills, tarsier sanctuary, Loboc River lunch, Baclayon Church" },
      semi_private:  { label: "Island Hopping + Land Tour Combo", price: 2500, desc: "Balicasag Island snorkeling + full Bohol land tour" },
      private:       { label: "Private Car Tour + Firefly Watching", price: 4000, desc: "Full-day private van tour + evening Loboc firefly river cruise" },
      premium_package: { label: "Exclusive Safari + Whale Shark + All Highlights", price: 7500, desc: "Whale shark interaction (Oslob-style alternative in Bohol), private tours" }
    },
    entrance_fees: 120,
    tips: [
      { icon: "🦥", title: "Tarsier Sanctuary — Go Official", text: "Visit the Philippine Tarsier Foundation Sanctuary in Corella, not the commercial roadside spots. No flash photography, quiet zone. ₱60 entrance. The animals' welfare matters here." },
      { icon: "⛵", title: "Panglao Island", text: "Alona Beach is the main beach hub in Panglao. Excellent snorkeling and diving (Balicasag Island). Not as crowded as Boracay but facilities have improved a lot." },
      { icon: "🚤", title: "Balicasag Island Diving", text: "One of the top dive spots in the Philippines — drop-off walls, sea turtles, and blacktip reef sharks. PADI dive packages from ₱2,000. Non-divers can snorkel from the surface." },
      { icon: "🍖", title: "Try Dugo & Lechon", text: "Bohol is famous for its lechon (roasted pig). Head to Belmont Hotel area or the local market. Kalamay (sticky rice treat wrapped in coconut shell) is the classic pasalubong." },
      { icon: "🌉", title: "Man-Made Forest", text: "A 2km stretch of towering mahogany trees on the road to Chocolate Hills. Free, atmospheric, and great for photos. Often included in van tours." },
      { icon: "🛳️", title: "Getting to Bohol", text: "Daily ferries from Cebu City to Tagbilaran (2 hrs, ₱250–₱500). Or fly direct to Bohol-Panglao International Airport from Manila (daily, ~₱1,500–₱4,000)." }
    ],
    packing: {
      essentials: ["Light layers (air-conditioned van tours)", "Walking shoes (Chocolate Hills climb)", "Sun protection", "Cash", "Camera"],
      gear: ["Snorkeling set for Panglao/Balicasag", "GoPro", "Dry bag for boat trips"],
      clothing: ["Swimwear", "Casual day clothes", "Decent outfit for churches (shoulders & knees covered)", "Light jacket"],
      health: ["Motion sickness meds (river cruise optional)", "Insect repellent", "Sunscreen", "Water bottle"]
    },
    itinerary_template: [
      {
        title: "Arrival & Panglao Beach",
        subtitle: "Ferry in, beach afternoon",
        events: [
          { time: "Morning",   icon: "⛴️", name: "Ferry from Cebu or Flight to Tagbilaran", desc: "SuperCat / OceanJet from Cebu: ₱350–₱500, 2 hrs. Tricycle to Panglao: ₱150–₱200.", cost_key: "transport" },
          { time: "Midday",    icon: "🏨", name: "Check in at Alona Beach / Tagbilaran", desc: "Alona Beach has the most accommodation choice. Budget: ₱600–800/night. Mid: ₱1,500–₱2,500. Premium: ₱5,000+" },
          { time: "2:00 PM",   icon: "🤿", name: "Afternoon Snorkeling at Panglao", desc: "Walk-in snorkeling off Alona Beach is free. Coral garden starts about 100m offshore.", cost_key: "activities" },
          { time: "7:00 PM",   icon: "🍽️", name: "Dinner at Alona Beach Road", desc: "Several good seafood restaurants along the main road. Jonah's (budget), Swiss Bamboo (mid), or restaurant at Amarela Resort (premium).", cost_key: "food" }
        ]
      },
      {
        title: "Bohol Land Tour Day",
        subtitle: "Chocolate Hills, tarsiers, river lunch",
        events: [
          { time: "7:30 AM",  icon: "🚐", name: "Depart on Bohol Land Tour", desc: "Van tour picks you up from your accommodation. First stop: Baclayon Church (oldest in Bohol).", cost_key: "activities" },
          { time: "9:00 AM",  icon: "🦥", name: "Tarsier Sanctuary Visit", desc: "Philippine Tarsier Foundation in Corella. See the world's smallest primate in near-natural habitat. ₱60 entrance. No flash photos!", cost_key: null },
          { time: "10:30 AM", icon: "🌲", name: "Man-Made Forest", desc: "Drive through the iconic 2km mahogany tree canopy — great photo stop included in most tours." },
          { time: "12:00 PM", icon: "🛶", name: "Loboc River Lunch Cruise", desc: "Floating restaurant down the Loboc River with live cultural music. Buffet included. ₱500–₱700/person.", cost_key: "food" },
          { time: "2:30 PM",  icon: "⛰️", name: "Chocolate Hills", desc: "Climb 214 steps to the observation deck in Carmen for the iconic view of 1,268 grass-covered hills.", cost_key: null },
          { time: "5:00 PM",  icon: "🏠", name: "Return to Panglao", desc: "Back to your resort for dinner and rest." }
        ]
      },
      {
        title: "Balicasag Diving & Departure",
        subtitle: "Turtles, reefs, then farewell",
        events: [
          { time: "7:00 AM",  icon: "🚤", name: "Boat to Balicasag Island", desc: "20-min pump boat from Alona Beach. Entrance fee ₱50. Snorkel the coral garden or join a guided dive.", cost_key: "activities" },
          { time: "11:00 AM", icon: "🐢", name: "Sea Turtle Watching", desc: "High chance of encountering green sea turtles in the shallow zone — just snorkel, no diving needed!" },
          { time: "12:30 PM", icon: "🍚", name: "Lunch Back at Alona Beach", desc: "Last meal in Bohol. Kalamay tasting at the market before you leave.", cost_key: "food" },
          { time: "2:00 PM",  icon: "🛍️", name: "Pasalubong Shopping", desc: "Kalamay (₱80–₱120/pack), dried fish, bamboo crafts. Tagbilaran public market has the best prices.", cost_key: "shopping" },
          { time: "4:00 PM",  icon: "⛴️", name: "Ferry back to Cebu / Flight Home", desc: "Last ferry to Cebu departs around 5–6 PM. Allow 30 min travel to port.", cost_key: "transport" }
        ]
      }
    ]
  },

  batanes: {
    name: "Batanes Islands",
    province: "Batanes",
    region: "Cagayan Valley",
    tagline: "Stone houses, rolling hills, and the tip of the Philippines",
    description: "The northernmost province of the Philippines, known for its unique Ivatan culture, iconic stone houses built to withstand typhoons, spectacular cliffs, and a peaceful, slow way of life.",
    type: "cultural_nature",
    climate_note: "Best Mar–Jun (dry, calm). Typhoon-prone Jul–Oct. Very limited flights — book months ahead.",
    tier: "premium_friendly",
    activities: {
      group:         { label: "Batan Island Group Tour (tricycle)", price: 1500, desc: "Batan, Sabtang, North Batan road tour with guide" },
      semi_private:  { label: "Sabtang Island Day Tour", price: 2500, desc: "Faluwa boat ride to Sabtang, stone village walk, Morong Beach" },
      private:       { label: "Private 2-Island Tour (Batan + Sabtang)", price: 4500, desc: "Dedicated guide, flexible pace, remote spots" },
      premium_package: { label: "Multi-Island Full Package + Itbayat", price: 9000, desc: "Exclusive 3-island tour including rarely-visited Itbayat" }
    },
    entrance_fees: 200,
    tips: [
      { icon: "✈️", title: "Book Flights Very Early", text: "PAL and Skyjet operate small ATR-72 aircraft to Basco (BSO) from Manila — extremely limited seats. Book 2–3 months ahead. Prices drop occasionally but rarely." },
      { icon: "🏠", title: "Honesty Culture", text: "Batanes is famous for its honesty shops (tindahan ng kabutihan) — unmanned stalls where you leave your payment. It's real. Respect it." },
      { icon: "🌬️", title: "Wind Can Ground Flights", text: "Batanes is typhoon-prone. Build 1–2 buffer days at the end of your trip in case of flight delays/cancellations. It happens regularly." },
      { icon: "⛵", title: "Faluwa to Sabtang", text: "The traditional wooden boat (faluwa) to Sabtang Island costs ₱200/person (roundtrip). Only runs with calm enough weather. Bring seasickness meds." },
      { icon: "🏡", title: "Stone House Homestays", text: "Some Ivatan families offer homestay in traditional stone houses. The most authentic way to experience Batanes. ₱800–₱1,500/night including breakfast." },
      { icon: "🍠", title: "Try Ivatan Food", text: "Coconut crab (tatus), uved balls (banana-pork cakes), vakul (woven leaf helmet) weaving demo, and luñis (pork preserved in fat). All unique to Batanes." }
    ],
    packing: {
      essentials: ["Windbreaker / rain jacket (wind can be intense)", "Layered clothing", "Cash (only 1 ATM on the island, often empty)", "Offline maps", "Flexible mindset for weather delays"],
      gear: ["Camera with wide-angle lens (landscape heaven)", "Trekking shoes", "Binoculars (bird watching)", "Power bank"],
      clothing: ["Warm layers (can get cold)", "Rainproof outer layer", "Comfortable walking shoes", "Light scarf"],
      health: ["Altitude meds if prone to headaches", "Motion sickness (faluwa is bumpy)", "Sunscreen", "Basic first aid"]
    },
    itinerary_template: [
      {
        title: "Arrival in Basco, Batanes",
        subtitle: "Step into the Philippines' most unique province",
        events: [
          { time: "Morning",   icon: "✈️", name: "Fly Manila → Basco (BSO)", desc: "1-hr flight, scenic views of the island chain from the air. Transfer to town by tricycle.", cost_key: "transport" },
          { time: "Midday",    icon: "🏠", name: "Check-in & Orientation", desc: "Settle in at your stone house homestay or guesthouse. Get oriented by your host/guide." },
          { time: "2:00 PM",   icon: "🚜", name: "Batan North Road Tour", desc: "Marlboro Country, Batan Hills, Naidi Hills Lighthouse, Cape San Agustin. Iconic rolling hills and cliff views.", cost_key: "activities" },
          { time: "6:00 PM",   icon: "🌊", name: "Valugan Boulder Beach", desc: "Beach made entirely of giant boulders, waves crashing — dramatic and free. Near Basco." },
          { time: "7:30 PM",   icon: "🍽️", name: "Dinner — Ivatan Cuisine", desc: "Ask your guesthouse host to prepare traditional Ivatan food. Otherwise try Pension Ivatan restaurant.", cost_key: "food" }
        ]
      },
      {
        title: "Sabtang Island Day",
        subtitle: "Traditional villages and windswept shores",
        events: [
          { time: "6:00 AM",  icon: "⛵", name: "Faluwa Ride to Sabtang", desc: "30-min traditional wooden boat ride across choppy waters. ₱200 roundtrip. Leaves when calm enough.", cost_key: "activities" },
          { time: "7:00 AM",  icon: "🏡", name: "Chavayan and Savidug Stone Villages", desc: "UNESCO-protected Ivatan stone house villages. Walk through centuries-old lanes, meet local weavers." },
          { time: "10:00 AM", icon: "🏖️", name: "Morong Beach (Tayid Lighthouse)", desc: "Crescent beach below a dramatic cliff with a white lighthouse — one of the most photographed spots in PH." },
          { time: "12:30 PM", icon: "🍲", name: "Lunch at Sabtang", desc: "Simple but hearty Ivatan meal at a local eatery on the island.", cost_key: "food" },
          { time: "3:00 PM",  icon: "⛵", name: "Faluwa Back to Basco", desc: "Return ride to Batan Island before weather changes." },
          { time: "6:00 PM",  icon: "🌅", name: "Racuh a Payaman (Marlboro Country)", desc: "Rolling grass hills at golden hour — like Scotland transported to Southeast Asia. Free." }
        ]
      },
      {
        title: "Batan South + Departure",
        subtitle: "Final views, then fly home",
        events: [
          { time: "7:00 AM",  icon: "🌄", name: "Batan South Road Tour", desc: "San Carlos Borromeo Church, Songsong Ruins, Mahatao Boat Shelter, Chanarian Cliffs.", cost_key: "activities" },
          { time: "10:00 AM", icon: "🧶", name: "Vakul Weaving Demo", desc: "Watch Ivatan women weave the iconic leaf helmets at the Basco Cultural Center." },
          { time: "11:00 AM", icon: "🛍️", name: "Pasalubong: Vunung Wine & Uved Balls", desc: "Buy Batanes wine (made from sugarcane), woven crafts, and jarred luñis at the market.", cost_key: "shopping" },
          { time: "1:00 PM",  icon: "✈️", name: "Depart from Basco Airport", desc: "Allow extra time — small airport, but always confirm your flight the night before (weather cancellations common).", cost_key: "transport" }
        ]
      }
    ]
  },

  calaguas: {
    name: "Calaguas Islands",
    province: "Camarines Norte",
    region: "Bicol",
    tagline: "Virgin white sand beaches and untouched coves",
    description: "A cluster of virtually undeveloped islands in Camarines Norte. Mahabang Buhangin (Long Sand Beach) is one of the most pristine stretches of white sand in Luzon — no electricity, no resorts, pure nature.",
    type: "island_primitive",
    climate_note: "Best Nov–May. Closed during typhoon season (Jun–Oct).",
    tier: "budget_friendly",
    activities: {
      group:         { label: "Group Bangka Island Tour", price: 600,  desc: "Shared boat, snorkeling stops" },
      semi_private:  { label: "Semi-Private Overnight Package", price: 1500, desc: "Tent camping on the beach, shared boat, meals" },
      private:       { label: "Private Bangka + Camping Setup", price: 3000, desc: "Dedicated boat, porter service, campsite setup" },
      premium_package: { label: "Glamping Package + Chef Service", price: 5500, desc: "Glamping tents, private cook, full day boat access" }
    },
    entrance_fees: 100,
    tips: [
      { icon: "⚡", title: "No Electricity", text: "Calaguas has no power grid. Bring multiple power banks, solar charger, and battery-powered lights. Your phone will be your only camera — charge it fully before leaving." },
      { icon: "🍚", title: "Bring Your Own Food", text: "There are no restaurants. Bring all food (canned goods, instant noodles, bread, fruits). Calaguas travel organizers usually handle food for package tours." },
      { icon: "💧", title: "Water is Scarce", text: "Bring at least 3–4 liters per person per day. There's a communal well on the island but water should be treated before drinking." },
      { icon: "🚤", title: "Getting There", text: "Most boats depart from Capalonga Port or Vinzons in Camarines Norte. From Naga: 2.5 hrs by bus to Daet, then 1 hr to port. Boat ride: 1.5–2 hrs each way." },
      { icon: "🌊", title: "Best Beach in Luzon?", text: "Mahabang Buhangin (Long Sand Beach) is consistently rated among the top virgin beaches in Luzon. The sand is so fine it squeaks when you walk on it." },
      { icon: "♻️", title: "Leave No Trace", text: "Calaguas is pristine because of strict BYOB (bring your own bag) and no-trash policies. All your garbage must leave the island with you. Follow the rules — the island depends on it." }
    ],
    packing: {
      essentials: ["All food & water for duration", "Power banks (multiple)", "Battery lanterns/headlamp", "Trash bag (pack out everything)", "Tent or book package with tent"],
      gear: ["Sleeping bag or blanket", "Snorkel set", "Waterproof bag for electronics", "Rope/clothesline", "Lighter / fire starter"],
      clothing: ["Quick-dry clothes", "Comfortable beach wear", "Extra dry set sealed in ziplock", "Flip-flops + water shoes"],
      health: ["Insect repellent (plenty of sand flies at dusk)", "First aid kit", "Oral rehydration salts", "Sunscreen × 2", "Seasickness meds"]
    },
    itinerary_template: [
      {
        title: "Journey to Calaguas",
        subtitle: "The adventure begins at the port",
        events: [
          { time: "5:00 AM",  icon: "🚌", name: "Depart for Capalonga / Vinzons Port", desc: "Early morning bus from Naga or Daet to Capalonga (2–3 hrs). Or join a packaged Calaguas tour that handles transport.", cost_key: "transport" },
          { time: "9:00 AM",  icon: "🚤", name: "Bangka Ride to Calaguas", desc: "1.5–2 hour boat ride through open sea. Can be rough — take sea sickness meds 30 min beforehand.", cost_key: "activities" },
          { time: "11:00 AM", icon: "🏖️", name: "Arrive at Mahabang Buhangin", desc: "Set up camp, explore the beach, swim in the crystal clear water. No check-in process — this is all yours." },
          { time: "1:00 PM",  icon: "🍱", name: "Lunch at Camp", desc: "Cook your own or have your tour organizer prepare. Typical: canned sardines, corned beef, rice. BBQ if you brought coals.", cost_key: "food" },
          { time: "4:00 PM",  icon: "🤿", name: "Snorkeling around Calaguas", desc: "The reef around the island is unspoiled. Bring your own snorkel or share from the group." },
          { time: "7:00 PM",  icon: "🔥", name: "Bonfire & Stargazing", desc: "Zero light pollution = stunning stars. This is why people come to Calaguas. Bring an acoustic guitar if you have one.", cost_key: null }
        ]
      },
      {
        title: "Full Calaguas Day",
        subtitle: "Just beach, sea, and nothing else",
        events: [
          { time: "5:30 AM",  icon: "🌅", name: "Sunrise on the Beach", desc: "Wake up early — you're sleeping 5 meters from the shore. The sunrise here is extraordinary." },
          { time: "8:00 AM",  icon: "🍳", name: "Camp Breakfast", desc: "Hot coffee from a camping stove, instant oatmeal or pandesal. Simple but perfect.", cost_key: "food" },
          { time: "9:30 AM",  icon: "🚤", name: "Inter-Island Hopping", desc: "Boat to neighboring coves: Tinaga Island, Quinapaguian Island, and hidden sandbars.", cost_key: "activities" },
          { time: "12:00 PM", icon: "🐟", name: "Fresh Fish Lunch", desc: "Boatmen often bring freshly caught fish. Grill it on the beach — doesn't get fresher than this.", cost_key: "food" },
          { time: "3:00 PM",  icon: "😴", name: "Hammock Time", desc: "Rest, read, swim, sleep on the beach. You've earned it." },
          { time: "7:30 PM",  icon: "🌌", name: "Night Sky Show", desc: "The Milky Way is clearly visible from Calaguas on a clear night. Bring a tripod if you want night sky photos." }
        ]
      },
      {
        title: "Departure Day",
        subtitle: "Back to civilization",
        events: [
          { time: "7:00 AM",  icon: "🏕️", name: "Break Camp", desc: "Pack everything. Double-check that all trash is collected and bagged to bring back to the mainland." },
          { time: "8:30 AM",  icon: "🚤", name: "Boat Back to Port", desc: "Return bangka ride to Capalonga / Vinzons port." },
          { time: "10:30 AM", icon: "🏘️", name: "Arrive on Mainland", desc: "Freshen up at the port area if possible. Stock up on food and water." },
          { time: "11:00 AM", icon: "🚌", name: "Bus Back to Origin City", desc: "Catch a bus back to Naga, Daet, or Manila. Long but worth it.", cost_key: "transport" }
        ]
      }
    ]
  },

  sagada: {
    name: "Sagada",
    province: "Mountain Province",
    region: "Cordillera (CAR)",
    tagline: "Hanging coffins, mist, and mountain serenity",
    description: "A cool highland town in the Cordillera mountains, famous for its hanging coffins, spectacular Echo Valley, coffee culture, weaving traditions, and unforgettable Kiltepan sunrise.",
    type: "cultural_highland",
    climate_note: "Best Feb–May (cool and clear). Dec–Jan coldest (4–10°C at night). Jun–Oct rainy.",
    tier: "budget_friendly",
    activities: {
      group:         { label: "Sagada Group Walking Tour", price: 800,  desc: "Hanging Coffins, Echo Valley, Lumiang-Sumaguing Cave connection (guide required)" },
      semi_private:  { label: "Small Group Cave + Heritage Tour", price: 1500, desc: "Sumaguing Cave spelunking + Hanging Coffins + Kiltepan sunrise" },
      private:       { label: "Private Guide Full Day Tour", price: 2500, desc: "All highlights, flexible pace, deep cave connection included" },
      premium_package: { label: "Exclusive Experience + Lake Danum + Crafts", price: 4000, desc: "All sites, weaving workshop, and highland lake day trip" }
    },
    entrance_fees: 50,
    tips: [
      { icon: "🧊", title: "Bring Warm Clothes", text: "Sagada is cold — especially at night and before sunrise. Temperatures can drop to 8°C in December. Layer up: thermal wear, fleece, windbreaker, warm socks." },
      { icon: "🌄", title: "Kiltepan Sunrise", text: "Wake up at 4:30 AM and trek 30 min to Kiltepan viewpoint. On clear mornings, the sea of clouds below is one of the most spectacular sights in the Philippines." },
      { icon: "⛏️", title: "Cave Tours are Mandatory with a Guide", text: "By local ordinance, all cave tours must have an accredited Sagada guide. Don't skip this — it supports the community and keeps you safe. Register at the Tourism Office." },
      { icon: "☕", title: "Sagada Coffee", text: "The area grows its own Arabica coffee. Try it at Yogurt House (a local institution), Log Cabin, or Salt and Pepper Diner. Also try the famous Yogurt House strawberry yogurt." },
      { icon: "🚌", title: "Getting to Sagada", text: "No airport — bus journey from Manila (Dangwa terminal) is 9–10 hours. From Baguio: 5–6 hours by bus. Arrange accommodation ahead — Sagada has limited rooms during peak." },
      { icon: "📿", title: "Respect Kankana-ey Culture", text: "Sagada is deeply tied to indigenous Kankana-ey traditions. The hanging coffins and burial caves are sacred — behave respectfully, stay on designated paths, and do not touch anything." }
    ],
    packing: {
      essentials: ["Heavy jacket / fleece", "Thermal underwear", "Warm socks and boots", "Headlamp (cave tour)", "Cash (limited ATMs in town)"],
      gear: ["Trekking shoes (essential)", "Camera with low-light capability (cave, sunrise)", "Waterproof jacket", "Gloves and beanie"],
      clothing: ["Multiple warm layers", "Quick-dry base layers", "Rain-proof outer shell", "Extra dry clothes in sealed bag"],
      health: ["Altitude medicine (for sensitive travelers)", "Knee support (steep treks)", "Lip balm & moisturizer (dry air)", "First aid kit"]
    },
    itinerary_template: [
      {
        title: "Arrival in Sagada",
        subtitle: "Long journey, big reward",
        events: [
          { time: "Overnight",icon: "🚌", name: "Overnight Bus to Bontoc / Sagada", desc: "Buses from Manila (Dangwa) depart nightly ~8–10 PM. Arrive in Sagada by morning. From Baguio: morning buses available.", cost_key: "transport" },
          { time: "Morning",  icon: "🏘️", name: "Arrive & Register at Tourism Office", desc: "All visitors must register and get an Environmental Fee receipt. Required for all activities." },
          { time: "10:00 AM", icon: "🥣", name: "Breakfast / Brunch in Town", desc: "Yogurt House opens at 7 AM — get their famous yogurt, toasted bread, and hot Sagada coffee.", cost_key: "food" },
          { time: "11:00 AM", icon: "💀", name: "Hanging Coffins Tour", desc: "Short 20-min walk to Echo Valley and the cliff-hanging coffins of the Kankana-ey. Guide required (₱500 for the group).", cost_key: "activities" },
          { time: "2:00 PM",  icon: "🏡", name: "Check In & Settle", desc: "Most guesthouses are within walking distance of town center." },
          { time: "7:00 PM",  icon: "🍲", name: "Dinner", desc: "Salt and Pepper Diner (Filipino comfort food), Log Cabin (western), or Sagada Cellar Door (craft beer + pinakbet).", cost_key: "food" }
        ]
      },
      {
        title: "Cave Connection + Kiltepan",
        subtitle: "Underground adventure & morning clouds",
        events: [
          { time: "4:30 AM",  icon: "🌅", name: "Kiltepan Sunrise Trek", desc: "30-min uphill walk in the dark. Dress warmly. On a clear day: sea of clouds, Cordillera peaks. On a cloudy day: mystical fog. Both are beautiful." },
          { time: "8:00 AM",  icon: "☕", name: "Breakfast Back in Town", desc: "Hot champorado or lugaw at a local carinderia. Warm up before the cave.", cost_key: "food" },
          { time: "9:30 AM",  icon: "⛏️", name: "Sumaguing Cave Spelunking", desc: "2-hour cave tour with certified guide. Expect tight passages, underground rivers, and dramatic stalactites. Wear clothes you don't mind getting dirty/wet.", cost_key: "activities" },
          { time: "12:30 PM", icon: "🚿", name: "Cleanup & Lunch", desc: "You'll need a full shower after the cave. Then lunch — Yogurt House salad or noodle soup.", cost_key: "food" },
          { time: "3:00 PM",  icon: "🧶", name: "Sagada Weaving Visit", text: "Watch traditional backstrap loom weaving at Sagada Weaving. Textiles are unique to the Cordillera region.", cost_key: null },
          { time: "7:30 PM",  icon: "🍺", name: "Evening at Sagada Cellar Door", desc: "Craft beers brewed locally, bonfire on cold nights, good company. A Sagada institution.", cost_key: "food" }
        ]
      },
      {
        title: "Waterfall & Departure",
        subtitle: "Last nature fix, then the long road home",
        events: [
          { time: "7:00 AM",  icon: "🌊", name: "Bomod-ok Falls Trek", desc: "2-hour roundtrip trek through rice terraces to the 200ft Bomod-ok (Big) Falls. One of the most beautiful in CAR. Guide required.", cost_key: "activities" },
          { time: "10:30 AM", icon: "🛍️", name: "Pasalubong Shopping", desc: "Sagada coffee, woven textiles, sweet potato wine, woodcarvings at local shops.", cost_key: "shopping" },
          { time: "12:00 PM", icon: "🚌", name: "Bus Departs for Baguio / Manila", desc: "Last bus to Baguio around 1–2 PM. From Baguio connect to Manila. Total: 9–10 hrs Manila, 5 hrs Baguio.", cost_key: "transport" }
        ]
      }
    ]
  },

  camiguin: {
    name: "Camiguin Island",
    province: "Camiguin",
    region: "Northern Mindanao",
    tagline: "More volcanoes than towns — nature's island laboratory",
    description: "Tiny Camiguin holds 7 volcanoes, natural hot and cold springs, a sunken cemetery, white island sandbar, and waterfalls — all in an island smaller than Singapore.",
    type: "nature_mixed",
    climate_note: "Best Jan–May. Oct–Dec can be rainy. The Lanzones Festival is held every October.",
    tier: "mid_friendly",
    activities: {
      group:         { label: "Group Island Circuit Tour (tricycle)", price: 1200, desc: "Sunken Cemetery, White Island, Mantigue Island, springs & falls" },
      semi_private:  { label: "Private Tricycle Full Island Tour", price: 2000, desc: "Your own trike and driver for the day, full island circuit" },
      private:       { label: "Private Boat + All Highlights", price: 3500, desc: "White Island sunrise, Mantigue snorkeling, island circuit" },
      premium_package: { label: "Volcano Trek + All Islands + Diving", price: 6000, desc: "Mt. Hibok-Hibok guided climb + all islands + PADI dive" }
    },
    entrance_fees: 100,
    tips: [
      { icon: "⛪", title: "Sunken Cemetery", text: "A fascinating spot where a cross stands in the sea, marking a cemetery submerged after volcanic activity. Best viewed from a glass-bottom boat (₱150 for a short tour)." },
      { icon: "🏝️", title: "White Island", text: "A pure white sandbar 10–15 min by bangka from Agoho port. No trees — come early or bring an umbrella. Go at low tide for the widest sandbar." },
      { icon: "🌊", title: "Hot and Cold Springs", text: "Sto. Niño Cold Spring is a natural mountain spring pool (₱50 entry). Ardent Hot Springs is volcanic (₱100). Do both on the same day — the contrast is wild." },
      { icon: "🍋", title: "Lanzones Capital", text: "Camiguin produces the sweetest lanzones in the Philippines. Visit October during the Lanzones Festival — free fruit sampling everywhere!" },
      { icon: "✈️", title: "Getting to Camiguin", text: "Fly to Cebu or Cagayan de Oro, then ferry to Camiguin. From CdO: 2-hr bus to Balingoan port + 1-hr ferry (₱250). Or fly direct from Cebu (Cebu Pacific, irregular schedule)." },
      { icon: "🌋", title: "Hike Hibok-Hibok Volcano", text: "Active stratovolcano. Day hike with PHIVOLCS-registered guide is required. ₱2,000+ for guide. 6–8 hrs roundtrip. Do NOT attempt without a guide or during bad weather." }
    ],
    packing: {
      essentials: ["Trekking shoes", "Swimming gear (multiple pools and beaches)", "Cash", "Offline maps", "Insect repellent"],
      gear: ["Waterproof bag", "Snorkel set (for Mantigue Island)", "Towel", "Change of clothes × 3"],
      clothing: ["Swimwear", "Light shorts and shirts", "Rain jacket (tropical showers common)", "Flip-flops + trekking sandals"],
      health: ["Sunscreen", "Hot spring lotion/moisturizer (sulfur can dry skin)", "Motion sickness (bumpy ferry)", "Energy bars for volcano hike"]
    },
    itinerary_template: [
      {
        title: "Arrival & Hot Springs",
        subtitle: "Soak in volcanic waters",
        events: [
          { time: "Morning",   icon: "⛴️", name: "Ferry to Camiguin from Balingoan", desc: "1-hour ferry from Balingoan port, Misamis Oriental. Roll-on ferries are cheap and frequent.", cost_key: "transport" },
          { time: "Midday",    icon: "🏨", name: "Check In at Mambajao / Agoho", desc: "Most accommodation is along the northern coast. Agoho area has beachfront resorts." },
          { time: "2:00 PM",   icon: "🌡️", name: "Ardent Hot Springs", desc: "Natural volcanic hot springs set in the jungle. ₱100 entrance. Relax in warm thermal pools with a cold drink.", cost_key: "activities" },
          { time: "5:00 PM",   icon: "❄️", name: "Sto. Niño Cold Spring", desc: "Cool off in a mountain freshwater pool. Crystal clear, beautifully cold after the hot springs.", cost_key: "activities" },
          { time: "7:30 PM",   icon: "🦞", name: "Dinner at Mambajao Market", desc: "Fresh curacha (spanner crab), kinilaw, and grilled fish at the public market area.", cost_key: "food" }
        ]
      },
      {
        title: "Island Circuit Day",
        subtitle: "Sunken cemetery, waterfalls, and the white sandbar",
        events: [
          { time: "6:00 AM",  icon: "🏝️", name: "White Island at Sunrise", desc: "Take the early bangka to White Island before the crowds. ₱100 boat + ₱50 entrance. The low-tide sandbar at sunrise is magical.", cost_key: "activities" },
          { time: "9:00 AM",  icon: "⛵", name: "Sunken Cemetery Tour", desc: "Glass-bottom boat tour over the submerged graveyard. The cross stands tall and eerie in the clear water.", cost_key: "activities" },
          { time: "11:00 AM", icon: "💦", name: "Katibawasan Falls", desc: "75m waterfall crashing into a cold pool. 1-hour drive from the port. ₱20 entrance, swim at the base.", cost_key: "activities" },
          { time: "1:00 PM",  icon: "🍚", name: "Lunch", desc: "Trike driver usually knows a good local eatery on the circuit.", cost_key: "food" },
          { time: "3:00 PM",  icon: "🤿", name: "Mantigue Island Snorkeling", desc: "20-min bangka from Mahinog port. Marine sanctuary with sea turtles and colorful reefs. ₱100 entrance.", cost_key: "activities" }
        ]
      },
      {
        title: "Waterfalls & Departure",
        subtitle: "Last swim, then catch the ferry",
        events: [
          { time: "8:00 AM",  icon: "💦", name: "Tuasan Falls", desc: "Small, beautiful twin waterfall with natural pools. Less visited than Katibawasan, more secluded.", cost_key: "activities" },
          { time: "10:00 AM", icon: "🛍️", name: "Pasalubong: Lanzones & Coffee", desc: "Camiguin lanzones (if in season), tablea (native chocolate), and coffee are the best buys.", cost_key: "shopping" },
          { time: "11:00 AM", icon: "⛴️", name: "Ferry Back to Balingoan", desc: "Afternoon ferries run regularly. 1-hr crossing back to mainland.", cost_key: "transport" }
        ]
      }
    ]
  },

  puerto_galera: {
    name: "Puerto Galera",
    province: "Oriental Mindoro",
    region: "MIMAROPA",
    tagline: "Sapphire waters and dive paradise near Manila",
    description: "The closest island getaway from Manila — just 2–3 hours away. Puerto Galera's Sabang, White Beach, and Talipanan offer diverse experiences from diving to backpacking to family resorts.",
    type: "island_accessible",
    climate_note: "Best Nov–May. Year-round accessible but rougher seas Jun–Oct.",
    tier: "mid_friendly",
    activities: {
      group:         { label: "Group Snorkeling Tour + Island Hop", price: 900,  desc: "Coral garden, Shark Cave, Canyons — group banana boat share" },
      semi_private:  { label: "PADI Discover Scuba + Snorkel Package", price: 2800, desc: "Try scuba dive at coral gardens + island hopping" },
      private:       { label: "Private Banca Island Tour", price: 3200, desc: "Dedicated boat for your group, flexible stops" },
      premium_package: { label: "Full PADI Certification Course Package", price: 12000, desc: "3-day Open Water PADI certification at reputable dive shop" }
    },
    entrance_fees: 100,
    tips: [
      { icon: "🚌", title: "Manila to Puerto Galera", text: "From Manila, take a bus from Cubao/Buendia to Batangas Port (2–2.5 hrs). Then RORO or outrigger ferry to Sabang/Puerto Galera (~1.5 hrs). Total: ~4 hrs from Makati." },
      { icon: "🤿", title: "Best Dive Site Variety", text: "Puerto Galera has 40+ dive sites including the famous Canyons, Shark Cave, Batangas Channel, and Verde Island Passage. Verde Island has one of the highest marine biodiversities on Earth." },
      { icon: "🌊", title: "Sabang vs White Beach vs Talipanan", text: "Sabang = backpackers, bars, dive shops. White Beach = families, resorts, calmer. Talipanan = secluded, quiet, nature. Pick based on your vibe." },
      { icon: "💸", title: "Bargain on Beach Chairs", text: "Most beach resorts charge a corkage or minimum consumption to use their facilities. Walk the beach comparing rates — some offer free chairs with a meal or drink order." },
      { icon: "🌙", title: "Sabang Nightlife", text: "Sabang Beach has a surprisingly lively bar scene for a small island town. Small Disco, Eddie's Place, and bars on the main strip." },
      { icon: "🐟", title: "Verde Island Passage", text: "Listed as the 'Amazon of the Oceans' — the center of the world's marine biodiversity. Day trips available from Puerto Galera dive shops. Worth every peso." }
    ],
    packing: {
      essentials: ["Motion sickness meds (boat crossing can be rough)", "Reef-safe sunscreen", "Cash (limited ATMs)", "Waterproof bag", "Towel"],
      gear: ["Personal diving/snorkeling equipment if you have it", "Underwater camera", "Light trekking shoes", "Dry bag"],
      clothing: ["Swimwear × 3", "Light casual evening wear", "Rash guard", "Flip-flops"],
      health: ["Anti-seasickness medication", "Ear drops (for divers)", "Sunscreen SPF 50+", "After-sun lotion"]
    },
    itinerary_template: [
      {
        title: "Manila → Puerto Galera",
        subtitle: "A quick escape from the metro",
        events: [
          { time: "6:00 AM",  icon: "🚌", name: "Bus from Manila to Batangas Port", desc: "Jam Liner / Ceres from Buendia/Cubao to Batangas Grand Terminal. ~2 hrs.", cost_key: "transport" },
          { time: "9:00 AM",  icon: "⛴️", name: "Ferry to Puerto Galera (Sabang)", desc: "Outrigger bangka to Sabang (~1.5 hrs) or RORO to Calapan then van to PG. Book the Sabang route for convenience.", cost_key: "transport" },
          { time: "11:00 AM", icon: "🏨", name: "Check In at Sabang or White Beach", desc: "Budget: Badladz Beach Resort, El Galleon. Mid: Coco Beach. Premium: Camp Netanya." },
          { time: "12:30 PM", icon: "🍜", name: "Lunch at Sabang", desc: "Many options: Filipino, Korean, Western. Try Nick & Ari's for Filipino, or Café del Sol.", cost_key: "food" },
          { time: "3:00 PM",  icon: "🤿", name: "Afternoon Snorkel or Dive", desc: "Sabang's coral garden is a short swim from shore. Dive shops offer single dive packages from ₱1,200.", cost_key: "activities" },
          { time: "7:30 PM",  icon: "🍺", name: "Dinner & Drinks at Sabang", desc: "Seafood BBQ on the beach then a beer or cocktail at Eddie's Place or Small Disco.", cost_key: "food" }
        ]
      },
      {
        title: "Scuba & Island Hopping",
        subtitle: "Go deep and go wide",
        events: [
          { time: "7:30 AM",  icon: "🤿", name: "Morning Dive / Discover Scuba", desc: "Early morning is best for diving — calmer water, more fish activity. Choose from Canyons, Shark Cave, or Manuel's Deep Reef.", cost_key: "activities" },
          { time: "11:00 AM", icon: "🚤", name: "Private Banca Island Hop", desc: "Head to Minolo Cove, Coral Garden, and the Lagoon. Ask your boat operator for snorkeling spots.", cost_key: "activities" },
          { time: "1:00 PM",  icon: "🏖️", name: "Talipanan Beach for Lunch", desc: "Take the trike to Talipanan (₱100 from Sabang) — quieter, less crowded. Great for a beach barbecue." , cost_key: "food" },
          { time: "4:00 PM",  icon: "🌅", name: "Sunset at White Beach", desc: "White Beach has a beautiful wide sunset view. Walk the shore, grab a cold drink from a beach bar.", cost_key: null },
          { time: "7:00 PM",  icon: "🦐", name: "Seafood Dinner", desc: "Night market at White Beach has fresh catch at good prices. Or try Tambucho Cafe for fusion.", cost_key: "food" }
        ]
      },
      {
        title: "Last Dive & Head Back",
        subtitle: "One more underwater peek, then Manila",
        events: [
          { time: "7:00 AM",  icon: "🌊", name: "Dawn Snorkel or Fun Dive", desc: "Take advantage of the morning calm for one last underwater session.", cost_key: "activities" },
          { time: "9:30 AM",  icon: "🛍️", name: "Pasalubong Shopping", desc: "Shell crafts, Mindoro honey, and woven items at the Sabang market.", cost_key: "shopping" },
          { time: "11:00 AM", icon: "⛴️", name: "Ferry Back to Batangas", desc: "Ferries run regularly. Last trip usually around 5–6 PM but go earlier to avoid afternoon chop.", cost_key: "transport" },
          { time: "1:30 PM",  icon: "🚌", name: "Bus Back to Manila", desc: "Jam Liner / Ceres from Batangas Grand Terminal to Manila. 2–2.5 hrs.", cost_key: "transport" }
        ]
      }
    ]
  }
};

// ============================================================
// TRANSPORT COSTS
// origin → destination, by transport mode (per person, round trip)
// Note: Many routes require combinations; these are realistic totals
// ============================================================
const TRANSPORT = {
  // From Manila
  manila: {
    caramoan:    { bus_van: 900,  budget_airline: 2800, full_airline: 4500, private_car: 7000, boat_ferry: null, note: "Bus to Naga (~8hr) + Van to Caramoan (~2.5hr)" },
    calaguas:    { bus_van: 800,  budget_airline: null,  full_airline: null, private_car: 6000, boat_ferry: 600,  note: "Bus to Daet + van to port + bangka" },
    boracay:     { bus_van: null, budget_airline: 3200, full_airline: 5500, private_car: null, boat_ferry: null, note: "Fly to Caticlan (MPH-MPH) or Kalibo + van" },
    palawan:     { bus_van: null, budget_airline: 3500, full_airline: 6000, private_car: null, boat_ferry: null, note: "Fly to Puerto Princesa (PPS) or El Nido (ENI)" },
    siargao:     { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly to Sayak Airport (IAO)" },
    bohol:       { bus_van: null, budget_airline: 3800, full_airline: 5800, private_car: null, boat_ferry: 1200, note: "Fly to BPH or ferry via Cebu" },
    batanes:     { bus_van: null, budget_airline: 9000, full_airline: 14000,private_car: null, boat_ferry: null, note: "Fly to Basco (BSO) — limited seats, book early" },
    sagada:      { bus_van: 1200, budget_airline: null,  full_airline: null, private_car: 5000, boat_ferry: null, note: "Overnight bus from Cubao/Dangwa (~10hrs)" },
    camiguin:    { bus_van: null, budget_airline: 4200, full_airline: 6500, private_car: null, boat_ferry: null, note: "Fly to Cebu or CdO + bus + ferry to Camiguin" },
    puerto_galera:{ bus_van: 700, budget_airline: null, full_airline: null, private_car: 4500, boat_ferry: 700,  note: "Bus to Batangas + ferry (total ~4hrs)" },
    cebu_kawasan:{ bus_van: null, budget_airline: 3200, full_airline: 5000, private_car: null, boat_ferry: null, note: "Fly to Cebu then habal-habal" },
    davao_samal: { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly to Davao then ferry to Samal" },
    bataan_corregidor: { bus_van: 500, budget_airline: null, full_airline: null, private_car: 3000, boat_ferry: 500, note: "Bus to Bataan + ferry to Corregidor" },
    zamboanga_great_santa_cruz: { bus_van: null, budget_airline: 5500, full_airline: 8000, private_car: null, boat_ferry: null, note: "Fly to Zamboanga then boat" }
  },

  // From Naga City
  naga: {
    caramoan:    { bus_van: 360,  budget_airline: null,  full_airline: null, private_car: 2000, boat_ferry: null, note: "RHK Van from Naga to Caramoan: ~2.5hrs (₱180/way)" },
    calaguas:    { bus_van: 650,  budget_airline: null,  full_airline: null, private_car: 3500, boat_ferry: 600,  note: "Bus Naga→Daet + Van to port + bangka" },
    boracay:     { bus_van: null, budget_airline: 5200, full_airline: 8000, private_car: null, boat_ferry: null, note: "Bus to Manila or fly Manila→Caticlan. No direct flight from Naga." },
    palawan:     { bus_van: null, budget_airline: 6500, full_airline: 9500, private_car: null, boat_ferry: null, note: "Bus/fly to Manila then connect to PPS/ENI" },
    siargao:     { bus_van: null, budget_airline: 6800, full_airline: 10000,private_car: null, boat_ferry: null, note: "Via Manila connecting flight" },
    bohol:       { bus_van: null, budget_airline: 6000, full_airline: 9000, private_car: null, boat_ferry: null, note: "Via Manila to Tagbilaran or Cebu-Tagbilaran ferry" },
    batanes:     { bus_van: null, budget_airline: 12000,full_airline: 17000,private_car: null, boat_ferry: null, note: "Via Manila — Naga→Manila→Basco. Very expensive from Naga." },
    sagada:      { bus_van: 1800, budget_airline: null,  full_airline: null, private_car: 8000, boat_ferry: null, note: "Bus Naga→Manila then Dangwa→Sagada overnight bus. ~16 hrs total." },
    camiguin:    { bus_van: null, budget_airline: 7000, full_airline: 10500,private_car: null, boat_ferry: null, note: "Via Manila or Cebu then CdO + ferry" },
    puerto_galera:{ bus_van: 1500,budget_airline: null, full_airline: null, private_car: 7000, boat_ferry: 700,  note: "Bus Naga→Manila then Batangas ferry (~10hrs total)" },
    cebu_kawasan:{ bus_van: null, budget_airline: 5800, full_airline: 8500, private_car: null, boat_ferry: null, note: "Via Manila or direct Naga→Cebu (seasonal)" },
    davao_samal: { bus_van: null, budget_airline: 7500, full_airline: 11000,private_car: null, boat_ferry: null, note: "Via Manila→Davao" },
    bataan_corregidor: { bus_van: 1200, budget_airline: null, full_airline: null, private_car: 5500, boat_ferry: 500, note: "Bus Naga→Manila→Bataan (~8hrs)" },
    zamboanga_great_santa_cruz: { bus_van: null, budget_airline: 8000, full_airline: 12000, private_car: null, boat_ferry: null, note: "Via Manila or Cebu" }
  },

  // From Legazpi
  legazpi: {
    caramoan:    { bus_van: 600,  budget_airline: null,  full_airline: null, private_car: 3000, boat_ferry: null, note: "Legazpi→Naga→Caramoan van (~4hrs total)" },
    calaguas:    { bus_van: 900,  budget_airline: null,  full_airline: null, private_car: 4500, boat_ferry: 600,  note: "Via Daet then port" },
    boracay:     { bus_van: null, budget_airline: 4800, full_airline: 7500, private_car: null, boat_ferry: null, note: "Fly Legazpi→Manila→Caticlan (layover in Manila)" },
    palawan:     { bus_van: null, budget_airline: 6000, full_airline: 9000, private_car: null, boat_ferry: null, note: "Via Manila connecting" },
    siargao:     { bus_van: null, budget_airline: 6500, full_airline: 9500, private_car: null, boat_ferry: null, note: "Via Manila" },
    bohol:       { bus_van: null, budget_airline: 5800, full_airline: 8500, private_car: null, boat_ferry: null, note: "Via Manila or Cebu" },
    batanes:     { bus_van: null, budget_airline: 11500,full_airline: 16500,private_car: null, boat_ferry: null, note: "Via Manila" },
    sagada:      { bus_van: 2000, budget_airline: null,  full_airline: null, private_car: 9000, boat_ferry: null, note: "Long overland via Manila→Baguio/Bontoc" },
    camiguin:    { bus_van: null, budget_airline: 6800, full_airline: 10000,private_car: null, boat_ferry: null, note: "Via Manila" },
    puerto_galera:{ bus_van: 2000,budget_airline: null, full_airline: null, private_car: 8000, boat_ferry: 700,  note: "Bus Legazpi→Manila then Batangas" },
    cebu_kawasan:{ bus_van: null, budget_airline: 5500, full_airline: 8000, private_car: null, boat_ferry: null, note: "Legazpi→Manila→Cebu" },
    davao_samal: { bus_van: null, budget_airline: 7200, full_airline: 10500,private_car: null, boat_ferry: null, note: "Via Manila" },
    bataan_corregidor: { bus_van: 1500, budget_airline: null, full_airline: null, private_car: 6000, boat_ferry: 500, note: "Bus to Manila then Bataan" },
    zamboanga_great_santa_cruz: { bus_van: null, budget_airline: 7500, full_airline: 11500, private_car: null, boat_ferry: null, note: "Via Manila" }
  },

  // From Cebu
  cebu: {
    caramoan:    { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly Cebu→Manila→Naga then van" },
    calaguas:    { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Via Manila" },
    boracay:     { bus_van: null, budget_airline: 3000, full_airline: 5000, private_car: null, boat_ferry: null, note: "Fly Cebu→Caticlan or ferry via Iloilo" },
    palawan:     { bus_van: null, budget_airline: 3500, full_airline: 5500, private_car: null, boat_ferry: null, note: "Fly Cebu→Puerto Princesa (direct Cebu Pacific)" },
    siargao:     { bus_van: null, budget_airline: 3200, full_airline: 5000, private_car: null, boat_ferry: null, note: "Fly Cebu→Siargao (direct, 1hr)" },
    bohol:       { bus_van: 700,  budget_airline: 2500, full_airline: 4000, private_car: null, boat_ferry: 700,  note: "Ferry Cebu→Tagbilaran: 2hrs (₱250–₱500 OceanJet)" },
    batanes:     { bus_van: null, budget_airline: 9500, full_airline: 14000,private_car: null, boat_ferry: null, note: "Via Manila" },
    sagada:      { bus_van: null, budget_airline: null,  full_airline: null, private_car: null, boat_ferry: null, note: "Fly to Manila then overland to Sagada" },
    camiguin:    { bus_van: null, budget_airline: 3200, full_airline: 5000, private_car: null, boat_ferry: null, note: "Fly Cebu→Camiguin (limited schedule) or via CdO ferry" },
    puerto_galera:{ bus_van: null,budget_airline: 3500, full_airline: 5500, private_car: null, boat_ferry: null, note: "Fly Cebu→Manila then Batangas ferry" },
    cebu_kawasan:{ bus_van: 300,  budget_airline: null,  full_airline: null, private_car: 1500, boat_ferry: 400,  note: "Bus/van from Cebu City + habal-habal to falls" },
    davao_samal: { bus_van: null, budget_airline: 3500, full_airline: 5500, private_car: null, boat_ferry: null, note: "Fly Cebu→Davao then ferry to Samal" },
    bataan_corregidor: { bus_van: null, budget_airline: 3500, full_airline: 5500, private_car: null, boat_ferry: null, note: "Fly to Manila then bus+ferry" },
    zamboanga_great_santa_cruz: { bus_van: null, budget_airline: 3800, full_airline: 6000, private_car: null, boat_ferry: null, note: "Fly Cebu→Zamboanga (direct Cebu Pacific)" }
  },

  // From Davao
  davao: {
    caramoan:    { bus_van: null, budget_airline: 5500, full_airline: 8500, private_car: null, boat_ferry: null, note: "Via Manila" },
    calaguas:    { bus_van: null, budget_airline: 5500, full_airline: 8500, private_car: null, boat_ferry: null, note: "Via Manila" },
    boracay:     { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly Davao→Cebu or Manila then to Caticlan" },
    palawan:     { bus_van: null, budget_airline: 4200, full_airline: 6500, private_car: null, boat_ferry: null, note: "Fly Davao→Puerto Princesa (direct some days)" },
    siargao:     { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly Davao→Cebu→Siargao or bus+boat via CDO" },
    bohol:       { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly Davao→Cebu then ferry to Bohol" },
    batanes:     { bus_van: null, budget_airline: 11000,full_airline: 16000,private_car: null, boat_ferry: null, note: "Via Manila — very expensive route" },
    sagada:      { bus_van: null, budget_airline: null,  full_airline: null, private_car: null, boat_ferry: null, note: "Fly to Manila then overland" },
    camiguin:    { bus_van: 2000, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Bus to CdO (~3hrs) then to Balingoan port + ferry" },
    puerto_galera:{ bus_van: null,budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Fly to Manila then Batangas ferry" },
    cebu_kawasan:{ bus_van: null, budget_airline: 3800, full_airline: 6000, private_car: null, boat_ferry: null, note: "Fly Davao→Cebu then bus" },
    davao_samal: { bus_van: 300,  budget_airline: null,  full_airline: null, private_car: 1500, boat_ferry: 300,  note: "Short ferry from Davao port to Samal Island" },
    bataan_corregidor: { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Via Manila" },
    zamboanga_great_santa_cruz: { bus_van: null, budget_airline: 3800, full_airline: 6000, private_car: null, boat_ferry: null, note: "Fly Davao→Zamboanga (direct)" }
  },

  // From Iloilo
  iloilo: {
    caramoan:    { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Via Manila or Cebu" },
    calaguas:    { bus_van: null, budget_airline: 4500, full_airline: 7000, private_car: null, boat_ferry: null, note: "Via Manila" },
    boracay:     { bus_van: 800,  budget_airline: 2500, full_airline: 4000, private_car: null, boat_ferry: 800,  note: "FastCraft Iloilo→Caticlan: 2hrs (₱400 one way) — cheapest route!" },
    palawan:     { bus_van: null, budget_airline: 3800, full_airline: 6000, private_car: null, boat_ferry: null, note: "Fly Iloilo→Manila→Palawan or direct" },
    siargao:     { bus_van: null, budget_airline: 4000, full_airline: 6500, private_car: null, boat_ferry: null, note: "Via Cebu or Manila" },
    bohol:       { bus_van: null, budget_airline: 3500, full_airline: 5500, private_car: null, boat_ferry: null, note: "Ferry or fly via Cebu" },
    batanes:     { bus_van: null, budget_airline: 10000,full_airline: 15000,private_car: null, boat_ferry: null, note: "Via Manila" },
    sagada:      { bus_van: null, budget_airline: null,  full_airline: null, private_car: null, boat_ferry: null, note: "Via Manila overland" },
    camiguin:    { bus_van: null, budget_airline: 4000, full_airline: 6500, private_car: null, boat_ferry: null, note: "Via Cebu or Manila then CdO" },
    puerto_galera:{ bus_van: null,budget_airline: 4000, full_airline: 6500, private_car: null, boat_ferry: null, note: "Via Manila" },
    cebu_kawasan:{ bus_van: null, budget_airline: 3000, full_airline: 4800, private_car: null, boat_ferry: null, note: "Fly or ferry to Cebu then bus" },
    davao_samal: { bus_van: null, budget_airline: 4000, full_airline: 6500, private_car: null, boat_ferry: null, note: "Via Manila or Cebu" },
    bataan_corregidor: { bus_van: null, budget_airline: 4000, full_airline: 6500, private_car: null, boat_ferry: null, note: "Via Manila" },
    zamboanga_great_santa_cruz: { bus_van: null, budget_airline: 3500, full_airline: 5500, private_car: null, boat_ferry: null, note: "Direct Iloilo→Zamboanga ferry or fly" }
  }
};

// For origins not explicitly listed, use a fallback based on region
const TRANSPORT_FALLBACKS = {
  // "luzon_other" for origins in Luzon not listed
  luzon_other: { multiplier: 1.1 },
  visayas_other: { multiplier: 1.2 },
  mindanao_other: { multiplier: 1.15 }
};

const ORIGIN_REGION = {
  manila: "manila", naga: "naga", legazpi: "legazpi",
  cebu_luzon: "luzon_other", baguio: "luzon_other",
  san_fernando: "luzon_other", dagupan: "luzon_other",
  laoag: "luzon_other", tuguegarao: "luzon_other",
  cebu: "cebu", iloilo: "iloilo", bacolod: "visayas_other",
  tacloban: "visayas_other", dumaguete: "visayas_other", roxas: "visayas_other",
  davao: "davao", cagayan: "mindanao_other", zamboanga: "mindanao_other",
  general_santos: "mindanao_other", butuan: "mindanao_other", cotabato: "mindanao_other"
};

// ============================================================
// HOTEL RATES (per room per night — for 2 pax sharing)
// Per person = divide by 2
// ============================================================
const HOTEL_RATES = {
  // destination tier affects base prices
  budget_friendly: {  // Caramoan, Calaguas, Sagada
    hostel:    { price: 400,  desc: "Dorm bed / Fan room, shared bathroom" },
    inn:       { price: 800,  desc: "Simple fan room, private bathroom" },
    standard:  { price: 1800, desc: "Air-con room, private bath, basic amenities" },
    resort:    { price: 3500, desc: "Beach resort, air-con, breakfast sometimes included" },
    luxury:    { price: 6000, desc: "Premium resort, full amenities (limited options)" }
  },
  mid_friendly: {     // Siargao, Bohol, Camiguin, Puerto Galera
    hostel:    { price: 500,  desc: "Private room or dorm, fan/aircon" },
    inn:       { price: 1200, desc: "Pension house / budget inn, air-con" },
    standard:  { price: 2500, desc: "3-star hotel, breakfast optional" },
    resort:    { price: 5000, desc: "Beach resort, pool, A/C" },
    luxury:    { price: 10000,desc: "4-5 star beachfront resort" }
  },
  premium_friendly: { // Boracay, El Nido, Batanes
    hostel:    { price: 700,  desc: "Hostel / budget guesthouse, fan" },
    inn:       { price: 1500, desc: "Pension / budget inn" },
    standard:  { price: 3500, desc: "Standard hotel, A/C, breakfast" },
    resort:    { price: 8000, desc: "4-star beachfront resort, pool" },
    luxury:    { price: 20000,desc: "5-star resort / private island" }
  }
};

// ============================================================
// FOOD BUDGETS (per person per day)
// ============================================================
const FOOD_BUDGETS = {
  carinderia:  { price: 350,  desc: "Carinderia, turo-turo, street food, local market. Ulam + rice + juice/water." },
  casual:      { price: 700,  desc: "Casual sit-down restaurants. Mix of Filipino and fastfood. 3 meals + snacks." },
  midrange:    { price: 1200, desc: "Mid-range restaurants. Breakfast set, proper lunch, seafood dinner. Coffee included." },
  finedining:  { price: 2500, desc: "Fine dining, cocktails, room service. Premium beachfront restaurants." }
};

// ============================================================
// LOCAL TRANSPORT (per person per day at destination)
// ============================================================
const LOCAL_TRANSPORT = {
  tricycle:       { price: 150,  desc: "Tricycle, habal-habal, jeepney — the local way" },
  rent_bike:      { price: 400,  desc: "Motorbike / e-bike rental for the day (fuel included)" },
  grab:           { price: 600,  desc: "Grab, metered taxi, tourist shuttles" },
  private_driver: { price: 1500, desc: "Dedicated driver / van hire for the day" }
};

// ============================================================
// SHOPPING / PASALUBONG (total per trip per person)
// ============================================================
const SHOPPING_BUDGETS = {
  minimal:   { price: 500,  desc: "Just pasalubong: dried fish, snacks, small ref magnets" },
  moderate:  { price: 1500, desc: "Pasalubong + a few shirts + local crafts" },
  heavy:     { price: 4000, desc: "Clothes, jewelry, artisan products, bulk pasalubong" }
};

// ============================================================
// TIER PRESETS
// Maps a tier to default selections
// ============================================================
const TIER_PRESETS = {
  budget: {
    transport:    "bus_van",
    hotel:        "hostel",
    food:         "carinderia",
    activity:     "group",
    local:        "tricycle",
    shopping:     "minimal",
    contingency:  0.05,
    label:        "Backpacker"
  },
  mid: {
    transport:    "budget_airline",
    hotel:        "standard",
    food:         "casual",
    activity:     "semi_private",
    local:        "rent_bike",
    shopping:     "moderate",
    contingency:  0.10,
    label:        "Comfort Traveler"
  },
  premium: {
    transport:    "full_airline",
    hotel:        "resort",
    food:         "midrange",
    activity:     "private",
    local:        "grab",
    shopping:     "moderate",
    contingency:  0.10,
    label:        "Luxury Escape"
  }
};

// ============================================================
// CHART COLORS
// ============================================================
const CHART_COLORS = [
  "#0097B2", "#27AE60", "#FF6B6B", "#F39C12", "#8E44AD", "#2D6A4F", "#E67E22"
];

// ============================================================
// HELPER: Get transport cost
// ============================================================
function getTransportCost(originKey, destKey, modeKey) {
  const region = ORIGIN_REGION[originKey] || "luzon_other";
  const regionData = TRANSPORT[region];
  if (!regionData) {
    // Fallback: use manila prices * multiplier
    const manilaData = TRANSPORT.manila[destKey];
    if (!manilaData) return 2500;
    const basePrice = manilaData[modeKey];
    if (!basePrice) {
      // Mode not available — pick cheapest available
      const fallbackMode = pickCheapestMode(manilaData);
      return fallbackMode * 1.1;
    }
    return basePrice * 1.1;
  }
  const destData = regionData[destKey];
  if (!destData) return 2500;
  const price = destData[modeKey];
  if (!price) {
    return pickCheapestMode(destData) || 2500;
  }
  return price;
}

function pickCheapestMode(destData) {
  const modes = ["bus_van", "boat_ferry", "budget_airline", "full_airline", "private_car"];
  for (const m of modes) {
    if (destData[m]) return destData[m];
  }
  return 2500;
}

function getTransportNote(originKey, destKey) {
  const region = ORIGIN_REGION[originKey] || "luzon_other";
  const regionData = TRANSPORT[region];
  if (!regionData || !regionData[destKey]) {
    const manilaNote = TRANSPORT.manila[destKey];
    return manilaNote ? manilaNote.note : "Route requires connecting travel";
  }
  return regionData[destKey].note || "";
}

// ============================================================
// HELPER: Get hotel rate
// ============================================================
function getHotelRate(destKey, hotelTypeKey) {
  const dest = DESTINATIONS[destKey];
  const tier = dest ? dest.tier : "mid_friendly";
  const tierRates = HOTEL_RATES[tier] || HOTEL_RATES.mid_friendly;
  const rateData = tierRates[hotelTypeKey] || tierRates.standard;
  return { price: rateData.price, desc: rateData.desc };
}

// ============================================================
// HELPER: Calculate full estimate
// ============================================================
function calculateEstimate(params) {
  const {
    originKey, destKey, travelers, nights, days,
    transportMode, hotelType, foodType, activityType,
    localType, shoppingType, contingencyPct,
    transportEnabled, hotelEnabled, foodEnabled,
    activitiesEnabled, localEnabled, shoppingEnabled, contingencyEnabled
  } = params;

  const safeDays = Math.max((typeof days === "number" ? days : nights + 1), nights + 1);
  const dest = DESTINATIONS[destKey];
  if (!dest) return null;

  const results = {};

  // Transport (round trip, per person)
  const transportCost = transportEnabled
    ? getTransportCost(originKey, destKey, transportMode)
    : 0;
  results.transport = transportCost;

  // Hotel (per room per night / 2 for per-person)
  const hotelData = getHotelRate(destKey, hotelType);
  const hotelPerPerson = hotelEnabled
    ? (hotelData.price / 2) * nights
    : 0;
  results.hotel = hotelPerPerson;

  // Food (per person per day × days)
  const foodData = FOOD_BUDGETS[foodType] || FOOD_BUDGETS.casual;
  const foodTotal = foodEnabled ? foodData.price * safeDays : 0;
  results.food = foodTotal;

  // Activities
  const actData = dest.activities[activityType] || dest.activities.group;
  const entranceFees = dest.entrance_fees * safeDays * 0.5; // partial days
  const activitiesTotal = activitiesEnabled
    ? (actData.price + entranceFees)
    : 0;
  results.activities = activitiesTotal;

  // Local transport (per person per day)
  const localData = LOCAL_TRANSPORT[localType] || LOCAL_TRANSPORT.tricycle;
  const localTotal = localEnabled ? localData.price * safeDays : 0;
  results.local = localTotal;

  // Shopping
  const shopData = SHOPPING_BUDGETS[shoppingType] || SHOPPING_BUDGETS.minimal;
  results.shopping = shoppingEnabled ? shopData.price : 0;

  // Subtotal per person
  const subtotal =
    results.transport + results.hotel + results.food +
    results.activities + results.local + results.shopping;

  // Contingency
  const contingency = contingencyEnabled ? subtotal * contingencyPct : 0;
  results.contingency = contingency;

  const totalPerPerson = subtotal + contingency;
  const grandTotal = totalPerPerson * travelers;
  const perDay = totalPerPerson / safeDays;

  return {
    days: safeDays,
    items: results,
    subtotal,
    contingency,
    totalPerPerson,
    grandTotal,
    perDay,
    travelers,
    nights,
    destination: dest,
    transportNote: getTransportNote(originKey, destKey)
  };
}

// ============================================================
// HELPER: Calculate tier total (for range display & comparison)
// ============================================================
function calculateTierTotal(tierKey, originKey, destKey, nights, days, travelers) {
  const preset = TIER_PRESETS[tierKey];
  const safeDays = Math.max((typeof days === "number" ? days : nights + 1), nights + 1);
  const dest = DESTINATIONS[destKey];
  if (!dest) return 0;

  // Pick best available transport mode for the tier
  const region = ORIGIN_REGION[originKey] || "luzon_other";
  const regionData = TRANSPORT[region] || TRANSPORT.manila;
  const destTransData = regionData ? regionData[destKey] : null;

  let transportMode = preset.transport;
  // If mode not available for this route, pick cheapest available
  if (destTransData && !destTransData[transportMode]) {
    const modeOrder = ["bus_van", "boat_ferry", "budget_airline", "full_airline", "private_car"];
    for (const m of modeOrder) {
      if (destTransData[m]) { transportMode = m; break; }
    }
  }

  const transport = getTransportCost(originKey, destKey, transportMode);
  const hotelData = getHotelRate(destKey, preset.hotel);
  const hotelPerPerson = (hotelData.price / 2) * nights;
  const food = (FOOD_BUDGETS[preset.food]?.price || 700) * safeDays;
  const activity = (dest.activities[preset.activity]?.price || 1000) + dest.entrance_fees;
  const local = (LOCAL_TRANSPORT[preset.local]?.price || 200) * safeDays;
  const shopping = SHOPPING_BUDGETS[preset.shopping]?.price || 500;
  const subtotal = transport + hotelPerPerson + food + activity + local + shopping;
  const contingency = subtotal * (preset.contingency || 0.1);
  return Math.round((subtotal + contingency) * travelers);
}