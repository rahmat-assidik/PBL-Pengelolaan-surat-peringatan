<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include '../config/config.php';

// Get total mahasiswa
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM mahasiswa");
$stmt->execute();
$result = $stmt->get_result();
$totalMahasiswa = $result->fetch_assoc()['total'];

// Get total surat peringatan aktif
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM surat_peringatan WHERE status = 'Aktif'");
$stmt->execute();
$result = $stmt->get_result();
$totalSPAktif = $result->fetch_assoc()['total'];

// Get surat peringatan bulan ini
$currentMonth = date('m');
$currentYear = date('Y');
$stmt = $conn->prepare("SELECT COUNT(*) as total FROM surat_peringatan WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?");
$stmt->bind_param("ii", $currentMonth, $currentYear);
$stmt->execute();
$result = $stmt->get_result();
$spBulanIni = $result->fetch_assoc()['total'];

// Get distribusi SP
$stmt = $conn->prepare("SELECT tingkatan_sp, COUNT(*) as count FROM surat_peringatan GROUP BY tingkatan_sp");
$stmt->execute();
$result = $stmt->get_result();
$distribusiSP = [];
while ($row = $result->fetch_assoc()) {
    $distribusiSP[$row['tingkatan_sp']] = $row['count'];
}

// Get tren SP per semester (6 bulan terakhir)
$trenSP = [];
for ($i = 5; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i months"));
    $month = date('m', strtotime($date));
    $year = date('Y', strtotime($date));

    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM surat_peringatan WHERE MONTH(tanggal) = ? AND YEAR(tanggal) = ?");
    $stmt->bind_param("ii", $month, $year);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_assoc()['count'];

    $trenSP[] = [
        'period' => date('M Y', strtotime($date)),
        'count' => $count
    ];
}

$response = [
    'totalMahasiswa' => $totalMahasiswa,
    'totalSPAktif' => $totalSPAktif,
    'spBulanIni' => $spBulanIni,
    'distribusiSP' => $distribusiSP,
    'trenSP' => $trenSP
];

echo json_encode($response);

$conn->close();
?>
