// Procedural Generation of 120 Luxury Jewelry Inventory Items
const categories = ["Rings", "Necklaces", "Bracelets", "Watches", "Earrings", "Pendants"];
const metals = ["18k White Gold", "18k Yellow Gold", "18k Rose Gold", "Platinum 950", "22k Yellow Gold"];
const stones = ["Diamond", "Sapphire", "Emerald", "Ruby", "South Sea Pearl", "Tanzanite", "Opal"];
const cuts = ["Solitaire", "Eternity", "Halo", "Vintage Art Deco", "Bespoke", "Pavé", "Pave Link", "Baguette"];

function generateInventory() {
    const items = [];
    let id = 1;

    // Fixed Signature High-Value Showpieces (1-10)
    const signatureItems = [
        { name: "Royal Pavé Engagement Ring", category: "Rings", metal: "Platinum 950", spec: "2.1 ct VVS1 D-Color", price: 7800.00 },
        { name: "Eternity Emerald-Cut Band", category: "Rings", metal: "18k White Gold", spec: "3.5 ct Total VS1", price: 5400.00 },
        { name: "Miami Heavy Cuban Link Chain", category: "Necklaces", metal: "14k Solid Gold", spec: "24 Inch / 68g", price: 4600.00 },
        { name: "South Sea Baroque Pearl Choker", category: "Necklaces", metal: "18k Yellow Gold", spec: "14mm Grade AAA", price: 3200.00 },
        { name: "Diamond Tennis Bangle", category: "Bracelets", metal: "18k White Gold", spec: "7.0 ct VS Clarity", price: 8900.00 },
        { name: "Solid Byzantine Wrist Chain", category: "Bracelets", metal: "22k Yellow Gold", spec: "42 Grams Heavy", price: 3100.00 },
        { name: "Chronometer Sub-Diver 41", category: "Watches", metal: "Oystersteel & Gold", spec: "Automatic Calibre 3235", price: 11400.00 },
        { name: "Perpetual Tourbillon Skeleton", category: "Watches", metal: "18k Rose Gold", spec: "Openwork Dial / Alligator", price: 24500.00 },
        { name: "Round Brilliant Stud Earrings", category: "Earrings", metal: "Platinum 950", spec: "1.5 ct Each (3.0ctw)", price: 6100.00 },
        { name: "Burmese Pigeon Blood Drops", category: "Earrings", metal: "18k Rose Gold", spec: "4.2 ct Unheated Rubies", price: 9200.00 }
    ];

    signatureItems.forEach(item => {
        items.push({
            id: id,
            sku: `JWL-SIG-${String(id).padStart(3, '0')}`,
            name: item.name,
            category: item.category,
            metal: item.metal,
            spec: item.spec,
            price: item.price
        });
        id++;
    });

    // Procedurally Generate Remaining 110 Pieces (Total 120)
    for (let i = 11; i <= 120; i++) {
        const cat = categories[i % categories.length];
        const metal = metals[(i * 3) % metals.length];
        const stone = stones[(i * 5) % stones.length];
        const cut = cuts[(i * 7) % cuts.length];
        const carat = (0.5 + (i * 0.08) % 4.5).toFixed(2);
        const weight = (8 + (i * 2) % 45);

        let itemName = "";
        let spec = "";
        let basePrice = 850 + (i * 115);

        if (cat === "Watches") {
            itemName = `${cut} Heritage Automatic ${i}`;
            spec = `Sapphire / ${38 + (i % 6)}mm Case`;
            basePrice = 4500 + (i * 180);
        } else if (cat === "Necklaces" || cat === "Bracelets") {
            itemName = `${stone} ${cut} ${cat.slice(0, -1)}`;
            spec = `${carat} ctw &bull; ${weight}g`;
            basePrice = 1200 + (i * 130);
        } else {
            itemName = `${cut} ${stone} ${cat.slice(0, -1)}`;
            spec = `${carat} ct &bull; Certified`;
            basePrice = 950 + (i * 95);
        }

        const catCode = cat.substring(0, 2).toUpperCase();

        items.push({
            id: id,
            sku: `JWL-${catCode}-${String(id).padStart(3, '0')}`,
            name: itemName,
            category: cat,
            metal: metal,
            spec: spec,
            price: parseFloat(basePrice.toFixed(2))
        });
        id++;
    }

    return items;
}

const inventory = generateInventory();
let cart = [];
const TAX_RATE = 0.075; // 7.5% Luxury Tax

// DOM Element References
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryTabs = document.getElementById("categoryTabs");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const summarySubtotal = document.getElementById("summarySubtotal");
const summaryTax = document.getElementById("summaryTax");
const summaryTotal = document.getElementById("summaryTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const receiptModal = document.getElementById("receiptModal");
const closeReceiptBtn = document.getElementById("closeReceiptBtn");

// 1. Render Product Cards (Supports Pagination / Fast Rendering)
function renderProducts(items) {
    productGrid.innerHTML = "";
    if (items.length === 0) {
        productGrid.innerHTML = `<p style="grid-column: 1/-1; color: #64748b; padding: 2rem 0; text-align: center;">No luxury pieces match your search or filter.</p>`;
        return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div>
                <div class="card-top">
                    <span class="sku-badge">${item.sku}</span>
                    <span class="spec-badge">${item.spec}</span>
                </div>
                <h3 class="product-title">${item.name}</h3>
                <p class="product-metal">${item.metal}</p>
            </div>
            <div class="card-bottom">
                <span class="product-price">$${item.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                <button class="btn-add" onclick="addToCart(${item.id})">+ Add</button>
            </div>
        `;
        fragment.appendChild(card);
    });

    productGrid.appendChild(fragment);
}

// 2. Search & Category Filters
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeTab = document.querySelector(".tab-btn.active").dataset.category;

    const filtered = inventory.filter(item => {
        const matchesCategory = (activeTab === "all" || item.category === activeTab);
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                              item.sku.toLowerCase().includes(searchTerm) ||
                              item.spec.toLowerCase().includes(searchTerm) ||
                              item.metal.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
}

categoryTabs.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-btn")) {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        filterProducts();
    }
});

searchInput.addEventListener("input", filterProducts);

// 3. Cart Actions
window.addToCart = function(productId) {
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        const product = inventory.find(p => p.id === productId);
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
};

window.changeQty = function(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
};

clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartUI();
});

function updateCartUI() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Cart is empty. Select inventory to begin sale.</p>`;
        summarySubtotal.innerText = "$0.00";
        summaryTax.innerText = "$0.00";
        summaryTotal.innerText = "$0.00";
        checkoutBtn.disabled = true;
        return;
    }

    cartItemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const cartItemEl = document.createElement("div");
        cartItemEl.className = "cart-item";
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span>$${item.price.toFixed(2)} &times; ${item.qty}</span>
            </div>
            <div class="cart-item-actions">
                <button class="cart-qty-btn" onclick="changeQty(${item.id}, -1)">&minus;</button>
                <span class="cart-item-qty">${item.qty}</span>
                <button class="cart-qty-btn" onclick="changeQty(${item.id}, 1)">&plus;</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemEl);
    });

    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    summarySubtotal.innerText = `$${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    summaryTax.innerText = `$${tax.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    summaryTotal.innerText = `$${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    checkoutBtn.disabled = false;
}

// 4. Receipt Generator & Modal
checkoutBtn.addEventListener("click", () => {
    const receiptItems = document.getElementById("receiptItems");
    const receiptTotals = document.getElementById("receiptTotals");
    const paymentMethod = document.getElementById("paymentMethod").value;

    document.getElementById("receiptDate").innerText = new Date().toLocaleString();
    document.getElementById("receiptId").innerText = "INV-" + Math.floor(100000 + Math.random() * 900000);

    receiptItems.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        const lineTotal = item.price * item.qty;
        subtotal += lineTotal;

        const row = document.createElement("div");
        row.className = "receipt-item-row";
        row.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>$${lineTotal.toFixed(2)}</span>
        `;
        receiptItems.appendChild(row);
    });

    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + tax;

    receiptTotals.innerHTML = `
        <div class="receipt-totals-row"><span>Subtotal:</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="receipt-totals-row"><span>Luxury Tax (7.5%):</span><span>$${tax.toFixed(2)}</span></div>
        <div class="receipt-totals-row receipt-grand-total"><span>Total Paid:</span><span>$${grandTotal.toFixed(2)}</span></div>
        <div class="receipt-totals-row" style="margin-top: 4px; color: #64748b;"><span>Tender:</span><span>${paymentMethod}</span></div>
    `;

    receiptModal.style.display = "flex";
});

closeReceiptBtn.addEventListener("click", () => {
    receiptModal.style.display = "none";
    cart = [];
    updateCartUI();
});

// Initial Render
renderProducts(inventory);