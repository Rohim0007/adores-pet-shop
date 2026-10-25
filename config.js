/* =====================================================
   ADORE'S PET - CONFIG.JS (Global Configurations)
===================================================== */

const APP_CONFIG = {
    SITE_NAME: "ADORE'S PET",
    SITE_TAGLINE: "Loved by pets, trusted by owners",
    SUPPORT_PHONE: "01681578599",
    DEFAULT_ADMIN_PASS: "DJ778899",
    EMAILJS_PUBLIC_KEY: "P7lqeBS7YKyU3Kpaq"
};

// EmailJS ইনিশিয়ালাইজেশন
try {
    if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: APP_CONFIG.EMAILJS_PUBLIC_KEY });
    }
} catch (e) {
    console.error("EmailJS init failed:", e);
}
