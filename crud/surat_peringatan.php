<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all surat peringatan or search
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = $_GET['search'];
            $stmt = $conn->prepare("SELECT * FROM surat_peringatan WHERE nim LIKE ? OR nama LIKE ? OR tingkatan_sp LIKE ? ORDER BY created_at DESC");
            $searchTerm = "%$search%";
            $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
        } else {
            $stmt = $conn->prepare("SELECT * FROM surat_peringatan ORDER BY created_at DESC");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $surat_peringatan = [];
        while ($row = $result->fetch_assoc()) {
            $surat_peringatan[] = $row;
        }
        echo json_encode($surat_peringatan);
        break;

    case 'POST':
        // Create atau REPLACE surat peringatan - 1 NIM = 1 RECORD SAJA
        // Jika sudah ada untuk NIM yang sama, maka REPLACE (UPDATE) seluruhnya
        $data = json_decode(file_get_contents('php://input'), true);
        $nim = $data['nim'] ?? '';
        $nama = $data['nama'] ?? '';
        $ketua_prodi = $data['ketua_prodi'] ?? '';
        $wali_dosen = $data['wali_dosen'] ?? '';
        $tingkatan_sp = $data['tingkatan_sp'] ?? '';
        $alasan_sp = $data['alasan_sp'] ?? '';

        // Validasi input
        if (empty($nim) || empty($tingkatan_sp)) {
            echo json_encode(['success' => false, 'error' => 'NIM dan Tingkatan SP harus diisi']);
            break;
        }

        // REPLACE: Jika NIM sudah ada, maka UPDATE (replace) seluruh record
        // Jika NIM belum ada, maka INSERT baru
        $stmt = $conn->prepare("REPLACE INTO surat_peringatan (nim, nama, ketua_prodi, wali_dosen, tingkatan_sp, alasan_sp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $nim, $nama, $ketua_prodi, $wali_dosen, $tingkatan_sp, $alasan_sp);
        
        if ($stmt->execute()) {
            // Cek apakah ini INSERT atau UPDATE
            $check_query = $conn->query("SELECT id FROM surat_peringatan WHERE nim = '$nim'");
            $record_id = $check_query->fetch_assoc()['id'] ?? null;
            
            echo json_encode([
                'success' => true, 
                'id' => $record_id,
                'message' => 'Data SP berhasil disimpan (diperbarui untuk NIM ini)'
            ]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Gagal menyimpan: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    case 'PUT':
        // Update surat peringatan
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $nim = $data['nim'];
        $nama = $data['nama'];
        $ketua_prodi = $data['ketua_prodi'] ?? '';
        $wali_dosen = $data['wali_dosen'] ?? '';
        $tingkatan_sp = $data['tingkatan_sp'];
        $alasan_sp = $data['alasan_sp'];

        $stmt = $conn->prepare("UPDATE surat_peringatan SET nim=?, nama=?, ketua_prodi=?, wali_dosen=?, tingkatan_sp=?, alasan_sp=? WHERE id=?");
        $stmt->bind_param("ssssssi", $nim, $nama, $ketua_prodi, $wali_dosen, $tingkatan_sp, $alasan_sp, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;

    case 'DELETE':
        // Delete surat peringatan
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM surat_peringatan WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;
}

$conn->close();
?>
