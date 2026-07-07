/* ============================================================
   CLIENT SITE CONFIG
   This one file defines an entire client website. Duplicate it,
   fill it in for the new business, then run:  node generate.js
   ============================================================ */
module.exports = {
  // Where the finished site will live. Used for canonical URLs and the sitemap.
  baseUrl: "https://summitplumbingco.com",

  // Where form submissions POST as JSON (GHL inbound webhook, Zapier, Make,
  // or any endpoint you control). Leave "" while testing; the form still
  // shows its success state.
  leadWebhook: "",

  business: {
    name: "Summit Plumbing Co.",
    phone: "(720) 555-0148",
    email: "hello@summitplumbingco.com",
    address: "4180 S Broadway, Englewood, CO 80113",
    license: "Colorado Master Plumber License #MP-188442",
    serviceArea: "Denver metro",
    founded: 2009,
    hours: "Office: Mon-Fri, 7am-6pm. Emergency service: 24/7/365.",
  },

  // The trade wording drives page titles, URLs, and city-page copy.
  trade: {
    noun: "plumbing",          // "fast, honest plumbing"
    person: "plumber",         // "plumber in Littleton, CO"
    urlPrefix: "plumber",      // city URLs become /plumber-littleton-co/
  },

  brand: {
    primary: "#0e2a47",        // deep header/footer color
    blue: "#1d6fd1",           // links, buttons
    accent: "#f5a524",         // CTA / highlights
  },

  hero: {
    badge: "Denver Metro · Same-Day Service",
    h1: "Fast, honest plumbing, <em>done right</em> the first time.",
    sub: "Family-owned since 2009. Upfront pricing, licensed techs, and a real person answering the phone, day or night.",
    chips: ["Licensed & Insured", "60-Min Emergency Response", "★ 4.9 · 180 Google Reviews"],
    emergencyBadge: "24/7 Emergency Service",
  },

  // Up to 10. Each becomes a dedicated SEO page at /<slug>/.
  services: [
    { name: "Water Heater Repair", icon: "heater", blurb: "Repair and same-day replacement of tank and tankless systems. Most swaps done in under 4 hours." },
    { name: "Tankless Water Heaters", icon: "flame", blurb: "Endless hot water and lower gas bills. We install, service, and descale all major brands." },
    { name: "Drain Cleaning", icon: "drain", blurb: "Hydro-jetting and camera inspections that clear any clog and show you exactly what caused it." },
    { name: "Sewer Line Repair", icon: "dig", blurb: "Spot repairs, liners, and full replacements. Camera first, so you only pay for what's actually broken." },
    { name: "Whole-Home Repipes", icon: "pipes", blurb: "Copper and PEX repipes with clean drywall repair included. Financing available on approved credit." },
    { name: "Sump Pumps", icon: "pump", blurb: "Installs, battery backups, and flood prevention that keeps your basement dry through spring melt." },
    { name: "Gas Line Services", icon: "flame", blurb: "Licensed gas fitting for ranges, dryers, fire pits, and whole-home lines. Pressure-tested and permitted." },
    { name: "Leak Detection", icon: "drop", blurb: "Acoustic and thermal detection that finds hidden leaks without tearing your house apart." },
    { name: "Toilet & Faucet Repair", icon: "wrench", blurb: "Running toilets, dripping faucets, low pressure. Small fixes done fast at a flat, honest price." },
    { name: "Emergency Plumbing", icon: "bolt", blurb: "Burst pipes, sewage backups, no hot water. A live person answers and a tech rolls within the hour." },
  ],

  // Up to 10. Each becomes a dedicated SEO page at /<urlPrefix>-<city>-co/.
  citySuffix: "co",            // state abbreviation used in city URLs
  cities: [
    "Denver", "Englewood", "Littleton", "Lakewood", "Aurora",
    "Highlands Ranch", "Centennial", "Arvada", "Wheat Ridge", "Castle Rock",
  ],

  why: [
    ["16 Years", "Serving Denver Metro"],
    ["9 Techs", "Licensed & Background-Checked"],
    ["100%", "Satisfaction Guarantee"],
    ["60 Min", "Emergency Response Time"],
  ],

  // Paths are relative to this folder; files get copied into the built site.
  gallery: [
    { img: "../photos/water-heater.jpg", title: "50-gal water heater swap", meta: "Littleton · In and out same day" },
    { img: "../photos/repipe.jpg", title: "Copper-to-PEX whole home repipe", meta: "Wash Park · 3 days, walls patched" },
    { img: "../photos/sump-pump.jpg", title: "Sump pump with battery backup", meta: "Aurora · Basement's been dry since" },
    { img: "../photos/drain-clearing.jpg", title: "Kitchen drain line cleared", meta: "Lakewood · 40 feet of clog, gone" },
    { img: "../photos/tankless.jpg", title: "Tankless conversion", meta: "Highlands Ranch · Endless hot water" },
    { img: "../photos/main-line.jpg", title: "Main sewer line replacement", meta: "Englewood · New line in, backfilled next day" },
  ],

  reviews: {
    rating: "4.9",
    count: 180,
    items: [
      { name: "Jennifer Kowalski", when: "2 weeks ago", text: "Called at 8am with a busted water heater, had hot water again by 2pm. Fair price, zero pressure, and they laid down floor protection without being asked." },
      { name: "Dave Reznick", when: "1 month ago", text: "Miguel walked me through everything before starting and the final bill matched the quote to the penny. That never happens with contractors." },
      { name: "Angela Torres", when: "1 month ago", text: "They text you when the tech is on the way, with a photo so you know who's coming. Best service experience I've had from any trade, period." },
    ],
  },

  form: {
    title: "Request Service",
    subtitle: "We respond in under 5 minutes. Guaranteed.",
    button: "Send Request",
    fineprint: "By submitting, you agree to receive text messages from Summit Plumbing Co. Message & data rates may apply.",
    successTitle: "Request received!",
    successText: "We're texting you right now.",
    issuePlaceholder: "Kitchen sink is backing up and smells terrible…",
  },
};
