/* =====================================================
   ADORE'S PET - ORDERS.JS (Complete & Bug-Free)
===================================================== */

function openOrdersModal(){
    renderUserOrders();
    const modal = document.getElementById("ordersModal");
    if(modal) modal.classList.add("show");
}

function closeOrdersModal(){
    const modal = document.getElementById("ordersModal");
    if(modal) modal.classList.remove("show");
}

function renderUserOrders(){
    const listContainer = document.getElementById("userOrdersList");
    if(!listContainer) return;

    const orders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ORDERS, []);
    listContainer.innerHTML = "";

    if(orders.length === 0){
        listContainer.innerHTML = `<p style="text-align:center; color:#64748b; padding:20px;">আপনার কোনো অর্ডার নেই।</p>`;
        return;
    }

    orders.forEach(ord => {
        const div = document.createElement("div");
        div.style.cssText = "background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px; margin-bottom:12px;";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <span style="font-size:12.5px; font-weight:900; color:#00897b;">${ord.orderId}</span>
                <span style="font-size:11px; font-weight:700; background:#e0f2fe; color:#0284c7; padding:2px 8px; border-radius:6px;">${ord.status || 'Pending'}</span>
            </div>
            <div style="font-size:12px; color:#475569; margin-bottom:6px;">
                তারিখ: ${ord.date}<br>
                গ্রাহক: ${ord.customerName} (${ord.customerPhone})<br>
                ঠিকানা: ${ord.address}
            </div>
            <div style="font-size:12px; font-weight:800; color:#1e293b; border-top:1px dashed #cbd5e1; padding-top:6px; display:flex; justify-content:space-between;">
                <span>সর্বমোট: ৳${ord.total} ${ord.advancePaid ? `(অ্যাডভান্স: ৳${ord.advancePaid})` : ''}</span>
                <button onclick="viewVoucher('${ord.orderId}')" style="background:#00897b; color:#fff; border:none; padding:4px 10px; border-radius:6px; font-size:11px; cursor:pointer;">ভাউচার দেখুন</button>
            </div>
        `;
        listContainer.appendChild(div);
    });
}

function viewVoucher(orderId){
    const orders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ORDERS, []);
    const ord = orders.find(x => x.orderId === orderId);
    if(!ord) return;

    const custInfo = document.getElementById("voucherCustomerInfo");
    const tbody = document.getElementById("voucherTableBody");
    const totalsBox = document.getElementById("voucherTotalsBox");

    if(custInfo){
        custInfo.innerHTML = `<b>অর্ডার আইডি:</b> ${ord.orderId}<br><b>তারিখ:</b> ${ord.date}<br><b>নাম:</b> ${ord.customerName}<br><b>ফোন:</b> ${ord.customerPhone}<br><b>ঠিকানা:</b> ${ord.address}<br><b>TrxID:</b> ${ord.trxId || 'N/A'}`;
    }

    if(tbody){
        tbody.innerHTML = "";
        ord.items.forEach(it => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td style="padding:6px; border-bottom:1px solid #f1f5f9;">${it.name}</td><td style="padding:6px; border-bottom:1px solid #f1f5f9;">${it.qty}</td><td style="padding:6px; border-bottom:1px solid #f1f5f9;">৳${it.price * it.qty}</td>`;
            tbody.appendChild(tr);
        });
    }

    if(totalsBox){
        totalsBox.innerHTML = `পণ্যের মূল্য: ৳${ord.subtotal}<br>ডেলিভারি চার্জ: ৳${ord.delivery}<br><span style="color:#00897b; font-size:14px;">সর্বমোট প্রদেয়: ৳${ord.total}</span>${ord.advancePaid ? `<br><span style="color:#b45309;">৫০% অগ্রিম পরিশোধিত/প্রদেয়: ৳${ord.advancePaid}</span>` : ''}`;
    }

    closeOrdersModal();
    const vModal = document.getElementById("voucherModal");
    if(vModal) vModal.classList.add("show");
}

function closeVoucherModal(){
    const vModal = document.getElementById("voucherModal");
    if(vModal) vModal.classList.remove("show");
}

function trackMyOrderFromSuccess(){
    closeThankYouModal();
    openOrdersModal();
}

function closeThankYouModal(){
    const m = document.getElementById("thankyouModal");
    if(m) m.classList.remove("show");
}
