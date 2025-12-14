<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include '../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all mahasiswa or search
        if (isset($_GET['search']) && !empty($_GET['search'])) {
            $search = $_GET['search'];
            $stmt = $conn->prepare("SELECT * FROM mahasiswa WHERE nim LIKE ? OR nama LIKE ? OR prodi LIKE ? ORDER BY created_at DESC");
            $searchTerm = "%$search%";
            $stmt->bind_param("sss", $searchTerm, $searchTerm, $searchTerm);
        } else {
            $stmt = $conn->prepare("SELECT * FROM mahasiswa ORDER BY created_at DESC");
        }
        $stmt->execute();
        $result = $stmt->get_result();
        $mahasiswa = [];
        while ($row = $result->fetch_assoc()) {
            $mahasiswa[] = $row;
        }
        echo json_encode($mahasiswa);
        break;

    case 'POST':
        // Create new mahasiswa
        $data = json_decode(file_get_contents('php://input'), true);
        $nim = $data['nim'];
        $nama = $data['nama'];
        $prodi = $data['prodi'] ?? '';
        $semester = $data['semester'] ?? null;
        $wali_dosen = $data['wali_dosen'] ?? '';

        $stmt = $conn->prepare("INSERT INTO mahasiswa (nim, nama, prodi, semester, wali_dosen) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssis", $nim, $nama, $prodi, $semester, $wali_dosen);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;

    case 'PUT':
        // Update mahasiswa
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $nim = $data['nim'];
        $nama = $data['nama'];
        $prodi = $data['prodi'] ?? '';
        $semester = $data['semester'] ?? null;
        $wali_dosen = $data['wali_dosen'] ?? '';

        $stmt = $conn->prepare("UPDATE mahasiswa SET nim=?, nama=?, prodi=?, semester=?, wali_dosen=? WHERE id=?");
        $stmt->bind_param("sssisi", $nim, $nama, $prodi, $semester, $wali_dosen, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;

    case 'DELETE':
        // Delete mahasiswa
        $id = $_GET['id'];
        $stmt = $conn->prepare("DELETE FROM mahasiswa WHERE id=?");
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
