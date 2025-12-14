<?php
// Menghubungkan ke database MySQL
$host = 'localhost'; // Alamat server database
$username = 'root';  // Username MySQL (sesuaikan dengan pengaturan Anda)
$password = '';      // Password MySQL (kosong jika tidak ada)
$dbname = 'suratperingatan'; // Nama database

// Membuat koneksi
$conn = mysqli_connect($host, $username, $password, $dbname);

// Cek koneksi
if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
?>
