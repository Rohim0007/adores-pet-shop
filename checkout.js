/* =====================================================
   ADORE'S PET - CHECKOUT.JS
===================================================== */

function submitOrderForm(e){
    e.preventDefault();
    
    if(!cart || cart.length === 0){
        alert("আপনার কার্ট খালি রয়েছে!");
        window.location.href = "index.html";
        return;
    }

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const district = document.getElementById("deliveryDistrict").value;
    const area = document.getElementById("deliveryArea").value.trim();
    const trxId = document.getElementById("trxIdInput").value.trim();

    let subtotal = 0;
    let itemsDetail = [];
    let hasLivePet = false;

    cart.forEach(item => {
        const p = products.find(x => String(x.id) === String(item.id));
        if(p){
            const price = (p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price) ? p.discountPrice : p.price;
            subtotal += price * item.qty;
            itemsDetail.push({
                id: p.id,
                name: p.name,
                price: price,
                qty: item.qty
            });
            if(p.category === "Rabbit" || p.category === "Hamster") hasLivePet = true;
        }
    });

    let delivery = 80;
    if(district === "Gazipur" || district === "Narayanganj") delivery = 120;
    else if(district !== "Dhaka") delivery = 150;

    const total = subtotal + delivery;
    const advance = hasLivePet ? Math.round(total * 0.5) : 0;

    const orderObj = {
        orderId: "AP-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleString("bn-BD"),
        customerName: name,
        customerPhone: phone,
        address: `${address}, ${area}, ${district}`,
        trxId: trxId || "N/A",
        items: itemsDetail,
        subtotal: subtotal,
        delivery: delivery,
        total: total,
        advancePaid: advance,
        status: "Pending"
    };

    let userOrders = StorageManager.get(APP_CONSTANTS.STORAGE_KEYS.ORDERS, []);
    userOrders.unshift(orderObj);
    StorageManager.set(APP_CONSTANTS.STORAGE_KEYS.ORDERS, userOrders);

    // কার্ট খালি করা
    cart = [];
    saveCart();

    alert(`অর্ডার সফল হয়েছে! 🎉\nআপনার অর্ডার আইডি: ${orderObj.orderId}`);
    window.location.href = "index.html";
}
