// Data awal diatur ke 0 seperti permintaan
let totalMahasiswa = 0;
let totalSP = 0;
let spAkademik = 0;
let spDisiplin = 0;
let trenSPData = [0, 0, 0, 0, 0]; // Data tren per semester, diatur ke 0

// Fungsi untuk memperbarui data (bisa dipanggil dari tombol atau integrasi lain)
function updateData() {
    // bisa mengganti dengan logik untuk menambahkan data sebenarnya
    // Misalnya, dari input pengguna atau API. Untuk sekarang, ini hanya simulasi.
    totalMahasiswa += 100;  // Contoh: Tambah 100, tapi ini bisa diubah
    totalSP += 10;
    spAkademik += 5;
    spDisiplin += 5;
    trenSPData.push(trenSPData[trenSPData.length - 1] + 10);  // Simulasi penambahan

    // Update nilai di HTML
    document.getElementById('totalMahasiswa').innerText = totalMahasiswa;
    document.getElementById('totalSP').innerText = totalSP;
    document.getElementById('spAkademik').innerText = spAkademik;
    document.getElementById('spDisiplin').innerText = spDisiplin;

    // Perbarui grafik
    drawDistribusiSP();
    drawTrenSP();
}

// Fungsi untuk menggambar Pie Chart Distribusi SP
function drawDistribusiSP() {
    const ctx = document.getElementById('distribusiSP').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['SP Akademik', 'SP Disiplin'],
            datasets: [{
                label: 'Distribusi SP',
                data: [spAkademik, spDisiplin],  // Sekarang data awal 0
                backgroundColor: ['#36a2eb', '#ff6384'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
        }
    });
}

// Fungsi untuk menggambar Line Chart Tren SP
function drawTrenSP() {
    const ctx = document.getElementById('trenSP').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'],
            datasets: [{
                label: 'Tren Surat Peringatan',
                data: trenSPData,  // Sekarang data awal 0
                fill: false,
                borderColor: '#ffcd56',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    // Gambarkan grafik dengan data awal (0)
    drawDistribusiSP();
    drawTrenSP();
});