/* =====================================================
   ADORE'S PET - SHOP.JS (Customer Shop, Cart & Track Order)
===================================================== */

let products = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, defaultProducts);
let cart = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.CART, []);
let myOrders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.MY_ORDERS, []);
let vacationMode = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.VACATION_MODE, false);
let currentAdminPassword = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ADMIN_PASS, APP_CONFIG.DEFAULT_ADMIN_PASS);

let currentCategory = "";
let activeSelectedProductId = null;

function saveProducts(){
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
}
function saveCart(){
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.CART, cart);
}
function saveMyOrders(){
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.MY_ORDERS, myOrders);
}

function openSupportModal(){ document.getElementById("supportModal")?.classList.add("show"); }
function closeSupportModal(){ document.getElementById("supportModal")?.classList.remove("show"); }

function forgotPassword(){
    showCustomAlert("আপনার বর্তমান অ্যাডমিন পাসওয়ার্ড হলো: " + currentAdminPassword);
}

function checkVacationStatus(){
    const vBox = document.getElementById("vacationBoxContainer");
    const nContent = document.getElementById("normalHomeContent");
    const bottomNav = document.querySelector(".bottom-nav");
    
    if(vBox && nContent){
        vBox.style.display = vacationMode ? "block" : "none";
        nContent.style.display = vacationMode ? "none" : "block";
    }
    if(bottomNav){
        bottomNav.style.display = vacationMode ? "none" : "flex";
    }
}

function renderAnnouncement(){
    const annBox = document.getElementById("announcementBannerBox");
    const annTxt = document.getElementById("announcementText");
    
    const noticeText = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.NOTICE_TEXT, "");
    const ytLink = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.YOUTUBE_LINK, "");
    
    if(annBox && annTxt){
        if(noticeText !== "" || ytLink !== ""){
            let htmlContent = "";
            if(noticeText !== ""){
                htmlContent += `<div>${escapeHTML(noticeText)}</div>`;
            }
            if(ytLink !== ""){
                htmlContent += `
                    <div style="margin-top:${noticeText !== '' ? '6px' : '0'};">
                        <a href="${escapeHTML(ytLink)}" target="_blank" style="display:inline-flex; align-items:center; gap:6px; background:#ffffff; color:#dc2626; padding:6px 12px; border-radius:8px; font-size:12.5px; font-weight:800; text-decoration:none; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                            <i class="fa-solid fa-circle-play" style="font-size:15px;"></i> 🔥 Watch New Video On YouTube
                        </a>
                    </div>
                `;
            }
            annTxt.innerHTML = htmlContent;
            annBox.style.display = "flex";
        } else {
            annBox.style.display = "none";
        }
    }
}

function checkWelcomePopup(){
    const popupImg = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.POPUP_IMG, "");
    const modal = document.getElementById("welcomePopupModal");
    const imgEl = document.getElementById("welcomePopupImg");
    const alreadyShown = sessionStorage.getItem("welcomePopupClosed");

    if(modal && imgEl && popupImg.trim() !== "" && !alreadyShown){
        imgEl.src = popupImg;
        modal.classList.add("show");
    }
}

let popupTargetProductId = "";
function checkWelcomePopupData(){
    popupTargetProductId = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.POPUP_LINK, "");
}

function handlePopupImageClick(){
    closeWelcomePopup();
    if(popupTargetProductId.trim() !== ""){
        openProductModal(popupTargetProductId.trim());
    }
}

function closeWelcomePopup(){
    const modal = document.getElementById("welcomePopupModal");
    if(modal){
        modal.classList.remove("show");
        sessionStorage.setItem("welcomePopupClosed", "true");
    }
}

function showCustomAlert(msg){
    const alertMsg = document.getElementById("customAlertMessage");
    const alertModal = document.getElementById("customAlertModal");
    const alertIconBox = alertModal?.querySelector(".thankyou-icon");
    const alertTitle = alertModal?.querySelector("h2");
    
    if(alertMsg && alertModal){
        alertMsg.innerText = msg;
        if(alertIconBox) {
            alertIconBox.style.background = "#e6f4ea";
            alertIconBox.style.color = "#10b981";
            alertIconBox.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        }
        if(alertTitle) alertTitle.innerText = "সফল!";
        alertModal.classList.add("show");
    }
}
function closeCustomAlert(){ document.getElementById("customAlertModal")?.classList.remove("show"); }

function showSuccessPopup(msg){
    const popupText = document.getElementById("successPopupText");
    const thankyouModal = document.getElementById("thankyouModal");
    if(popupText && thankyouModal){
        popupText.innerHTML = msg;
        thankyouModal.classList.add("show");
    }
}
function closeThankYouModal(){ document.getElementById("thankyouModal")?.classList.remove("show"); }

function trackMyOrderFromSuccess(){
    closeThankYouModal();
    if(typeof openOrdersModal === "function") openOrdersModal();
}

function goHome(){
    currentCategory = "";
    const searchInput = document.getElementById("searchInput");
    if(searchInput) searchInput.value = "";
    document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
    renderProducts();
}

function selectCategory(cat, btn){
    currentCategory = cat;
    document.querySelectorAll(".chip-btn").forEach(b => b.classList.remove("active"));
    if(btn) btn.classList.add("active");
    const searchInput = document.getElementById("searchInput");
    if(searchInput) searchInput.value = "";
    renderProducts();
}

function renderProducts(){
    const grid = document.getElementById("productsGrid");
    const title = document.getElementById("productsTitle");
    const search = document.getElementById("searchInput")?.value.trim().toLowerCase() || "";

    if(!grid) return;

    let filtered = products;
    if(currentCategory){
        if(title) title.innerText = currentCategory + " Supplies";
        filtered = filtered.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    } else if(search){
        if(title) title.innerText = 'Search Results';
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
    } else {
        if(title) title.innerText = "জনপ্রিয় প্রোডাক্ট সমূহ";
    }

    if(filtered.length === 0){
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#64748b;">কোনো পণ্য পাওয়া যায়নি।</div>`;
        return;
    }

    grid.innerHTML = filtered.map(p => {
        const mainImg = p.images?.[0] || APP_CONSTANTS.DEFAULT_PRODUCT_IMG;
        const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
        const price = hasDiscount ? p.discountPrice : p.price;
        const stockCls = p.stock > 0 ? "stock-in" : "stock-out";
        const stockTxt = p.stock > 0 ? `Stock: ${p.stock} Pcs` : `Out of Stock`;

        return `
            <div class="product-card" onclick="openProductModal('${p.id}')">
                <div class="product-img-wrap">
                    <img src="${mainImg}" alt="${escapeHTML(p.name)}">
                    ${hasDiscount ? `<div class="discount-badge-tag">OFFER</div>` : ''}
                    <div class="rating-badge"><i class="fa-solid fa-star"></i> ${p.rating || '4.8'}</div>
                    ${p.color ? `<div class="color-badge">${escapeHTML(p.color)}</div>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-name">${escapeHTML(p.name)}</div>
                    ${p.age ? `<div class="age-pill-badge">Age: ${escapeHTML(p.age)}</div>` : ''}
                    <span class="stock-pill-badge ${stockCls}">${stockTxt}</span>
                    <div class="product-footer-row">
                        <div>
                            ${hasDiscount ? `<span class="old-price-strike">${formatCurrency(p.price)}</span>` : ''}
                            <span class="product-price ${hasDiscount ? 'discounted' : ''}">${formatCurrency(price)}</span>
                        </div>
                        <span class="view-details-tag">View Details</span>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function openProductModal(id){
    const p = products.find(x => String(x.id) === String(id));
    if(!p) return;
    activeSelectedProductId = p.id;

    document.getElementById("modalProdName").innerText = p.name;
    document.getElementById("modalProdDetails").innerText = p.desc || "বিবরণ নেই।";

    const hasDiscount = p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price;
    const price = hasDiscount ? p.discountPrice : p.price;
    document.getElementById("modalPriceContainer").innerHTML = hasDiscount ? 
        `<span style="font-size:12px; color:#94a3b8; text-decoration:line-through;">${formatCurrency(p.price)}</span><br><span style="font-size:22px; font-weight:900; color:#ef4444;">${formatCurrency(price)}</span>` :
        `<span style="font-size:22px; font-weight:900; color:var(--teal);">${formatCurrency(p.price)}</span>`;

    const stockBadge = document.getElementById("modalProdStock");
    stockBadge.className = "stock-pill-badge " + (p.stock > 0 ? "stock-in" : "stock-out");
    stockBadge.innerText = p.stock > 0 ? `Stock: ${p.stock} Pcs` : `Out of Stock`;

    const ageBadge = document.getElementById("modalProdAge");
    if(p.age){ ageBadge.style.display = "inline-flex"; ageBadge.innerText = `Age: ${p.age}`; } 
    else { ageBadge.style.display = "none"; }

    const vContainer = document.getElementById("modalVideoLinkContainer");
    const vAnchor = document.getElementById("modalVideoAnchor");
    if(p.videoUrl && p.videoUrl.trim() !== ""){
        vAnchor.href = p.videoUrl.trim();
        vContainer.style.display = "block";
    } else { if(vContainer) vContainer.style.display = "none"; }

    const mainImg = document.getElementById("modalMainImg");
    const thumbContainer = document.getElementById("modalThumbnails");
    if(thumbContainer) thumbContainer.innerHTML = "";
    let imgs = p.images?.filter(Boolean) || [APP_CONSTANTS.DEFAULT_PRODUCT_IMG];
    
    if(thumbContainer) thumbContainer.style.display = imgs.length > 1 ? "flex" : "none";
    if(mainImg) mainImg.src = imgs[0];

    imgs.forEach((src, idx) => {
        const thumb = document.createElement("img");
        thumb.src = src;
        thumb.style.cssText = "width:50px; height:50px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid " + (idx === 0 ? "var(--teal)" : "#cbd5e1");
        thumb.onclick = () => { if(mainImg) mainImg.src = src; };
        if(thumbContainer) thumbContainer.appendChild(thumb);
    });

    document.getElementById("productDetailModal")?.classList.add("show");
}

function closeProductModal(){ document.getElementById("productDetailModal")?.classList.remove("show"); }

function addModalProductToCart(){
    if(vacationMode){ showCustomAlert("শপ বর্তমানে বন্ধ আছে।"); return; }
    if(activeSelectedProductId){ 
        if(typeof addToCart === "function") addToCart(activeSelectedProductId); 
        closeProductModal(); 
    }
}

function searchProducts(){ renderProducts(); }

let scCount = 0;
function handleSecretClick(){
    scCount++;
    if(scCount === 3){ scCount = 0; openAdminLoginModal(); }
    setTimeout(() => { scCount = 0; }, 1000);
}
function openAdminLoginModal(){ document.getElementById("adminLoginModal")?.classList.add("show"); }
function closeAdminLoginModal(){ document.getElementById("adminLoginModal")?.classList.remove("show"); }

function submitAdminLogin(){
    const pass = document.getElementById("modalAdminPassword")?.value;
    if(pass === currentAdminPassword){
        window.location.replace("admin.html");
    } else { showCustomAlert("ভুল পাসওয়ার্ড!"); }
}

/* Run initial functions */
if(typeof updateCartBadge === "function") updateCartBadge();
renderProducts();
checkVacationStatus();
renderAnnouncement();
checkWelcomePopupData();
checkWelcomePopup();
