/* =====================================================
   ADORE'S PET - CHECKOUT.JS (Checkout & Order Submission)
===================================================== */

function proceedToCheckout(){
    if(cart.length === 0){
        if(typeof showCustomAlert === "function") showCustomAlert("আপনার কার্ট খালি রয়েছে।");
        return;
    }
    window.location.href = "checkout.html";
}

// চেকআউট পেজের জন্য প্রয়োজনীয় সাবমিট ফাংশন
function submitOrderForm(event){
    if(event) event.preventDefault();
    
    const name = document.getElementById("customerName")?.value.trim();
    const phone = document.getElementById("customerPhone")?.value.trim();
    const address = document.getElementById("customerAddress")?.value.trim();
    const trxId = document.getElementById("trxIdInput")?.value.trim() || "N/A";
    const deliveryMethod = document.getElementById("deliveryMethod")?.value || "Home Delivery";
    
    if(!name || !phone || !address){
        alert("দয়া করে নাম, ফোন এবং সম্পূর্ণ ঠিকানা পূরণ করুন।");
        return;
    }

    let subtotal = 0;
    let itemsText = "";
    let tableHtml = "";

    cart.forEach(item => {
        const p = products.find(x => String(x.id) === String(item.id));
        if(p){
            const price = (p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price) ? p.discountPrice : p.price;
            subtotal += price * item.qty;
            itemsText += `- ${p.name} (Qty: ${item.qty}) - ৳${price * item.qty}\n`;
            tableHtml += `<tr><td style="padding:6px;">${escapeHTML(p.name)}</td><td style="padding:6px;">${item.qty}</td><td style="padding:6px;">৳${price * item.qty}</td></tr>`;
            
            // স্টক কমানো
            p.stock = Math.max(0, p.stock - item.qty);
        }
    });

    const deliveryFee = deliveryMethod === "Inside Dhaka" ? 80 : 150;
    const total = subtotal + deliveryFee;
    const orderId = "AP-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
        id: orderId,
        name,
        phone,
        address,
        trxId,
        deliveryMethod,
        itemsText,
        tableHtml,
        subtotal,
        delivery: deliveryFee,
        total,
        status: "pending",
        cancelledByAdmin: false,
        date: new Date().toISOString()
    };

    myOrders.unshift(newOrder);
    saveMyOrders();
    saveProducts();

    // কার্ট খালি করা
    cart = [];
    saveCart();
    if(typeof updateCartBadge === "function") updateCartBadge();

    // ইমেইল নোটিফিকেশন পাঠানো (EmailJS)
    if(typeof emailjs !== 'undefined'){
        emailjs.send("service_default", "template_default", {
            to_name: "Admin",
            order_id: orderId,
            customer_name: name,
            customer_phone: phone,
            customer_address: address,
            total_amount: total,
            order_details: itemsText
        }).catch(err => console.log("Email error:", err));
    }

    // সফলতার মেসেজ দেখানো
    window.location.href = `index.html?orderSuccess=${orderId}`;
}
