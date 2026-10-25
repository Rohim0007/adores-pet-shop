/* =====================================================
   ADORE'S PET - CART.JS (Complete & Bug-Free)
===================================================== */

let cart = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.CART, []);

function saveCart() {
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.CART, cart);
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById("cartCount");
    if(!badge) return;
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if(totalQty > 0){
        badge.innerText = totalQty;
        badge.style.display = "flex";
    } else {
        badge.style.display = "none";
    }
}

function addToCart(productId){
    const p = products.find(x => String(x.id) === String(productId));
    if(!p){
        alert("প্রোডাক্ট পাওয়া যায়নি!");
        return;
    }
    if(p.stock <= 0){
        alert("দুঃখিত, এই প্রোডাক্টটি বর্তমানে স্টক আউট!");
        return;
    }

    const existing = cart.find(item => String(item.id) === String(productId));
    if(existing){
        if(existing.qty < p.stock){
            existing.qty++;
        } else {
            alert("স্টকে আর পর্যাপ্ত প্রোডাক্ট নেই!");
            return;
        }
    } else {
        cart.push({ id: p.id, qty: 1 });
    }
    saveCart();
    showCustomAlert(`"${p.name}" সফলভাবে কার্টে যোগ করা হয়েছে! 🛒`);
}

function openCartModal(){
    renderCartItems();
    const modal = document.getElementById("cartStepModal");
    if(modal) modal.classList.add("show");
}

function closeCartModal(){
    const modal = document.getElementById("cartStepModal");
    if(modal) modal.classList.remove("show");
}

function renderCartItems(){
    const container = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotalText");
    if(!container) return;

    container.innerHTML = "";
    if(cart.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#64748b; padding:20px;">আপনার কার্টটি খালি রয়েছে।</p>`;
        if(subtotalEl) subtotalEl.innerText = "0";
        return;
    }

    let subtotal = 0;
    cart.forEach(item => {
        const p = products.find(x => String(x.id) === String(item.id));
        if(!p) return;
        const price = (p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price) ? p.discountPrice : p.price;
        subtotal += price * item.qty;

        const div = document.createElement("div");
        div.style.cssText = "display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;";
        div.innerHTML = `
            <div style="display:flex; gap:10px; align-items:center;">
                <img src="${p.image || (p.images && p.images[0]) || ''}" style="width:45px; height:45px; object-fit:cover; border-radius:8px;">
                <div>
                    <h4 style="font-size:13px; font-weight:800; color:#1e293b;">${p.name}</h4>
                    <span style="font-size:12px; color:#00897b; font-weight:700;">৳${price} × ${item.qty}</span>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
                <button onclick="decreaseQty('${p.id}')" style="background:#e2e8f0; border:none; width:26px; height:26px; border-radius:6px; font-weight:bold; cursor:pointer;">-</button>
                <span style="font-size:13px; font-weight:800; width:20px; text-align:center;">${item.qty}</span>
                <button onclick="increaseQty('${p.id}')" style="background:#e2e8f0; border:none; width:26px; height:26px; border-radius:6px; font-weight:bold; cursor:pointer;">+</button>
                <button onclick="removeFromCart('${p.id}')" style="background:#fee2e2; color:#dc2626; border:none; width:26px; height:26px; border-radius:6px; cursor:pointer; margin-left:4px;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        container.appendChild(div);
    });

    if(subtotalEl) subtotalEl.innerText = subtotal;
}

function increaseQty(id){
    const item = cart.find(x => String(x.id) === String(id));
    const p = products.find(x => String(x.id) === String(id));
    if(item && p && item.qty < p.stock){
        item.qty++;
        saveCart();
        renderCartItems();
    } else {
        alert("স্টক সীমিত!");
    }
}

function decreaseQty(id){
    const item = cart.find(x => String(x.id) === String(id));
    if(item){
        item.qty--;
        if(item.qty <= 0){
            cart = cart.filter(x => String(x.id) !== String(id));
        }
        saveCart();
        renderCartItems();
    }
}

function removeFromCart(id){
    cart = cart.filter(x => String(x.id) !== String(id));
    saveCart();
    renderCartItems();
}

function proceedToCheckout(){
    if(cart.length === 0){
        alert("আপনার কার্ট খালি!");
        return;
    }
    window.location.href = "checkout.html";
}

updateCartBadge();
