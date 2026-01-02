<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

include '../config/config.php';

$method = $_SERVER['REQUEST_METHOD'];

// Pagination settings
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$offset = ($page - 1) * $limit;

switch ($method) {
    case 'GET':
        // Get all mahasiswa with optional search and filters
        $search = $_GET['search'] ?? '';
        $prodi = $_GET['prodi'] ?? '';
        $semester = $_GET['semester'] ?? '';
        
        error_log("=== Mahasiswa Filter Debug ===");
        error_log("search: " . $search);
        error_log("prodi: " . $prodi);
        error_log("semester: " . $semester);
        error_log("================================");
        
        $whereConditions = [];
        $params = [];
        $types = '';
        
        // Search condition
        if (!empty($search)) {
            $whereConditions[] = "(nim LIKE ? OR nama LIKE ? OR prodi LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= 'sss';
        }
        
        // Prodi filter
        if (!empty($prodi)) {
            $whereConditions[] = "prodi = ?";
            $params[] = $prodi;
            $types .= 's';
        }
        
        // Semester filter
        if (!empty($semester)) {
            $whereConditions[] = "semester = ?";
            $params[] = $semester;
            $types .= 'i';
        }
        
        // Build WHERE clause
        $whereClause = count($whereConditions) > 0 ? "WHERE " . implode(" AND ", $whereConditions) : "";
        
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM mahasiswa $whereClause";
        if (count($params) > 0) {
            $countStmt = $conn->prepare($countSql);
            $countStmt->bind_param($types, ...$params);
            $countStmt->execute();
            $countResult = $countStmt->get_result();
        } else {
            $countResult = $conn->query($countSql);
        }
        $totalRow = $countResult->fetch_assoc();
        $totalData = $totalRow['total'];
        $totalPages = ceil($totalData / $limit);
        
        // Get paginated data
        $sql = "SELECT * FROM mahasiswa $whereClause ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        
        // Build complete param types: filter params + limit + offset
        $allTypes = $types . "ii";
        $allParams = array_merge($params, [$limit, $offset]);
        $stmt->bind_param($allTypes, ...$allParams);
        
        $stmt->execute();
        $result = $stmt->get_result();
        $mahasiswa = [];
        while ($row = $result->fetch_assoc()) {
            $mahasiswa[] = $row;
        }
        
        echo json_encode([
            'data' => $mahasiswa,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total_data' => $totalData,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ]);
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
