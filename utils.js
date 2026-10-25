/* =====================================================
   ADORE'S PET - UTILS.JS
===================================================== */

// কাস্টম অ্যালার্ট বা সফলতার পপআপ দেখানোর ফাংশন
function showCustomAlert(message) {
    const modal = document.getElementById("customAlertModal");
    const msgEl = document.getElementById("customAlertMessage");
    if(msgEl) msgEl.innerText = message;
    if(modal) modal.classList.add("show");
}

function closeCustomAlert() {
    const modal = document.getElementById("customAlertModal");
    if(modal) modal.classList.remove("show");
}
