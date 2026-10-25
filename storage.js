/* =====================================================
   ADORE'S PET - STORAGE.JS (Local Storage Management)
===================================================== */

const StorageManager = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error(`Error getting key ${key}:`, e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error(`Error setting key ${key}:`, e);
            if (typeof showCustomAlert === "function") {
                showCustomAlert("মেমরি ফুল! ব্রাউজারের ক্যাশ ক্লিয়ার করুন।");
            }
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error(`Error removing key ${key}:`, e);
        }
    }
};
