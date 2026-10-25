/* =====================================================
   ADORE'S PET - SHOP.JS (Complete, Fixed & Optimized)
===================================================== */

let cart = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.CART, []);
let currentCategory = 'All';

document.addEventListener("DOMContentLoaded", () => {
    loadProductsFromStorage();
    renderShopProducts();
    updateCartCount();
    setupAdminTrigger();
});

function loadProductsFromStorage(){
    const stored = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, null);
    if(stored && Array.isArray(stored) && stored.length > 0){
        products = stored;
    } else {
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
    }
}

function renderShopProducts(filterCat = 'All', searchQuery = ''){
    currentCategory = filterCat;
    const container = document.getElementById("shopProductsContainer");
    if(!container) return;

    container.innerHTML = "";

    let filtered = products;

    if(filterCat !== 'All'){
        filtered = filtered.filter(p => (p.category || '').toLowerCase() === filterCat.toLowerCase());
    }

    if(searchQuery.trim() !== ''){
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(q));
    }

    if(filtered.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#64748b; padding:30px; grid-column: 1 / -1;">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>`;
        return;
    }

    filtered.forEach(p => {
        const price = (p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price) ? p.discountPrice : p.price;
        const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;

        const card = document.createElement("div");
        card.style.cssText = "background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:10px; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 2px 8px rgba(0,0,0,0.02);";
        card.innerHTML = `
            <div>
                <div style="position:relative; width:100%; height:130px; border-radius:8px; overflow:hidden; background:#f1f5f9; margin-bottom:8px;">
                    <img src="${p.image || (p.images && p.images[0]) || ''}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://via.placeholder.com/300'">
                    ${hasDiscount ? `<span style="position:absolute; top:6px; left:6px; background:#ef4444; color:#fff; font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px;">ছাড়</span>` : ''}
                </div>
                <h4 style="font-size:13px; font-weight:800; color:#1e293b; margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.name}</h4>
                <div style="font-size:11.5px; color:#64748b; margin-bottom:8px;">স্টক: <b>${p.stock} টি</b></div>
            </div>
            <div>
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                    <span style="font-size:14px; font-weight:900; color:#00897b;">৳${price}</span>
                    ${hasDiscount ? `<span style="font-size:11px; color:#94a3b8; text-decoration:line-through;">৳${p.price}</span>` : ''}
                </div>
                <button onclick="addToCart('${p.id}')" style="width:100%; background:#00897b; color:#fff; border:none; padding:8px; border-radius:8px; font-size:12px; font-weight:800; cursor:pointer;"><i class="fa-solid fa-cart-plus"></i> কার্টে যোগ করুন</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterCategory(cat){
    renderShopProducts(cat);
}

function searchProducts(input){
    renderShopProducts(currentCategory, input.value);
}

function addToCart(productId){
    const p = products.find(x => String(x.id) === String(productId));
    if(!p){
        alert("প্রোডাক্ট পাওয়া যায়নি!");
        return;
    }

    if(p.stock <= 0){
        alert("দুঃখিত, প্রোডাক্টটি বর্তমানে স্টকআউট!");
        return;
    }

    const existing = cart.find(x => String(x.id) === String(productId));
    if(existing){
        if(existing.qty < p.stock){
            existing.qty++;
        } else {
            alert("স্টকে আর প্রোডাক্ট নেই!");
            return;
        }
    } else {
        cart.push({ id: p.id, qty: 1 });
    }

    saveCart();
    updateCartCount();
    alert("প্রোডাক্টটি কার্টে যোগ করা হয়েছে! ✅");
}

function saveCart(){
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.CART, cart);
}

function updateCartCount(){
    const badge = document.getElementById("cartCountBadge");
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if(badge){
        badge.innerText = totalQty;
        badge.style.display = totalQty > 0 ? "inline-block" : "none";
    }
}

function openCartModal(){
    renderCartItems();
    const modal = document.getElementById("cartModal");
    if(modal) modal.classList.add("show");
}

function closeCartModal(){
    const modal = document.getElementById("cartModal");
    if(modal) modal.classList.remove("show");
}

function renderCartItems(){
    const container = document.getElementById("cartItemsList");
    const subtotalElem = document.getElementById("cartSubtotalText");
    if(!container) return;

    container.innerHTML = "";
    let subtotal = 0;

    if(cart.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#64748b; padding:20px;">আপনার কার্ট খালি রয়েছে।</p>`;
        if(subtotalElem) subtotalElem.innerText = "0";
        return;
    }

    cart.forEach(item => {
        const p = products.find(x => String(x.id) === String(item.id));
        if(p){
            const price = (p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price) ? p.discountPrice : p.price;
            subtotal += price * item.qty;

            const div = document.createElement("div");
            div.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:10px; border-radius:10px; margin-bottom:8px;";
            div.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px;">
                    <img src="${p.image || ''}" style="width:40px; height:40px; object-fit:cover; border-radius:6px;">
                    <div>
                        <h4 style="font-size:12px; font-weight:800; color:#1e293b;">${p.name}</h4>
                        <span style="font-size:11px; color:#00897b; font-weight:700;">৳${price} x ${item.qty}</span>
                    </div>
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                    <button onclick="changeQty('${p.id}', 1)" style="background:#e2e8f0; border:none; width:22px; height:22px; border-radius:4px; font-weight:bold; cursor:pointer;">+</button>
                    <button onclick="changeQty('${p.id}', -1)" style="background:#e2e8f0; border:none; width:22px; height:22px; border-radius:4px; font-weight:bold; cursor:pointer;">-</button>
                    <button onclick="removeFromCart('${p.id}')" style="background:#fee2e2; color:#dc2626; border:none; width:22px; height:22px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
            container.appendChild(div);
        }
    });

    if(subtotalElem) subtotalElem.innerText = subtotal;
}

function changeQty(productId, delta){
    const item = cart.find(x => String(x.id) === String(productId));
    const p = products.find(x => String(x.id) === String(productId));
    if(item && p){
        item.qty += delta;
        if(item.qty <= 0){
            cart = cart.filter(x => String(x.id) !== String(productId));
        } else if(item.qty > p.stock){
            item.qty = p.stock;
            alert("স্টক সীমিত!");
        }
        saveCart();
        updateCartCount();
        renderCartItems();
    }
}

function removeFromCart(productId){
    cart = cart.filter(x => String(x.id) !== String(productId));
    saveCart();
    updateCartCount();
    renderCartItems();
}

function proceedToCheckout(){
    if(!cart || cart.length === 0){
        alert("আপনার কার্ট খালি রয়েছে!");
        return;
    }
    window.location.href = "checkout.html";
}

function setupAdminTrigger(){
    let clickCount = 0;
    const brand = document.querySelector(".brand-box");
    if(brand){
        brand.addEventListener("click", () => {
            clickCount++;
            if(clickCount >= 5){
                clickCount = 0;
                if(typeof openAdminModal === 'function') openAdminModal();
            }
        });
    }
}
