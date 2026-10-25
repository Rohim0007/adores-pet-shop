/* =====================================================
   ADORE'S PET - UTILS.JS (Helper Functions)
===================================================== */

// HTML সিকিউরিটির জন্য এস্কেপ ফাংশন
function escapeHTML(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// টাকার অংক ফরম্যাট করা (যেমন: ৳1,500)
function formatCurrency(amount) {
    const num = Number(amount) || 0;
    return "৳" + num.toLocaleString("bn-BD");
}

// তারিখ ফরম্যাট করার সুবিধা
function formatDate(dateString) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
