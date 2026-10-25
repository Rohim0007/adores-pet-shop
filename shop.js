/* =====================================================
   ADORE'S PET - ADMIN PANEL TRIGGER FIX
===================================================== */

// অ্যাডমিন প্যানেল ওপেন করার ফাংশন
function openAdminModal() {
    const adminModal = document.getElementById("adminModal");
    if(adminModal) {
        adminModal.classList.add("show");
    } else {
        alert("অ্যাডমিন মডাল টেমপ্লেট পাওয়া যায়নি!");
    }
}

function closeAdminModal() {
    const adminModal = document.getElementById("adminModal");
    if(adminModal) {
        adminModal.classList.remove("show");
    }
}

// লোগোতে বা ব্র্যান্ড বক্সে ক্লিক করলে অ্যাডমিন প্যানেল ওপেন হওয়ার ইভেন্ট (৫ বার বা সহজ ক্লিকের জন্য)
let adminClickCount = 0;
document.addEventListener("DOMContentLoaded", () => {
    const brandBox = document.querySelector(".brand-box");
    if(brandBox) {
        brandBox.addEventListener("click", () => {
            adminClickCount++;
            if(adminClickCount >= 5) {
                adminClickCount = 0;
                openAdminModal();
            }
        });
    }
    
    // অথবা যদি সরাসরি কোনো অ্যাডমিন বাটন বা লিংক থাকে
    const adminTriggerBtn = document.getElementById("adminTriggerBtn");
    if(adminTriggerBtn) {
        adminTriggerBtn.addEventListener("click", openAdminModal);
    }
});
