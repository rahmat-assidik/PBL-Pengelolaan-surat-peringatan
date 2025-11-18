<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config.php';

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
        // Create new surat peringatan
        $data = json_decode(file_get_contents('php://input'), true);
        $nim = $data['nim'];
        $nama = $data['nama'];
        $ketua_prodi = $data['ketua_prodi'] ?? '';
        $wali_dosen = $data['wali_dosen'] ?? '';
        $tingkatan_sp = $data['tingkatan_sp'];
        $alasan_sp = $data['alasan_sp'];

        $stmt = $conn->prepare("INSERT INTO surat_peringatan (nim, nama, ketua_prodi, wali_dosen, tingkatan_sp, alasan_sp) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $nim, $nama, $ketua_prodi, $wali_dosen, $tingkatan_sp, $alasan_sp);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
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
