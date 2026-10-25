/* =====================================================
   ADORE'S PET - CART.JS (Cart Management Logic)
===================================================== */

function addToCart(id){
    if(vacationMode){ showCustomAlert("শপ বর্তমানে বন্ধ আছে।"); return; }
    const p = products.find(x => String(x.id) === String(id));
    if(!p || p.stock <= 0){ showCustomAlert("পণ্যটি স্টকে নেই।"); return; }
    let item = cart.find(x => String(x.id) === String(id));
    if(item){
        if(item.qty >= p.stock){ showCustomAlert("সর্বোচ্চ স্টক পার হয়ে গেছে।"); return; }
        item.qty++;
    } else { cart.push({ id: String(id), qty: 1 }); }
    
    saveCart();
    if(typeof updateCartBadge === "function") updateCartBadge();
    
    showCustomAlert("আপনার প্রোডাক্টটি কার্টের মধ্যে সফলভাবে অ্যাড করা হয়েছে। 🛒");
}

function updateCartBadge(){
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById("cartCount");
    if(badge){ badge.innerText = count; badge.style.display = count > 0 ? "flex" : "none"; }
}

function openCartModal(){
    const container = document.getElementById("cartItemsContainer");
    let subtotal = 0;
    if(!container) return;

    if(cart.length === 0){
        container.innerHTML = `<p style="text-align:center; padding:30px; color:#64748b;">আপনার কার্ট খালি রয়েছে।</p>`;
    } else {
        container.innerHTML = cart.map(item => {
            const p = products.find(x => String(x.id) === String(item.id));
            if(!p) return "";
            const price = (p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price) ? p.discountPrice : p.price;
            subtotal += price * item.qty;
            const img = p.images?.[0] || APP_CONSTANTS.DEFAULT_PRODUCT_IMG;
            return `
                <div style="display:flex; gap:12px; padding:10px 0; border-bottom:1px solid #f1f5f9; align-items:center;">
                    <img src="${img}" style="width:55px; height:55px; object-fit:cover; border-radius:8px;" alt="">
                    <div style="flex:1;">
                        <div style="font-weight:700; font-size:13.5px;">${escapeHTML(p.name)}</div>
                        <div style="color:var(--teal); font-weight:800; font-size:13px; margin:2px 0;">${formatCurrency(price * item.qty)}</div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <button onclick="changeCartQty('${p.id}', -1)" style="padding:2px 8px; cursor:pointer;">-</button>
                            <span style="font-weight:800; font-size:13px;">${item.qty}</span>
                            <button onclick="changeCartQty('${p.id}', 1)" style="padding:2px 8px; cursor:pointer;">+</button>
                            <button onclick="removeFromCart('${p.id}')" style="background:#fee2e2; color:#ef4444; border:none; padding:3px 6px; border-radius:6px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }
    const subtotalEl = document.getElementById("cartSubtotalText");
    if(subtotalEl) subtotalEl.innerText = subtotal;
    document.getElementById("cartStepModal")?.classList.add("show");
}

function closeCartModal(){ document.getElementById("cartStepModal")?.classList.remove("show"); }

function changeCartQty(id, chg){
    let item = cart.find(x => String(x.id) === String(id));
    let p = products.find(x => String(x.id) === String(id));
    if(!item || !p) return;
    item.qty += chg;
    if(item.qty <= 0) cart = cart.filter(x => String(x.id) !== String(id));
    else if(item.qty > p.stock) item.qty = p.stock;
    saveCart();
    openCartModal();
    updateCartBadge();
}

function removeFromCart(id){
    cart = cart.filter(x => String(x.id) !== String(id));
    saveCart();
    openCartModal();
    updateCartBadge();
}
