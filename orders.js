/* =====================================================
   ADORE'S PET - ORDERS.JS (Orders & Voucher Management)
===================================================== */

function openOrdersModal(){
    const container = document.getElementById("userOrdersList");
    if(!container) return;

    let hasAdminCancelled = false;

    if(myOrders.length === 0){
        container.innerHTML = `<p style="text-align:center; color:#64748b;">কোনো অর্ডার নেই।</p>`;
    } else {
        container.innerHTML = myOrders.map((o, idx) => {
            const isPending = !o.status || o.status === 'pending';
            const isCancelled = o.status === 'cancelled';

            if(isCancelled && o.cancelledByAdmin){
                hasAdminCancelled = true;
            }

            return `
                <div class="order-card" style="${isCancelled ? 'border-color:#fca5a5; background:#fff5f5;' : ''}">
                    <div class="order-card-header"><span>${o.id}</span><span>${formatCurrency(o.total)}</span></div>
                    <div style="font-size:12px; margin-bottom:8px;">${o.itemsText.replace(/\n/g, '<br>')}</div>
                    
                    ${isCancelled && o.cancelledByAdmin ? `
                        <div style="background:#fef2f2; border:1px dashed #f87171; color:#991b1b; padding:8px 10px; border-radius:8px; font-size:11.5px; font-weight:700; margin-bottom:10px; line-height:1.4;">
                            ⚠️ দুঃখিত! প্রোডাক্টটি স্টকে না থাকায় অর্ডারটি বাতিল করা হয়েছে।
                        </div>
                    ` : ''}

                    <div style="display:flex; gap:8px; align-items:center;">
                        <button onclick="openVoucher(${idx})" style="background:var(--teal); color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px; flex:1;">ভাউচার দেখুন</button>
                        ${isPending ? `<button onclick="cancelMyOrder('${o.id}')" style="background:#ef4444; color:white; border:none; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px;">অর্ডার বাতিল করুন</button>` : `<span style="font-size:11px; font-weight:800; color:${o.status==='completed'?'#10b981':'#ef4444'};">${o.status.toUpperCase()}</span>`}
                    </div>
                </div>
            `;
        }).join("");
    }

    document.getElementById("ordersModal")?.classList.add("show");

    if(hasAdminCancelled){
        setTimeout(() => {
            if(typeof showCustomAlert === "function"){
                showCustomAlert("আপনার অর্ডারকৃত পণ্যটি বর্তমানে স্টকে না থাকায় বাতিল করা হয়েছে। অনিচ্ছাকৃত ভুলের জন্য আমরা আন্তরিকভাবে দুঃখিত! 😔");
            }
        }, 300);
    }
}

function cancelMyOrder(orderId){
    let idx = myOrders.findIndex(o => o.id === orderId);
    if(idx !== -1){
        myOrders[idx].status = 'cancelled';
        myOrders[idx].cancelledByAdmin = false;
        saveMyOrders();
        openOrdersModal();
        if(typeof showCustomAlert === "function") showCustomAlert("আপনার অর্ডারটি সফলভাবে বাতিল করা হয়েছে।");
    }
}

function closeOrdersModal(){ document.getElementById("ordersModal")?.classList.remove("show"); }

function openVoucher(idx){
    const o = myOrders[idx];
    if(!o) return;
    const custInfo = document.getElementById("voucherCustomerInfo");
    const tableBody = document.getElementById("voucherTableBody");
    const totalsBox = document.getElementById("voucherTotalsBox");
    
    if(custInfo) custInfo.innerHTML = `<strong>ID:</strong> ${o.id}<br><strong>Name:</strong> ${escapeHTML(o.name)}<br><strong>Phone:</strong> ${escapeHTML(o.phone)}<br><strong>Address:</strong> ${escapeHTML(o.address)}<br><strong>TrxID:</strong> ${escapeHTML(o.trxId)}`;
    if(tableBody) tableBody.innerHTML = o.tableHtml;
    if(totalsBox) totalsBox.innerHTML = `Subtotal: ${formatCurrency(o.subtotal)}<br>Delivery: ${formatCurrency(o.delivery)}<br><strong>Total: ${formatCurrency(o.total)}</strong>`;
    
    document.getElementById("voucherModal")?.classList.add("show");
}
function closeVoucherModal(){ document.getElementById("voucherModal")?.classList.remove("show"); }
