// =========================================================================
// ZURI & SCENT - PRODUCT CATALOG DATA
// All items are 100% In-Stock & available for nationwide delivery across Kenya
// =========================================================================

// Dera sizes offered (edit this list if your deras come in different sizes)
const DERA_SIZES = [
  { label: "S" }, { label: "M" }, { label: "L" }, { label: "XL" }, { label: "XXL" }
];

// PERFUMES: each perfume has a `sizes` list of { label, price }.
// To offer more bottle sizes, add another entry, e.g. { label: "50ml", price: 2200 }.
// The first entry is the default size shown on the card.

const PRODUCTS = [
  // --- COASTAL TIE-DYE DERAS (Linked to assets/images/deras/Dera-1.png to Dera-5.png) ---
  {
    id: "dera-01",
    name: "Lamu Sunburst Silk Dera",
    category: "dera",
    subCategory: "Hand-Dyed Tie-Dye",
    price: 1800,
    image: "assets/images/deras/Dera-1.png",
    badge: "In Stock • Ready to Ship",
    description: "Breathable coastal rayon-silk drape in golden ochre, ivory, and deep ocean indigo. Includes matching head scarf (leso/mtandio).",
    sizes: DERA_SIZES,
    pairingNote: "Pairs best with Lattafa Yara or Baccarat Rouge 540"
  },
  {
    id: "dera-02",
    name: "Diani Coral & Seafoam Dera",
    category: "dera",
    subCategory: "Hand-Dyed Tie-Dye",
    price: 1800,
    image: "assets/images/deras/Dera-2.png",
    badge: "Bestseller",
    description: "Vibrant coastal sunset coral and emerald starburst pattern. Ultra-soft, non-cling drape tailored for warm afternoons and evening lounging.",
    sizes: DERA_SIZES,
    pairingNote: "Pairs best with Kayali Vanilla 28 or Delina Exclusif"
  },
  {
    id: "dera-03",
    name: "Zanzibar Royal Violet Dera",
    category: "dera",
    subCategory: "Hand-Dyed Tie-Dye",
    price: 2000,
    image: "assets/images/deras/Dera-3.png",
    badge: "Limited Batch",
    description: "Rich royal purple halter-neck coastal gown accented with gold-and-ivory diagonal tie-dye waves. Includes matching scarf.",
    sizes: DERA_SIZES,
    pairingNote: "Pairs best with YSL Libre Intense or Khamrah"
  },
  {
    id: "dera-04",
    name: "Watamu Espresso & Ivory Dera",
    category: "dera",
    subCategory: "Hand-Dyed Tie-Dye",
    price: 1800,
    image: "assets/images/deras/Dera-4.png",
    badge: "In Stock • Ready to Ship",
    description: "Minimalist monochrome espresso brown and crisp ivory rib-tie motif. Effortless resort elegance for brunch or home hosting.",
    sizes: DERA_SIZES,
    pairingNote: "Pairs best with Lattafa Khamrah or Oud Mood"
  },
  {
    id: "dera-05",
    name: "Malindi Saffron & Emerald Dera",
    category: "dera",
    subCategory: "Hand-Dyed Tie-Dye",
    price: 2000,
    image: "assets/images/deras/Dera-5.png",
    badge: "New Arrival",
    description: "Warm saffron gold bodice framed by deep forest-emerald coastal tie-dye borders. Lightweight, airy, and color-fast.",
    sizes: DERA_SIZES,
    pairingNote: "Pairs best with Club de Nuit Woman or Baccarat Rouge"
  },

  // --- WOMEN'S & UNISEX FINE PERFUMES (In Stock) ---
  {
    id: "perf-w-01",
    name: "Lattafa Yara Eau de Parfum (100ml)",
    category: "perfume-women",
    subCategory: "Women • Gourmand Floral",
    price: 3200,
    image: "assets/images/perfumes/perf-w-01.svg",
    badge: "In Stock • 100ml",
    description: "Creamy vanilla orchid, tropical heliotrope, and soft sandalwood musk. The ultimate everyday coastal signature scent.",
    sizes: [{ label: "100ml", price: 3200 }],
    pairingNote: "Top pick for Coral & Gold Deras"
  },
  {
    id: "perf-w-02",
    name: "YSL Libre Intense EDP (90ml)",
    category: "perfume-women",
    subCategory: "Women • Warm Floral",
    price: 14500,
    image: "assets/images/perfumes/perf-w-02.svg",
    badge: "Authentic Designer",
    description: "Moroccan orange blossom, French lavender, and glowing Madagascar vanilla. Bold, radiant, and long-lasting in humid weather.",
    sizes: [{ label: "90ml", price: 14500 }],
    pairingNote: "Top pick for Royal Violet Dera"
  },
  {
    id: "perf-w-03",
    name: "Lattafa Khamrah EDP (100ml)",
    category: "perfume-women",
    subCategory: "Unisex • Spiced Amber",
    price: 3800,
    image: "assets/images/perfumes/perf-w-03.svg",
    badge: "Bestseller • 100ml",
    description: "Cinnamon spice, dates, praline, and warm tonka bean. A rich, captivating unisex aroma that lingers for 12+ hours.",
    sizes: [{ label: "100ml", price: 3800 }],
    pairingNote: "Top pick for Espresso & Ivory Dera"
  },
  {
    id: "perf-w-04",
    name: "Maison Francis Kurkdjian BR540 (70ml)",
    category: "perfume-women",
    subCategory: "Unisex • Amber Floral",
    price: 28500,
    image: "assets/images/perfumes/perf-w-04.svg",
    badge: "Luxury Niche",
    description: "Luminous saffron, jasmine grandiflorum, amberwood, and fir resin. Pure coastal sophistication in a crystal flacon.",
    sizes: [{ label: "70ml", price: 28500 }],
    pairingNote: "Signature pairing for all Silk Deras"
  },

  // --- MEN'S FINE PERFUMES (In Stock) ---
  {
    id: "perf-m-01",
    name: "Dior Sauvage Eau de Parfum (100ml)",
    category: "perfume-men",
    subCategory: "Men • Fresh Spicy Amber",
    price: 16500,
    image: "assets/images/perfumes/perf-m-01.svg",
    badge: "In Stock • 100ml",
    description: "Crisp Reggio bergamot, Sichuan pepper, star anise, and Papua New Guinean vanilla absolute. Iconic evening presence.",
    sizes: [{ label: "100ml", price: 16500 }],
    pairingNote: "Ideal for coastal dinners & executive wear"
  },
  {
    id: "perf-m-02",
    name: "Armaf Club de Nuit Intense Man (105ml)",
    category: "perfume-men",
    subCategory: "Men • Woody Citrus",
    price: 4800,
    image: "assets/images/perfumes/perf-m-02.svg",
    badge: "Top Value • 105ml",
    description: "Zesty lemon, pineapple, smoky birchwood, and musk. High-projection powerhouse fragrance at an accessible price point.",
    sizes: [{ label: "105ml", price: 4800 }],
    pairingNote: "All-day freshness across Kenya's climates"
  },
  {
    id: "perf-m-03",
    name: "Bleu de Chanel Eau de Parfum (100ml)",
    category: "perfume-men",
    subCategory: "Men • Woody Aromatic",
    price: 18500,
    image: "assets/images/perfumes/perf-m-03.svg",
    badge: "Authentic Designer",
    description: "Grapefruit, incense, ginger, and New Caledonian sandalwood. Timeless, clean, and effortlessly refined.",
    sizes: [{ label: "100ml", price: 18500 }],
    pairingNote: "Signature gentleman's scent"
  },
  {
    id: "perf-m-04",
    name: "Lattafa Asad Eau de Parfum (100ml)",
    category: "perfume-men",
    subCategory: "Men • Vanilla Oud Spice",
    price: 3600,
    image: "assets/images/perfumes/perf-m-04.svg",
    badge: "In Stock • 100ml",
    description: "Black pepper, roasted coffee, patchouli, and rich bourbon vanilla. Bold Arabian luxury built for evening occasions.",
    sizes: [{ label: "100ml", price: 3600 }],
    pairingNote: "Best-selling men's Arabian EDP"
  }
];

const CURATED_BUNDLES = [
  {
    id: "bundle-01",
    name: "The Diani Sunset Duo",
    items: "Diani Coral Dera + Lattafa Yara (100ml)",
    deraId: "dera-02",
    perfumeId: "perf-w-01",
    tag: "Save 5%"
  },
  {
    id: "bundle-02",
    name: "The Swahili Noir Collection",
    items: "Watamu Espresso Dera + Lattafa Khamrah (100ml)",
    deraId: "dera-04",
    perfumeId: "perf-w-03",
    tag: "Save 5%"
  },
  {
    id: "bundle-03",
    name: "Couples Coastal Escape Set",
    items: "Lamu Sunburst Dera + Club de Nuit Intense Man",
    deraId: "dera-01",
    perfumeId: "perf-m-02",
    tag: "His & Hers Gift"
  }
];

// Bundle prices are calculated from the catalog (Dera + Perfume, minus the 5% combo
// discount) so the bundle cards always match what the shopping bag charges.
CURATED_BUNDLES.forEach(bundle => {
  const dera = PRODUCTS.find(p => p.id === bundle.deraId);
  const perfume = PRODUCTS.find(p => p.id === bundle.perfumeId);
  bundle.regularPrice = dera.price + perfume.price;
  bundle.bundlePrice = Math.round(bundle.regularPrice * 0.95);
  bundle.savings = bundle.regularPrice - bundle.bundlePrice;
  bundle.tag = bundle.tag.startsWith("Save") ? "Save KES " + bundle.savings : bundle.tag;
});
