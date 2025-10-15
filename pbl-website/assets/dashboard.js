// 🔒 Proteksi halaman: pastikan user sudah login
document.addEventListener("DOMContentLoaded", function() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn || loggedIn !== "true") {
        alert("⚠️ Anda harus login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    //  Tombol logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function(e) {
            e.preventDefault();

            const confirmLogout = confirm("Apakah Anda yakin ingin logout?");
            if (confirmLogout) {
                // Hapus status login dari localStorage
                localStorage.removeItem("loggedIn");

                // Pesan interaktif
                alert("👋 Anda telah logout!");

                // Arahkan ke halaman login
                window.location.href = "login-page.html";
            }
        });
    }

    // Setelah proteksi & logout diatur, lanjutkan inisialisasi dashboard
    initDashboard();
});

//  Inisialisasi data awal
let totalMahasiswa = 0;
let totalSP = 0;
let spAkademik = 0;
let spDisiplin = 0;
let trenSPData = [0, 0, 0, 0, 0]; // Data tren per semester, awal 0

// Fungsi utama untuk inisialisasi dashboard
function initDashboard() {
    drawDistribusiSP();
    drawTrenSP();
}

// Fungsi untuk memperbarui data (bisa dihubungkan dengan input/tombol)
function updateData() {
    totalMahasiswa += 100;
    totalSP += 10;
    spAkademik += 5;
    spDisiplin += 5;
    trenSPData.push(trenSPData[trenSPData.length - 1] + 10);

    document.getElementById('totalMahasiswa').innerText = totalMahasiswa;
    document.getElementById('totalSP').innerText = totalSP;
    document.getElementById('spAkademik').innerText = spAkademik;
    document.getElementById('spDisiplin').innerText = spDisiplin;

    drawDistribusiSP();
    drawTrenSP();
}

//  Fungsi untuk menggambar Pie Chart Distribusi SP
function drawDistribusiSP() {
    const ctx = document.getElementById('distribusiSP').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['SP Akademik', 'SP Disiplin'],
            datasets: [{
                label: 'Distribusi SP',
                data: [spAkademik, spDisiplin],
                backgroundColor: ['#36a2eb', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
        }
    });
}

//  Fungsi untuk menggambar Line Chart Tren SP
function drawTrenSP() {
    const ctx = document.getElementById('trenSP').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'],
            datasets: [{
                label: 'Tren Surat Peringatan',
                data: trenSPData,
                fill: false,
                borderColor: '#ffcd56',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
