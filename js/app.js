// =========================================================================
// ZURI & SCENT - INTERACTIVE STOREFRONT LOGIC
// =========================================================================

let cart = [];
let activeFilter = 'all';

// Official Business Contact & Payment Details
const BUSINESS_WHATSAPP = "254729006573";
const PAYMENT_PHONE_DISPLAY = "+254 704 423 457";
const PAYMENT_PHONE_RAW = "+254704423457";

// Hero Slideshow State
let currentHeroSlide = 0;
let heroSlideInterval = null;
const HERO_SLIDE_LABELS = [
  "01 / 05 • Coastal Drapes",
  "02 / 05 • Signature Scents",
  "03 / 05 • Resort Horizons",
  "04 / 05 • Ocean Tides",
  "05 / 05 • Swahili Coast"
];

document.addEventListener("DOMContentLoaded", () => {
  initHeroSlideshow();
  renderProducts('all');
  renderBundles();
  updateCartUI();
});

// Initialize Auto-Rotating Hero Video Slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide-video");
  if (!slides.length) return;

  heroSlideInterval = setInterval(() => {
    const nextIndex = (currentHeroSlide + 1) % slides.length;
    goToHeroSlide(nextIndex, false);
  }, 6500);
}

function goToHeroSlide(index, resetTimer = true) {
  const slides = document.querySelectorAll(".hero-slide-video");
  const dots = document.querySelectorAll(".hero-dot");
  const label = document.getElementById("hero-slide-label");
  if (!slides.length) return;

  slides.forEach((video, i) => {
    if (i === index) {
      video.classList.remove("opacity-0");
      video.classList.add("opacity-65");
      video.play().catch(() => {});
    } else {
      video.classList.remove("opacity-65");
      video.classList.add("opacity-0");
    }
  });

  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.remove("w-3", "bg-white/40");
      dot.classList.add("w-8", "bg-gold");
    } else {
      dot.classList.remove("w-8", "bg-gold");
      dot.classList.add("w-3", "bg-white/40");
    }
  });

  if (label && HERO_SLIDE_LABELS[index]) {
    label.textContent = HERO_SLIDE_LABELS[index];
  }

  currentHeroSlide = index;

  if (resetTimer && heroSlideInterval) {
    clearInterval(heroSlideInterval);
    initHeroSlideshow();
  }
}

// Format KES Currency
function formatKES(amount) {
  return "KES " + amount.toLocaleString("en-KE");
}

// Render Product Grid
function renderProducts(filter = 'all') {
  activeFilter = filter;
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.add("bg-obsidian", "text-sand", "border-obsidian");
      btn.classList.remove("bg-white", "text-obsidian", "border-stone-300");
    } else {
      btn.classList.remove("bg-obsidian", "text-sand", "border-obsidian");
      btn.classList.add("bg-white", "text-obsidian", "border-stone-300");
    }
  });

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(product => `
    <div class="product-card bg-white rounded-2xl overflow-hidden border border-stone-200/80 flex flex-col justify-between">
      <div>
        <div class="relative h-72 bg-stone-100 overflow-hidden">
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-img-zoom w-full h-full object-cover object-top"
            onerror="this.src='https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'"
          />
          <span class="absolute top-3 left-3 bg-obsidian/85 text-sand text-[11px] font-medium tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-sm">
            ${product.badge}
          </span>
        </div>
        <div class="p-5">
          <p class="text-xs uppercase tracking-widest text-goldDark font-semibold mb-1">${product.subCategory}</p>
          <h3 class="font-serif text-2xl font-semibold text-obsidian leading-snug mb-2">${product.name}</h3>
          <p class="text-sm text-stone-600 line-clamp-2 mb-3">${product.description}</p>
          <div class="text-xs text-sage bg-sageLight/70 px-3 py-1.5 rounded-lg inline-block">
            ✨ ${product.pairingNote}
          </div>
        </div>
      </div>

      <div class="px-5 pb-5 pt-2 flex items-center justify-between border-t border-stone-100">
        <div>
          <span class="text-xs text-stone-400 block">In Stock</span>
          <span class="text-lg font-bold text-obsidian">${formatKES(product.price)}</span>
        </div>
        <button
          onclick="addToCart('${product.id}')"
          class="bg-obsidian hover:bg-goldDark text-sand text-sm font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer flex items-center gap-2">
          <span>+ Add to Bag</span>
        </button>
      </div>
    </div>
  `).join("");
}

// Render Curated Scent & Drape Bundles
function renderBundles() {
  const container = document.getElementById("bundles-grid");
  if (!container) return;

  container.innerHTML = CURATED_BUNDLES.map(bundle => `
    <div class="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 flex flex-col justify-between text-sand">
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="bg-gold text-obsidian text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
            ${bundle.tag}
          </span>
          <span class="text-xs text-stone-300">Ready for Dispatch</span>
        </div>
        <h3 class="font-serif text-2xl font-semibold mb-2">${bundle.name}</h3>
        <p class="text-sm text-stone-300 mb-4">${bundle.items}</p>
      </div>
      <div class="pt-4 border-t border-white/15 flex items-center justify-between">
        <div>
          <span class="text-xs text-stone-400 line-through block">${formatKES(bundle.regularPrice)}</span>
          <span class="text-xl font-bold text-gold">${formatKES(bundle.bundlePrice)}</span>
        </div>
        <button
          onclick="addBundleToCart('${bundle.deraId}', '${bundle.perfumeId}')"
          class="bg-gold hover:bg-white text-obsidian font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
          Add Set
        </button>
      </div>
    </div>
  `).join("");
}

// Add Single Item to Cart
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  openCart();
}

// Add Bundle to Cart
function addBundleToCart(deraId, perfumeId) {
  addToCart(deraId);
  const p = PRODUCTS.find(x => x.id === perfumeId);
  if (p) {
    const existing = cart.find(item => item.id === perfumeId);
    if (existing) existing.qty += 1;
    else cart.push({ ...p, qty: 1 });
  }
  updateCartUI();
  openCart();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== productId);
  }
  updateCartUI();
}

// Calculate Totals & Multi-Category Bundle Discount (5% when buying both a Dera & a Perfume)
function getCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasDera = cart.some(i => i.category === 'dera');
  const hasPerfume = cart.some(i => i.category.startsWith('perfume'));
  const discount = (hasDera && hasPerfume) ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total, hasCombo: hasDera && hasPerfume };
}

function updateCartUI() {
  const countBadge = document.getElementById("cart-count");
  const itemsContainer = document.getElementById("cart-items");
  const summaryContainer = document.getElementById("cart-summary");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) countBadge.textContent = totalItems;

  if (!itemsContainer || !summaryContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-12 text-stone-500">
        <p class="font-serif text-2xl text-obsidian mb-2">Your shopping bag is empty</p>
        <p class="text-sm">Explore our coastal silk Deras and fine perfumes to curate your signature look.</p>
      </div>
    `;
    summaryContainer.innerHTML = "";
    return;
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="flex gap-4 py-4 border-b border-stone-200 items-center">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded-lg bg-stone-100" />
      <div class="flex-1">
        <h4 class="font-serif text-lg font-semibold text-obsidian leading-tight">${item.name}</h4>
        <p class="text-xs text-stone-500 mb-2">${formatKES(item.price)} each</p>
        <div class="flex items-center gap-3">
          <button onclick="updateQty('${item.id}', -1)" class="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-sm hover:bg-stone-100 cursor-pointer">-</button>
          <span class="text-sm font-semibold">${item.qty}</span>
          <button onclick="updateQty('${item.id}', 1)" class="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-sm hover:bg-stone-100 cursor-pointer">+</button>
        </div>
      </div>
      <div class="text-right font-bold text-obsidian text-sm">
        ${formatKES(item.price * item.qty)}
      </div>
    </div>
  `).join("");

  const { subtotal, discount, total, hasCombo } = getCartSummary();

  summaryContainer.innerHTML = `
    <div class="space-y-2 text-sm mb-4">
      <div class="flex justify-between text-stone-600">
        <span>Subtotal</span>
        <span>${formatKES(subtotal)}</span>
      </div>
      ${hasCombo ? `
        <div class="flex justify-between text-sage font-medium">
          <span>✨ Scent & Drape Combo (5% Off)</span>
          <span>-${formatKES(discount)}</span>
        </div>
      ` : `
        <p class="text-xs text-goldDark bg-gold/10 p-2 rounded-lg">
          Tip: Add both a Dera & a Perfume to unlock 5% off your order!
        </p>
      `}
      <div class="flex justify-between text-base font-bold text-obsidian pt-2 border-t border-stone-200">
        <span>Total Payable</span>
        <span>${formatKES(total)}</span>
      </div>
      <div class="bg-sandDark p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 mt-2">
        <span class="font-semibold text-obsidian block">Payment Line (M-Pesa Send Money):</span>
        <span class="font-bold text-goldDark text-sm">${PAYMENT_PHONE_DISPLAY}</span>
      </div>
    </div>
    <button
      onclick="checkoutWhatsApp()"
      class="w-full bg-obsidian hover:bg-goldDark text-sand font-semibold py-3.5 rounded-xl transition-colors cursor-pointer">
      Complete Order via WhatsApp / M-Pesa
    </button>
  `;
}

// Cart Drawer Controls
function openCart() {
  document.getElementById("cart-drawer").classList.remove("translate-x-full");
  document.getElementById("cart-backdrop").classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.add("translate-x-full");
  document.getElementById("cart-backdrop").classList.add("hidden");
}

// Generate Official Order Invoice & Send via WhatsApp
function checkoutWhatsApp() {
  if (cart.length === 0) return;
  const customerName = document.getElementById("customer-name")?.value.trim() || "Valued Client";
  const deliveryLocation = document.getElementById("delivery-location")?.value.trim() || "Nationwide (Kenya)";
  const { subtotal, discount, total } = getCartSummary();
  const orderRef = "ZS-" + Math.floor(100000 + Math.random() * 900000);

  let message = `*ZURI & SCENT — OFFICIAL ORDER RECEIPT*%0A`;
  message += `Order Ref: *${orderRef}*%0A`;
  message += `Client: ${customerName}%0A`;
  message += `Delivery: ${deliveryLocation}%0A%0A`;
  message += `*Items Ordered:*%0A`;
  cart.forEach(item => {
    message += `• ${item.name} (x${item.qty}) — ${formatKES(item.price * item.qty)}%0A`;
  });
  message += `%0ASubtotal: ${formatKES(subtotal)}%0A`;
  if (discount > 0) message += `Combo Discount (5%): -${formatKES(discount)}%0A`;
  message += `*Total Payable: ${formatKES(total)}*%0A`;
  message += `*M-Pesa Payment Number:* ${PAYMENT_PHONE_RAW}%0A%0A`;
  message += `Please confirm dispatch details. Thank you!`;

  window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${message}`, "_blank");
}

// Interactive Style & Scent Matcher
function recommendPairing() {
  const mood = document.getElementById("quiz-mood").value;
  const gender = document.getElementById("quiz-gender").value;
  const resultBox = document.getElementById("quiz-result");

  let dera = PRODUCTS[0];
  let perfume = PRODUCTS[5];

  if (mood === "sunset") {
    dera = PRODUCTS.find(p => p.id === "dera-02");
    perfume = gender === "men" ? PRODUCTS.find(p => p.id === "perf-m-02") : PRODUCTS.find(p => p.id === "perf-w-01");
  } else if (mood === "evening") {
    dera = PRODUCTS.find(p => p.id === "dera-03");
    perfume = gender === "men" ? PRODUCTS.find(p => p.id === "perf-m-01") : PRODUCTS.find(p => p.id === "perf-w-02");
  } else {
    dera = PRODUCTS.find(p => p.id === "dera-04");
    perfume = gender === "men" ? PRODUCTS.find(p => p.id === "perf-m-04") : PRODUCTS.find(p => p.id === "perf-w-03");
  }

  resultBox.innerHTML = `
    <div class="mt-6 p-5 bg-sand rounded-2xl border border-gold/40 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span class="text-xs uppercase tracking-widest text-goldDark font-bold">Your Bespoke Match</span>
        <h4 class="font-serif text-2xl font-semibold text-obsidian mt-1">${dera.name} + ${perfume.name}</h4>
        <p class="text-sm text-stone-600 mt-1">Combined Set Value: <strong>${formatKES(Math.round((dera.price + perfume.price) * 0.95))}</strong> (includes 5% combo privilege)</p>
      </div>
      <button
        onclick="addBundleToCart('${dera.id}', '${perfume.id}')"
        class="bg-obsidian hover:bg-goldDark text-sand px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap cursor-pointer">
        Add Pair to Bag
      </button>
    </div>
  `;
}