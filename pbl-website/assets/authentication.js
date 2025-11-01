// Fungsi untuk mengecek validitas token
function validateAuthToken() {
    const authToken = localStorage.getItem("authToken");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const currentTime = new Date().getTime();

    if (!authToken || !tokenExpiry || currentTime > parseInt(tokenExpiry)) {
        clearAuthData();
        return false;
    }
    return true;
}

// Fungsi untuk membersihkan data autentikasi
function clearAuthData() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");
    try {
        sessionStorage.removeItem("username");
    } catch (e) {}
}

// Fungsi untuk mengecek status login
function checkLoginStatus() {
    // Validasi token autentikasi
    if (!validateAuthToken()) {
        redirectToLogin();
        return false;
    }

    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");
    const currentPath = window.location.pathname;

    // Daftar halaman yang membutuhkan autentikasi
    const protectedPages = [
        '/dashboard.html',
    ];

    // Cek apakah halaman saat ini termasuk yang dilindungi
    const isProtectedPage = protectedPages.some(page => 
        currentPath.toLowerCase().endsWith(page.toLowerCase())
    );

    // Jika halaman dilindungi tapi user belum login, redirect ke login
    if (isProtectedPage && (!isLoggedIn || !username)) {
        redirectToLogin();
        return false;
    }

    // Perbarui token expiry setiap kali halaman diakses
    refreshAuthToken();
    return true;
}

// Fungsi untuk redirect ke login
function redirectToLogin() {
    clearAuthData();
    alert("Minimal login sebagai admin dulu bro, baru masuk ke dashboard, ada-ada aja lu...");
    window.location.href = "login-page.html";
}

// Fungsi untuk memperbarui token
function refreshAuthToken() {
    const expiryTime = new Date().getTime() + (30 * 60 * 1000); // 30 menit
    localStorage.setItem("tokenExpiry", expiryTime.toString());
}

// Fungsi untuk membuat token autentikasi baru
function generateAuthToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Jalankan pengecekan saat halaman dimuat
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Fungsi untuk logout
function logout() {
    clearAuthData();
    window.location.href = "login-page.html";
}

// Fungsi untuk mencegah akses langsung ke dashboard melalui URL
function preventDirectAccess() {
    if (!validateAuthToken()) {
        redirectToLogin();
        return;
    }
    checkLoginStatus();
}

// Event listeners
window.addEventListener('load', preventDirectAccess);

// Periksa status autentikasi setiap 1 menit
setInterval(checkLoginStatus, 60 * 1000);

// Tangani perubahan hash atau state history
window.addEventListener('hashchange', checkLoginStatus);
window.addEventListener('popstate', checkLoginStatus);