/* =====================================================
   ADORE'S PET - SHOP.JS
===================================================== */

let products = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, defaultProducts);
let currentCategory = "All";

// হোমপেজে প্রোডাক্ট রেন্ডার করা
function renderProducts(list = products){
    const grid = document.getElementById("productsGrid");
    if(!grid) return;
    
    grid.innerHTML = "";
    if(list.length === 0){
        grid.innerHTML = `<p style="grid-column: span 2; text-align:center; color:#64748b; padding:20px;">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>`;
        return;
    }

    list.forEach(p => {
        const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
        const displayPrice = hasDiscount ? p.discountPrice : p.price;
        const discountPercent = hasDiscount ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0;
        
        const card = document.createElement("div");
        card.className = "product-card";
        card.onclick = () => openProductModal(p.id);

        card.innerHTML = `
            <div class="product-img-wrap">
                <img src="${p.image || (p.images && p.images[0]) || ''}" alt="${p.name}">
                ${hasDiscount ? `<span class="discount-badge-tag">${discountPercent}% OFF</span>` : ''}
                <span class="rating-badge"><i class="fa-solid fa-star"></i> ${p.rating || '4.5'}</span>
            </div>
            <div class="product-info">
                <div>
                    <h4 class="product-name">${p.name}</h4>
                    ${p.age ? `<span class="age-pill-badge">বয়স: ${p.age}</span>` : ''}
                    <div>
                        <span class="stock-pill-badge ${p.stock > 0 ? 'stock-in' : 'stock-out'}">
                            ${p.stock > 0 ? `স্টক: ${p.stock} টি` : 'স্টক আউট'}
                        </span>
                    </div>
                </div>
                <div class="product-footer-row">
                    <div>
                        ${hasDiscount ? `<span class="old-price-strike">৳${p.price}</span>` : ''}
                        <span class="product-price ${hasDiscount ? 'discounted' : ''}">৳${displayPrice}</span>
                    </div>
                    <span class="view-details-tag">ভিউ ডিটেইলস</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ক্যাটাগরি ফিল্টার
function selectCategory(cat, btnEl){
    currentCategory = cat;
    document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
    if(btnEl) btnEl.classList.add("active");
    
    document.getElementById("productsTitle").innerText = `${cat} ক্যাটাগরির প্রোডাক্টসমূহ`;
    const filtered = products.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    renderProducts(filtered);
}

function goHome(){
    currentCategory = "All";
    document.getElementById("productsTitle").innerText = "জনপ্রিয় প্রোডাক্ট সমূহ";
    document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
    renderProducts(products);
}

// সার্চ ফাংশন
function searchProducts(){
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProducts(filtered);
}

// প্রোডাক্ট ডিটেইলস মডাল
function openProductModal(id){
    const p = products.find(x => String(x.id) === String(id));
    if(!p) return;

    window.selectedModalProduct = p;
    document.getElementById("modalProdName").innerText = p.name;
    document.getElementById("modalMainImg").src = p.image || (p.images && p.images[0]) || '';
    document.getElementById("modalProdDetails").innerText = p.details || "কোনো বিবরণ নেই।";
    
    const stockEl = document.getElementById("modalProdStock");
    stockEl.innerText = p.stock > 0 ? `Stock: ${p.stock} Pcs` : "Stock Out";
    stockEl.className = `stock-pill-badge ${p.stock > 0 ? 'stock-in' : 'stock-out'}`;

    const ageEl = document.getElementById("modalProdAge");
    if(p.age){
        ageEl.innerText = `Age: ${p.age}`;
        ageEl.style.display = "inline-block";
    } else {
        ageEl.style.display = "none";
    }

    const priceContainer = document.getElementById("modalPriceContainer");
    const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
    if(hasDiscount){
        priceContainer.innerHTML = `<span style="font-size:12px; color:#64748b; text-decoration:line-through; display:block;">৳${p.price}</span><span style="font-size:16px; font-weight:900; color:#ef4444;">৳${p.discountPrice}</span>`;
    } else {
        priceContainer.innerHTML = `<span style="font-size:16px; font-weight:900; color:#00897b;">৳${p.price}</span>`;
    }

    // থাম্বনেইল
    const thumbContainer = document.getElementById("modalThumbnails");
    thumbContainer.innerHTML = "";
    if(p.images && p.images.length > 1){
        p.images.forEach(img => {
            const tImg = document.createElement("img");
            tImg.src = img;
            tImg.style.cssText = "width:50px; height:50px; object-fit:cover; border-radius:6px; cursor:pointer; border:1px solid #cbd5e1;";
            tImg.onclick = () => { document.getElementById("modalMainImg").src = img; };
            thumbContainer.appendChild(tImg);
        });
    }

    document.getElementById("productDetailModal").classList.add("show");
}

function closeProductModal(){
    document.getElementById("productDetailModal").classList.remove("show");
}

function addModalProductToCart(){
    if(!window.selectedModalProduct) return;
    addToCart(window.selectedModalProduct.id);
    closeProductModal();
}

// সাপোর্ট মডাল
function openSupportModal(){ document.getElementById("supportModal").classList.add("show"); }
function closeSupportModal(){ document.getElementById("supportModal").classList.remove("show"); }

// ওয়েলকাম পপআপ ব্যানার হ্যান্ডলিং
function checkWelcomePopup(){
    const popupData = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.POPUP_BANNER, null);
    if(popupData && popupData.img){
        document.getElementById("welcomePopupImg").src = popupData.img;
        window.popupTargetProductId = popupData.prodId;
        document.getElementById("welcomePopupModal").classList.add("show");
    }
}
function closeWelcomePopup(){
    document.getElementById("welcomePopupModal").classList.remove("show");
}
function handlePopupImageClick(){
    if(window.popupTargetProductId){
        closeWelcomePopup();
        openProductModal(window.popupTargetProductId);
    } else {
        closeWelcomePopup();
    }
}

// ইনিশিয়ালাইজেশন
renderProducts();
checkWelcomePopup();
