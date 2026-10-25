/* =====================================================
   ADORE'S PET - API.JS (External Requests & Email Service)
===================================================== */

const ApiService = {
    sendOrderEmail(orderData) {
        if (typeof emailjs === 'undefined') {
            console.warn("EmailJS is not loaded.");
            return Promise.reject("EmailJS missing");
        }

        return emailjs.send("service_default", "template_default", {
            to_name: "Admin",
            order_id: orderData.id,
            customer_name: orderData.name,
            customer_phone: orderData.phone,
            customer_address: orderData.address,
            total_amount: orderData.total,
            order_details: orderData.itemsText
        });
    }
};
