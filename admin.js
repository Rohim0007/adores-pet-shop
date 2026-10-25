/* =====================================================
   ADORE'S PET - ADMIN.JS
===================================================== */

function openAdminModal() {
    const modal = document.getElementById("adminModal");
    if(modal) {
        modal.classList.add("show");
        renderAdminProducts();
        renderAdminOrders();
    }
}

function closeAdminModal() {
    const modal = document.getElementById("adminModal");
    if(modal) modal.classList.remove("show");
}

function renderAdminProducts() {
    const container = document.getElementById("adminProductsList");
    if(!container) return;

    container.innerHTML = "";
    if(products.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#64748b; padding:10px;">কোনো প্রোডাক্ট নেই।</p>`;
        return;
    }

    products.forEach(p => {
        const div = document.createElement("div");
        div.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:8px; margin-bottom:6px; font-size:12px;";
        div.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px;">
                <img src="${p.image || ''}" style="width:35px; height:35px; object-fit:cover; border-radius:4px;">
                <div>
                    <h4 style="font-weight:800; color:#1e293b; margin:0;">${p.name}</h4>
                    <span style="color:#00897b; font-weight:700;">৳${p.price} | স্টক: ${p.stock}</span>
                </div>
            </div>
            <div style="display:flex; gap:4px;">
                <button onclick="editProduct('${p.id}')" style="background:#0284c7; color:#fff; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteProduct('${p.id}')" style="background:#fee2e2; color:#dc2626; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
}

function saveAdminProduct(e) {
    e.preventDefault();
    const id = document.getElementById("editProductId").value;
    const name = document.getElementById("editProductName").value;
    const price = Number(document.getElementById("editProductPrice").value);
    const discountPrice = Number(document.getElementById("editProductDiscount").value) || 0;
    const stock = Number(document.getElementById("editProductStock").value);
    const category = document.getElementById("editProductCategory").value;
    const imageInput = document.getElementById("editProductImage").value;

    if(id) {
        const p = products.find(x => String(x.id) === String(id));
        if(p) {
            p.name = name;
            p.price = price;
            p.discountPrice = discountPrice;
            p.stock = stock;
            p.category = category;
            if(imageInput) p.image = imageInput;
        }
    } else {
        const newP = {
            id: Date.now().toString(),
            name: name,
            price: price,
            discountPrice: discountPrice,
            stock: stock,
            category: category,
            image: imageInput || "https://via.placeholder.com/300"
        };
        products.unshift(newP);
    }

    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
    renderAdminProducts();
    if(typeof renderShopProducts === 'function') renderShopProducts();
    
    document.getElementById("adminProductForm").reset();
    document.getElementById("editProductId").value = "";
    alert("প্রোডাক্ট সফলভাবে সেভ হয়েছে! ✅");
}

function editProduct(id) {
    const p = products.find(x => String(x.id) === String(id));
    if(!p) return;

    document.getElementById("editProductId").value = p.id;
    document.getElementById("editProductName").value = p.name;
    document.getElementById("editProductPrice").value = p.price;
    document.getElementById("editProductDiscount").value = p.discountPrice || "";
    document.getElementById("editProductStock").value = p.stock;
    document.getElementById("editProductCategory").value = p.category;
    document.getElementById("editProductImage").value = p.image || "";
}

function deleteProduct(id) {
    if(!confirm("ডিলিট করতে চান?")) return;
    products = products.filter(x => String(x.id) !== String(id));
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.PRODUCTS, products);
    renderAdminProducts();
    if(typeof renderShopProducts === 'function') renderShopProducts();
}

function renderAdminOrders() {
    const container = document.getElementById("adminOrdersList");
    if(!container) return;

    const orders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ORDERS, []);
    container.innerHTML = "";

    if(orders.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#64748b; padding:10px;">কোনো অর্ডার নেই।</p>`;
        return;
    }

    orders.forEach(ord => {
        const div = document.createElement("div");
        div.style.cssText = "background:#f8fafc; border:1px solid #e2e8f0; padding:8px; border-radius:8px; margin-bottom:8px; font-size:11.5px;";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:900; color:#00897b; margin-bottom:2px;">
                <span>${ord.orderId} (${ord.status || 'Pending'})</span>
                <span>৳${ord.total}</span>
            </div>
            <div style="color:#475569; margin-bottom:4px;">
                ${ord.customerName} (${ord.customerPhone})<br>
                TrxID: <b>${ord.trxId || 'N/A'}</b>
            </div>
            <div style="display:flex; gap:4px;">
                <button onclick="updateOrderStatus('${ord.orderId}', 'Approved')" style="background:#16a34a; color:#fff; border:none; padding:3px 6px; border-radius:4px; cursor:pointer;">অ্যাপ্রুভ</button>
                <button onclick="updateOrderStatus('${ord.orderId}', 'Cancelled')" style="background:#dc2626; color:#fff; border:none; padding:3px 6px; border-radius:4px; cursor:pointer;">ক্যান্সেল</button>
                <button onclick="deleteOrder('${ord.orderId}')" style="background:#64748b; color:#fff; border:none; padding:3px 6px; border-radius:4px; cursor:pointer;">ডিলিট</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateOrderStatus(orderId, status) {
    let orders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ORDERS, []);
    const ord = orders.find(x => x.orderId === orderId);
    if(ord) {
        ord.status = status;
        StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.ORDERS, orders);
        renderAdminOrders();
        alert(`স্ট্যাটাস পরিবর্তন করে '${status}' করা হয়েছে!`);
    }
}

function deleteOrder(orderId) {
    if(!confirm("মুছে ফেলতে চান?")) return;
    let orders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ORDERS, []);
    orders = orders.filter(x => x.orderId !== orderId);
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.ORDERS, orders);
    renderAdminOrders();
}
