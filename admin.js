/* =====================================================
   ADORE'S PET - ADMIN.JS (Admin Dashboard Logic)
===================================================== */

try {
    if(typeof emailjs !== 'undefined'){
        emailjs.init({ publicKey: APP_CONFIG.EMAILJS_PUBLIC_KEY });
    }
} catch(e) {}

let adminProducts = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, defaultProducts);
let adminOrders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.MY_ORDERS, []);
let adminVacationMode = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.VACATION_MODE, false);
let adminPassword = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ADMIN_PASS, APP_CONFIG.DEFAULT_ADMIN_PASS);

function saveAdminProducts(){
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, adminProducts);
}
function saveAdminOrders(){
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.MY_ORDERS, adminOrders);
}

function showAdminAlert(msg){
    const txt = document.getElementById("adminAlertText");
    const modal = document.getElementById("adminCustomAlert");
    if(txt && modal){
        txt.innerHTML = msg;
        modal.classList.add("show");
    } else {
        alert(msg);
    }
}
function closeAdminAlert(){
    document.getElementById("adminCustomAlert")?.classList.remove("show");
}

function logoutToShop(){
    window.location.replace("index.html");
}

function saveWelcomePopupData(){
    try {
        const popupImg = document.getElementById("adminWelcomePopupImg")?.value.trim() || "";
        const popupLink = document.getElementById("adminWelcomePopupLink")?.value.trim() || "";
        
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.POPUP_IMG, popupImg);
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.POPUP_LINK, popupLink);
        
        showAdminAlert("ওয়েলকাম পপআপ ব্যানার সফলভাবে সেভ করা হয়েছে! 🖼️");
    } catch(e) {
        showAdminAlert("সেভ করতে সমস্যা হয়েছে: " + e.message);
    }
}

function saveAnnouncementData(){
    try {
        const noticeText = document.getElementById("adminNoticeInput")?.value.trim() || "";
        const ytLink = document.getElementById("adminYoutubeInput")?.value.trim() || "";
        
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.NOTICE_TEXT, noticeText);
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.YOUTUBE_LINK, ytLink);
        
        showAdminAlert("নোটিশ এবং ইউটিউব লিংক সফলভাবে আপডেট করা হয়েছে! 📢");
    } catch(e) {
        showAdminAlert("সেভ করতে সমস্যা হয়েছে: " + e.message);
    }
}

function toggleVacationMode(){
    const checkbox = document.getElementById("adminVacationCheckbox");
    if(checkbox){
        adminVacationMode = checkbox.checked;
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.VACATION_MODE, adminVacationMode);
        showAdminAlert(adminVacationMode ? "ভ্যাকেশন মোড সফলভাবে চালু করা হয়েছে! 🌴" : "ভ্যাকেশন মোড বন্ধ করা হয়েছে।");
    }
}

function changeAdminPassword(){
    const newPass = document.getElementById("newAdminPasswordInput")?.value.trim();
    if(!newPass){ showAdminAlert("নতুন পাসওয়ার্ড লিখুন।"); return; }
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.ADMIN_PASS, newPass);
    adminPassword = newPass;
    document.getElementById("newAdminPasswordInput").value = "";
    showAdminAlert("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে! 🔒");
}

function renderAdminProducts(){
    const container = document.getElementById("adminProducts");
    if(!container) return;
    if(adminProducts.length === 0){ container.innerHTML = "কোনো পণ্য নেই।"; return; }
    container.innerHTML = adminProducts.map(p => `
        <div class="admin-product-card" style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px; border-radius:10px; margin-bottom:8px; border:1px solid #e2e8f0;">
            <div style="display:flex; gap:10px; align-items:center; min-width:0;">
                <img src="${p.images?.[0] || APP_CONSTANTS.DEFAULT_PRODUCT_IMG}" style="width:45px; height:45px; object-fit:cover; border-radius:8px;" alt="">
                <div style="min-width:0;">
                    <div style="font-weight:800; font-size:13.5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(p.name)}</div>
                    <div style="font-size:11.5px; color:#64748b;">${formatCurrency(p.price)} | Stock: ${p.stock}</div>
                </div>
            </div>
            <div style="display:flex; gap:6px;">
                <button onclick="openEditModal('${p.id}')" style="background:#2563eb; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteProduct('${p.id}')" style="background:#ef4444; color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join("");
}

function addProduct(){
    const name = document.getElementById("productName")?.value.trim();
    const price = Number(document.getElementById("productPrice")?.value);
    const disc = document.getElementById("productDiscountPrice")?.value.trim() ? Number(document.getElementById("productDiscountPrice")?.value) : null;
    const stock = Number(document.getElementById("productStock")?.value);
    
    const ageNum = document.getElementById("productAgeNum")?.value.temp || document.getElementById("productAgeNum")?.value.trim();
    const ageUnit = document.getElementById("productAgeUnit")?.value;
    const age = ageNum ? `${ageNum} ${ageUnit}` : "";

    const color = document.getElementById("productColor")?.value.trim();
    const category = document.getElementById("productCategory")?.value;
    const rating = document.getElementById("productRating")?.value.trim() || "4.8";
    const desc = document.getElementById("productDesc")?.value.trim();
    const u1 = document.getElementById("imageUrl1")?.value.trim();
    const u2 = document.getElementById("imageUrl2")?.value.trim();
    const u3 = document.getElementById("imageUrl3")?.value.trim();
    const vUrl = document.getElementById("productVideoUrlInput")?.value.trim();

    let imgs = [u1, u2, u3].filter(Boolean);
    if(imgs.length === 0) imgs = [APP_CONSTANTS.DEFAULT_PRODUCT_IMG];

    if(!name || price <= 0){ showAdminAlert("সঠিক নাম ও দাম দিন।"); return; }

    adminProducts.unshift({
        id: String(Date.now()), name, price, discountPrice: disc, stock, age, color, category, rating, desc, images: imgs, videoUrl: vUrl
    });

    saveAdminProducts();
    renderAdminProducts();
    showAdminAlert("পণ্য সফলভাবে যোগ করা হয়েছে! 🎉");
}

function deleteProduct(id){
    adminProducts = adminProducts.filter(x => String(x.id) !== String(id));
    saveAdminProducts();
    renderAdminProducts();
    showAdminAlert("পণ্যটি সফলভাবে মুছে ফেলা হয়েছে।");
}

function openEditModal(id){
    const p = adminProducts.find(x => String(x.id) === String(id));
    if(!p) return;
    
    document.getElementById("editProductId").value = p.id;
    
    const idField = document.getElementById("displayEditProductId");
    if(idField) idField.value = p.id;

    document.getElementById("editProductName").value = p.name;
    document.getElementById("editProductPrice").value = p.price;
    document.getElementById("editProductDiscountPrice").value = p.discountPrice !== null ? p.discountPrice : "";
    document.getElementById("editProductStock").value = p.stock;
    
    if(p.age){
        let parts = p.age.split(" ");
        document.getElementById("editProductAgeNum").value = parts[0] || "";
        if(parts[1]) document.getElementById("editProductAgeUnit").value = parts[1];
    } else {
        document.getElementById("editProductAgeNum").value = "";
    }
    
    const prevImg = document.getElementById("editProductPreviewImg");
    if(prevImg) prevImg.src = p.images?.[0] || APP_CONSTANTS.DEFAULT_PRODUCT_IMG;

    document.getElementById("editProductImgUrl").value = p.images?.[0] || "";
    document.getElementById("editProductVideoUrl").value = p.videoUrl || "";
    document.getElementById("editModal")?.classList.add("show");
}

function closeEditModal(){ document.getElementById("editModal")?.classList.remove("show"); }

function saveEditProduct(){
    const id = document.getElementById("editProductId")?.value;
    const p = adminProducts.find(x => String(x.id) === String(id));
    if(!p) return;
    p.name = document.getElementById("editProductName")?.value.trim();
    p.price = Number(document.getElementById("editProductPrice")?.value);
    p.discountPrice = document.getElementById("editProductDiscountPrice")?.value.trim() ? Number(document.getElementById("editProductDiscountPrice")?.value) : null;
    p.stock = Number(document.getElementById("editProductStock")?.value);
    
    const ageNum = document.getElementById("editProductAgeNum")?.value.trim();
    const ageUnit = document.getElementById("editProductAgeUnit")?.value;
    p.age = ageNum ? `${ageNum} ${ageUnit}` : "";

    const u = document.getElementById("editProductImgUrl")?.value.trim();
    if(u) p.images = [u];
    p.videoUrl = document.getElementById("editProductVideoUrl")?.value.trim();

    saveAdminProducts();
    renderAdminProducts();
    closeEditModal();
    showAdminAlert("পণ্যটি সফলভাবে সংশোধন করা হয়েছে! ✨");
}

/* ORDER TABS & POPUP MANAGEMENT */
function updateOrderCounts(){
    const pending = adminOrders.filter(o => !o.status || o.status === 'pending');
    const completed = adminOrders.filter(o => o.status === 'completed');
    const cancelled = adminOrders.filter(o => o.status === 'cancelled');

    if(document.getElementById("countPending")) document.getElementById("countPending").innerText = pending.length;
    if(document.getElementById("countCompleted")) document.getElementById("countCompleted").innerText = completed.length;
    if(document.getElementById("countCancelled")) document.getElementById("countCancelled").innerText = cancelled.length;
}

function openOrderModal(status){
    const container = document.getElementById("adminModalOrdersContainer");
    const title = document.getElementById("modalOrderTitle");
    if(!container) return;

    ['pending', 'completed', 'cancelled'].forEach(s => {
        const btn = document.getElementById("tabBtn" + s.charAt(0).toUpperCase() + s.slice(1));
        if(btn) btn.classList.toggle("active", s === status);
    });

    let filtered = adminOrders.filter(o => {
        if(status === 'pending') return !o.status || o.status === 'pending';
        return o.status === status;
    });

    if(title) {
        let titleName = status === 'pending' ? 'পেন্ডিং অর্ডারসমূহ' : (status === 'completed' ? 'কমপ্লিট অর্ডারসমূহ' : 'ক্যানসেলড অর্ডারসমূহ');
        title.innerText = titleName + ` (${filtered.length}টি)`;
    }

    if(filtered.length === 0){
        container.innerHTML = `<p style="text-align:center; padding:30px; color:#64748b;">এই ক্যাটাগরিতে কোনো অর্ডার নেই।</p>`;
    } else {
        container.innerHTML = filtered.map(o => `
            <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:12px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; font-weight:800; color:#00897b; margin-bottom:6px;">
                    <span>${o.id}</span>
                    <span>${formatCurrency(o.total)}</span>
                </div>
                <div style="font-size:12.5px; color:#334155; line-height:1.5; margin-bottom:10px;">
                    <b>নাম:</b> ${escapeHTML(o.name)} (${o.phone})<br>
                    <b>ঠিকানা:</b> ${escapeHTML(o.address)}<br>
                    <b>TrxID:</b> ${escapeHTML(o.trxId || 'N/A')}<br>
                    <div style="margin-top:4px; background:#fff; padding:6px; border-radius:8px; border:1px solid #e2e8f0;">
                        <b>পণ্যসমূহ:</b><br>${o.itemsText ? o.itemsText.replace(/\n/g, '<br>') : 'তথ্য নেই'}
                    </div>
                </div>
                <div style="display:flex; gap:6px;">
                    <button onclick="updateOrderStatus('${o.id}', 'pending')" style="flex:1; padding:6px; font-size:11px; font-weight:700; border:none; border-radius:6px; background:${(!o.status || o.status==='pending')?'#00897b':'#e2e8f0'}; color:${(!o.status || o.status==='pending')?'#fff':'#334155'}; cursor:pointer;">Pending</button>
                    <button onclick="updateOrderStatus('${o.id}', 'completed')" style="flex:1; padding:6px; font-size:11px; font-weight:700; border:none; border-radius:6px; background:${o.status==='completed'?'#10b981':'#e2e8f0'}; color:${o.status==='completed'?'#fff':'#334155'}; cursor:pointer;">Complete</button>
                    <button onclick="updateOrderStatus('${o.id}', 'cancelled')" style="flex:1; padding:6px; font-size:11px; font-weight:700; border:none; border-radius:6px; background:${o.status==='cancelled'?'#ef4444':'#e2e8f0'}; color:${o.status==='cancelled'?'#fff':'#334155'}; cursor:pointer;">Cancel</button>
                </div>
            </div>
        `).join("");
    }

    document.getElementById("adminOrderModal")?.classList.add("show");
}

function closeOrderModal(){ document.getElementById("adminOrderModal")?.classList.remove("show"); }

function updateOrderStatus(orderId, newStatus){
    let order = adminOrders.find(o => o.id === orderId);
    if(order){
        order.status = newStatus;
        if(newStatus === 'cancelled'){
            order.cancelledByAdmin = true;
        }
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.MY_ORDERS, adminOrders);
        updateOrderCounts();
        openOrderModal(newStatus);
    }
}

/* Run initial admin functions */
try {
    renderAdminProducts();
    updateOrderCounts();
    const cb = document.getElementById("adminVacationCheckbox");
    if(cb) cb.checked = adminVacationMode;

    const savedNotice = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.NOTICE_TEXT, "");
    const savedYt = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.YOUTUBE_LINK, "");
    if(document.getElementById("adminNoticeInput")) document.getElementById("adminNoticeInput").value = savedNotice;
    if(document.getElementById("adminYoutubeInput")) document.getElementById("adminYoutubeInput").value = savedYt;

    const savedPopupImg = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.POPUP_IMG, "");
    const savedPopupLink = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.POPUP_LINK, "");
    if(document.getElementById("adminWelcomePopupImg")) document.getElementById("adminWelcomePopupImg").value = savedPopupImg;
    if(document.getElementById("adminWelcomePopupLink")) document.getElementById("adminWelcomePopupLink").value = savedPopupLink;
} catch(e) {
    console.error(e);
}
