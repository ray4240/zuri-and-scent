// =========================================================================
// ZURI & SCENT - INTERACTIVE STOREFRONT LOGIC
// =========================================================================

let cart = [];
let activeFilter = 'all';

// Official Business Contact & Payment Details
const BUSINESS_WHATSAPP = "254729006573";
const PAYMENT_PHONE_DISPLAY = "+254 704 423 457";
const PAYMENT_PHONE_RAW = "+254704423457";

// Hero Slideshow State (4 Videos)
let currentHeroSlide = 0;
let heroSlideInterval = null;
let isHeroInView = true;
const HERO_SLIDE_LABELS = [
  "01 / 04 • Coastal Drapes",
  "02 / 04 • Signature Scents",
  "03 / 04 • Resort Horizons",
  "04 / 04 • Ocean Tides"
];

document.addEventListener("DOMContentLoaded", () => {
  initHeroSlideshow();
  initHeroVisibilityObserver();
  renderProducts('all');
  renderBundles();
  updateCartUI();
});

function shouldSaveData() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!conn) return false;
  return Boolean(conn.saveData) || ['slow-2g', '2g'].includes(conn.effectiveType);
}

function attachSlideVideos(slideEl) {
  if (!slideEl || shouldSaveData()) return;
  const videos = slideEl.querySelectorAll("video[data-src]");
  videos.forEach(video => {
    const sourceUrl = video.dataset.src;
    if (sourceUrl && !video.getAttribute("src")) {
      video.preload = "auto";
      video.muted = true;
      video.setAttribute("src", sourceUrl);
      video.load();
    }
  });
}

function playWhenReady(video) {
  if (!video || shouldSaveData() || document.hidden || !isHeroInView) return;

  const tryPlay = () => {
    if (!document.hidden && isHeroInView) {
      video.muted = true;
      const p = video.play();
      if (p && p.catch) {
        // Some browsers block autoplay until the first touch/click: retry once then.
        p.catch(() => {
          const retry = () => { if (isHeroInView) video.play().catch(() => {}); };
          ["touchstart", "click", "scroll"].forEach(ev =>
            window.addEventListener(ev, retry, { once: true, passive: true }));
        });
      }
    }
  };

  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.addEventListener("canplay", tryPlay, { once: true });
  }
}

function playSlideVideos(slideEl) {
  if (!slideEl) return;
  attachSlideVideos(slideEl);
  slideEl.querySelectorAll("video").forEach(video => playWhenReady(video));
}

function pauseSlideVideos(slideEl) {
  if (!slideEl) return;
  slideEl.querySelectorAll("video").forEach(video => {
    video.pause();
  });
}

function initHeroVisibilityObserver() {
  const heroSection = document.querySelector("section.relative");
  if (!heroSection || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        isHeroInView = entry.isIntersecting;
        const activeSlide = document.querySelectorAll(".hero-slide")[currentHeroSlide];
        if (isHeroInView && !document.hidden) {
          playSlideVideos(activeSlide);
        } else {
          pauseSlideVideos(activeSlide);
        }
      });
    },
    { threshold: 0.15 }
  );

  observer.observe(heroSection);

  document.addEventListener("visibilitychange", () => {
    const activeSlide = document.querySelectorAll(".hero-slide")[currentHeroSlide];
    if (document.hidden) {
      pauseSlideVideos(activeSlide);
    } else if (isHeroInView) {
      playSlideVideos(activeSlide);
    }
  });
}

// Initialize Auto-Rotating Hero Video Slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;

  playSlideVideos(slides[0]);

  if (slides[1]) {
    const warmNext = () => attachSlideVideos(slides[1]);
    if ("requestIdleCallback" in window) {
      requestIdleCallback(warmNext, { timeout: 2000 });
    } else {
      setTimeout(warmNext, 1500);
    }
  }

  heroSlideInterval = setInterval(() => {
    if (!document.hidden && isHeroInView) {
      const nextIndex = (currentHeroSlide + 1) % slides.length;
      goToHeroSlide(nextIndex, false);
    }
  }, 6500);
}

function goToHeroSlide(index, resetTimer = true) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const label = document.getElementById("hero-slide-label");
  if (!slides.length) return;

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.remove("opacity-0", "pointer-events-none");
      slide.classList.add("opacity-100");
      playSlideVideos(slide);
    } else {
      slide.classList.remove("opacity-100");
      slide.classList.add("opacity-0", "pointer-events-none");
      pauseSlideVideos(slide);
    }
  });

  const upcomingSlide = slides[(index + 1) % slides.length];
  attachSlideVideos(upcomingSlide);

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
            loading="lazy"
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

      <div class="px-5 pb-5 pt-3 border-t border-stone-100">
        <div class="mb-3">
          <label for="size-${product.id}" class="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-1">${product.category === 'dera' ? 'Dera Size' : 'Bottle Size'}</label>
          <select id="size-${product.id}" onchange="onCardSizeChange('${product.id}')" class="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm bg-sand focus:outline-none focus:border-gold">
            ${sizeOptionsHTML(product)}
          </select>
          <p id="size-err-${product.id}" class="hidden text-xs text-terracotta mt-1">Please choose a size first.</p>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs text-stone-400 block">In Stock</span>
            <span id="price-${product.id}" class="text-lg font-bold text-obsidian">${formatKES(product.price)}</span>
          </div>
          <button
            onclick="addFromCard('${product.id}')"
            class="bg-obsidian hover:bg-goldDark text-sand text-sm font-medium px-4 py-2.5 rounded-xl transition-colors cursor-pointer">
            + Add to Bag
          </button>
        </div>
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

// ---------- Sizes ----------
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function priceFor(product, size) {
  const s = product.sizes && product.sizes.find(x => x.label === size);
  return s && s.price != null ? s.price : product.price;
}

function sizeOptionsHTML(product, selected = "", forCart = false) {
  const isDera = product.category === "dera";
  const multi = product.sizes.length > 1;
  let html = "";
  if (isDera || (forCart && !selected)) {
    html += `<option value="">${isDera ? "Select size" : "Select ml"}</option>`;
  }
  html += product.sizes.map(s => {
    const label = isDera ? s.label : (multi ? `${s.label} — ${formatKES(s.price)}` : s.label);
    return `<option value="${s.label}" ${s.label === selected ? "selected" : ""}>${label}</option>`;
  }).join("");
  return html;
}

function onCardSizeChange(productId) {
  const product = getProduct(productId);
  const sel = document.getElementById("size-" + productId);
  const priceEl = document.getElementById("price-" + productId);
  const err = document.getElementById("size-err-" + productId);
  if (err) err.classList.add("hidden");
  if (product && sel && priceEl) priceEl.textContent = formatKES(priceFor(product, sel.value));
}

function addFromCard(productId) {
  const product = getProduct(productId);
  const sel = document.getElementById("size-" + productId);
  const size = sel ? sel.value : "";
  if (product.category === "dera" && !size) {
    const err = document.getElementById("size-err-" + productId);
    if (err) err.classList.remove("hidden");
    if (sel) sel.focus();
    return;
  }
  addToCart(productId, size || null);
}

// ---------- Cart ----------
function cartKey(id, size) {
  return id + "|" + (size || "");
}

// Add Single Item to Cart (size can be chosen later inside the bag)
function addToCart(productId, size = null) {
  const product = getProduct(productId);
  if (!product) return;
  if (!size && product.category.startsWith("perfume") && product.sizes.length === 1) {
    size = product.sizes[0].label;
  }
  const key = cartKey(productId, size);
  const existing = cart.find(item => item.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      key, id: productId, name: product.name, category: product.category,
      image: product.image, size: size, price: priceFor(product, size), qty: 1
    });
  }
  updateCartUI();
  openCart();
}

// Add Bundle to Cart
function addBundleToCart(deraId, perfumeId) {
  addToCart(deraId);
  addToCart(perfumeId);
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.key !== key);
  updateCartUI();
}

function setCartSize(key, size) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  const product = getProduct(item.id);
  const newKey = cartKey(item.id, size);
  const twin = cart.find(i => i.key === newKey && i !== item);
  if (twin) {
    twin.qty += item.qty;
    cart = cart.filter(i => i !== item);
  } else {
    item.size = size || null;
    item.key = newKey;
    item.price = priceFor(product, size);
  }
  updateCartUI();
}

// Totals & 5% combo discount (when buying both a Dera & a Perfume)
function getCartSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const hasDera = cart.some(i => i.category === "dera");
  const hasPerfume = cart.some(i => i.category.startsWith("perfume"));
  const discount = (hasDera && hasPerfume) ? Math.round(subtotal * 0.05) : 0;
  return { subtotal, discount, total: subtotal - discount, hasCombo: hasDera && hasPerfume };
}

function updateCartUI() {
  const countBadge = document.getElementById("cart-count");
  const itemsContainer = document.getElementById("cart-items");
  const summaryContainer = document.getElementById("cart-summary");
  const detailsBox = document.getElementById("checkout-details");

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) countBadge.textContent = totalItems;
  if (!itemsContainer || !summaryContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-12 text-stone-500">
        <p class="font-serif text-2xl text-obsidian mb-2">Your shopping bag is empty</p>
        <p class="text-sm">Explore our coastal silk Deras and fine perfumes to curate your signature look.</p>
      </div>`;
    summaryContainer.innerHTML = "";
    if (detailsBox) detailsBox.classList.add("hidden");
    return;
  }
  if (detailsBox) detailsBox.classList.remove("hidden");

  itemsContainer.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    const missing = !item.size;
    return `
    <div class="flex gap-4 py-4 border-b border-stone-200 items-start">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-20 object-cover rounded-lg bg-stone-100" />
      <div class="flex-1">
        <h4 class="font-serif text-lg font-semibold text-obsidian leading-tight">${item.name}</h4>
        <p class="text-xs text-stone-500 mb-2">${formatKES(item.price)} each</p>
        <select onchange="setCartSize('${item.key}', this.value)" aria-label="Size"
          class="mb-2 w-full text-xs rounded-lg border ${missing ? "border-terracotta bg-terracotta/5" : "border-stone-300 bg-white"} px-2 py-1.5">
          ${sizeOptionsHTML(product, item.size || "", true)}
        </select>
        ${missing ? `<p class="text-[11px] text-terracotta mb-2">Choose a size to continue</p>` : ""}
        <div class="flex items-center gap-3">
          <button onclick="updateQty('${item.key}', -1)" class="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-sm hover:bg-stone-100 cursor-pointer">-</button>
          <span class="text-sm font-semibold">${item.qty}</span>
          <button onclick="updateQty('${item.key}', 1)" class="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-sm hover:bg-stone-100 cursor-pointer">+</button>
        </div>
      </div>
      <div class="text-right font-bold text-obsidian text-sm">${formatKES(item.price * item.qty)}</div>
    </div>`;
  }).join("");

  const { subtotal, discount, total, hasCombo } = getCartSummary();
  summaryContainer.innerHTML = `
    <div class="space-y-2 text-sm mb-4">
      <div class="flex justify-between text-stone-600"><span>Subtotal</span><span>${formatKES(subtotal)}</span></div>
      ${hasCombo ? `
        <div class="flex justify-between text-sage font-medium"><span>✨ Scent & Drape Combo (5% Off)</span><span>-${formatKES(discount)}</span></div>
      ` : `
        <p class="text-xs text-goldDark bg-gold/10 p-2 rounded-lg">Tip: Add both a Dera & a Perfume to unlock 5% off your order!</p>
      `}
      <div class="flex justify-between text-base font-bold text-obsidian pt-2 border-t border-stone-200"><span>Total Payable</span><span>${formatKES(total)}</span></div>
      <div class="bg-sandDark p-3 rounded-xl border border-stone-200/80 text-xs text-stone-700 mt-2">
        <span class="font-semibold text-obsidian block">Payment Line (M-Pesa Send Money):</span>
        <span class="font-bold text-goldDark text-sm">${PAYMENT_PHONE_DISPLAY}</span>
      </div>
    </div>
    <p id="checkout-error" class="hidden text-xs text-terracotta bg-terracotta/10 p-2 rounded-lg mb-3"></p>
    <button onclick="checkoutWhatsApp()" class="w-full bg-obsidian hover:bg-goldDark text-sand font-semibold py-3.5 rounded-xl transition-colors cursor-pointer">
      Confirm Details &amp; Send Order on WhatsApp
    </button>`;
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

// ---------- Checkout: validate details first, then WhatsApp ----------
function normalizeKenyanPhone(raw) {
  let d = (raw || "").replace(/[^\d]/g, "");
  if (d.startsWith("254")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return /^[17]\d{8}$/.test(d) ? "254" + d : null;
}

function setFieldError(field, message) {
  const input = document.getElementById(field);
  const err = document.getElementById("err-" + field);
  if (err) {
    err.textContent = message || "";
    err.classList.toggle("hidden", !message);
  }
  if (input) {
    input.classList.toggle("border-terracotta", Boolean(message));
    input.classList.toggle("border-stone-300", !message);
  }
}

function validateCheckout() {
  const val = id => (document.getElementById(id)?.value || "").trim();
  const data = {
    name: val("customer-name"),
    phoneRaw: val("customer-phone"),
    location: val("delivery-location"),
    address: val("delivery-address"),
    notes: val("order-notes")
  };
  data.phone = normalizeKenyanPhone(data.phoneRaw);

  const problems = [];
  const check = (field, bad, msg) => { setFieldError(field, bad ? msg : ""); if (bad) problems.push(field); };
  check("customer-name", data.name.length < 3, "Enter your full name.");
  check("customer-phone", !data.phone, "Enter a valid Kenyan number, e.g. 0712 345 678.");
  check("delivery-location", data.location.length < 3, "Enter your town / county.");
  check("delivery-address", data.address.length < 3, "Enter your estate, street or pickup point.");

  const unsized = cart.filter(i => !i.size);
  const box = document.getElementById("checkout-error");
  let sizeMsg = "";
  if (unsized.length) {
    sizeMsg = "Please choose a size for: " + unsized.map(i => i.name).join(", ") + ".";
  }
  if (box) {
    box.textContent = sizeMsg;
    box.classList.toggle("hidden", !sizeMsg);
  }
  return { ok: problems.length === 0 && !unsized.length, data, firstBad: problems[0] };
}

function checkoutWhatsApp() {
  if (cart.length === 0) return;
  const { ok, data, firstBad } = validateCheckout();
  if (!ok) {
    const target = firstBad ? document.getElementById(firstBad) : document.getElementById("cart-items");
    if (target) { target.scrollIntoView({ behavior: "smooth", block: "center" }); if (firstBad) target.focus(); }
    return;
  }

  const { subtotal, discount, total } = getCartSummary();
  const orderRef = "ZS-" + Math.floor(100000 + Math.random() * 900000);
  const placed = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "medium", timeStyle: "short" });

  const lines = [
    "*ZURI & SCENT — NEW ORDER*",
    `Order Ref: *${orderRef}*`,
    `Placed: ${placed}`,
    "",
    "*CUSTOMER DETAILS*",
    `Name: ${data.name}`,
    `Phone: +${data.phone} (chat: https://wa.me/${data.phone})`,
    `Town / County: ${data.location}`,
    `Address / Pickup point: ${data.address}`,
    `Notes: ${data.notes || "None"}`,
    "",
    "*ITEMS ORDERED*"
  ];
  cart.forEach((item, i) => {
    const kind = item.category === "dera" ? "Size" : "Bottle";
    lines.push(`${i + 1}. ${item.name}`);
    lines.push(`   ${kind}: ${item.size} | Qty: ${item.qty} | ${formatKES(item.price * item.qty)}`);
  });
  lines.push("", `Subtotal: ${formatKES(subtotal)}`);
  if (discount > 0) lines.push(`Combo Discount (5%): -${formatKES(discount)}`);
  lines.push(
    `*TOTAL PAYABLE: ${formatKES(total)}*`,
    `Payment: M-Pesa Send Money to ${PAYMENT_PHONE_RAW}`,
    "Status: Awaiting payment confirmation"
  );

  const url = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
  window.open(url, "_blank");

  const status = document.getElementById("checkout-status");
  if (status) {
    status.classList.remove("hidden");
    status.innerHTML = `Order <strong>${orderRef}</strong> is ready. If WhatsApp did not open,
      <a href="${url}" target="_blank" rel="noopener" class="underline font-semibold">tap here to send it</a>.`;
  }
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