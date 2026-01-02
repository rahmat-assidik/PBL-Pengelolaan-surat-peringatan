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
        // Get all surat_peringatan with optional search and filters
        $search = $_GET['search'] ?? '';
        $tingkatan_sp = $_GET['tingkatan_sp'] ?? '';
        $tanggal_mulai = $_GET['tanggal_mulai'] ?? '';
        $tanggal_selesai = $_GET['tanggal_selesai'] ?? '';
        
        error_log("=== Surat Peringatan Filter Debug ===");
        error_log("search: " . $search);
        error_log("tingkatan_sp: " . $tingkatan_sp);
        error_log("tanggal_mulai: " . $tanggal_mulai);
        error_log("tanggal_selesai: " . $tanggal_selesai);
        error_log("=====================================");
        
        $whereConditions = [];
        $params = [];
        $types = '';
        
        // Search condition
        if (!empty($search)) {
            $whereConditions[] = "(nim LIKE ? OR nama LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= 'ss';
        }
        
        // Tingkat SP filter
        if (!empty($tingkatan_sp)) {
            $whereConditions[] = "tingkatan_sp = ?";
            $params[] = $tingkatan_sp;
            $types .= 's';
        }
        
        // Date range filter
        if (!empty($tanggal_mulai)) {
            $whereConditions[] = "tanggal >= ?";
            $params[] = $tanggal_mulai;
            $types .= 's';
        }
        
        if (!empty($tanggal_selesai)) {
            $whereConditions[] = "tanggal <= ?";
            $params[] = $tanggal_selesai;
            $types .= 's';
        }
        
        // Build WHERE clause
        $whereClause = count($whereConditions) > 0 ? "WHERE " . implode(" AND ", $whereConditions) : "";
        
        // Get total count
        $countSql = "SELECT COUNT(*) as total FROM surat_peringatan $whereClause";
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
        $sql = "SELECT id, nim, nama, ketua_prodi, wali_dosen, tingkatan_sp as tingsp, tanggal as tgl_sp, alasan_sp, status, created_at, updated_at FROM surat_peringatan $whereClause ORDER BY created_at DESC LIMIT ? OFFSET ?";
        $stmt = $conn->prepare($sql);
        
        // Build complete param types: filter params + limit + offset
        $allTypes = $types . "ii";
        $allParams = array_merge($params, [$limit, $offset]);
        $stmt->bind_param($allTypes, ...$allParams);
        
        $stmt->execute();
        $result = $stmt->get_result();
        $surat_peringatan = [];
        while ($row = $result->fetch_assoc()) {
            $surat_peringatan[] = $row;
        }
        
        echo json_encode([
            'data' => $surat_peringatan,
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
        // Create new surat_peringatan
        $raw_input = file_get_contents('php://input');
        
        // Handle empty input
        if (empty($raw_input)) {
            echo json_encode(['success' => false, 'error' => 'Data tidak diterima. Input kosong.']);
            break;
        }
        
        $data = json_decode($raw_input, true);
        
        // Handle JSON parse error
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(['success' => false, 'error' => 'Format JSON tidak valid: ' . json_last_error_msg()]);
            break;
        }
        
        $nim = $data['nim'] ?? '';
        $nama = $data['nama'] ?? '';
        $ketua_prodi = $data['ketua_prodi'] ?? '';
        $wali_dosen = $data['wali_dosen'] ?? '';
        $tingkatan_sp = $data['tingsp'] ?? '';
        $tanggal = $data['tanggal'] ?? date('Y-m-d');
        $alasan_sp = $data['alasan_sp'] ?? '';

        // Validate required fields
        if (empty($nim) || empty($nama) || empty($tingkatan_sp) || empty($alasan_sp)) {
            echo json_encode(['success' => false, 'error' => 'Field wajib tidak boleh kosong']);
            break;
        }

        $stmt = $conn->prepare("INSERT INTO surat_peringatan (nim, nama, ketua_prodi, wali_dosen, tingkatan_sp, tanggal, alasan_sp) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $nim, $nama, $ketua_prodi, $wali_dosen, $tingkatan_sp, $tanggal, $alasan_sp);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;

    case 'PUT':
        // Update surat_peringatan
        $raw_input = file_get_contents('php://input');
        
        // Handle empty input
        if (empty($raw_input)) {
            echo json_encode(['success' => false, 'error' => 'Data tidak diterima. Input kosong.']);
            break;
        }
        
        $data = json_decode($raw_input, true);
        
        // Handle JSON parse error
        if (json_last_error() !== JSON_ERROR_NONE) {
            echo json_encode(['success' => false, 'error' => 'Format JSON tidak valid: ' . json_last_error_msg()]);
            break;
        }
        
        $id = $data['id'] ?? 0;
        $nim = $data['nim'] ?? '';
        $nama = $data['nama'] ?? '';
        $ketua_prodi = $data['ketua_prodi'] ?? '';
        $wali_dosen = $data['wali_dosen'] ?? '';
        $tingkatan_sp = $data['tingsp'] ?? '';
        $tanggal = $data['tanggal'] ?? date('Y-m-d');
        $alasan_sp = $data['alasan_sp'] ?? '';

        // Validate required fields
        if (empty($id) || empty($nim) || empty($nama) || empty($tingkatan_sp) || empty($alasan_sp)) {
            echo json_encode(['success' => false, 'error' => 'Field wajib tidak boleh kosong']);
            break;
        }

        $stmt = $conn->prepare("UPDATE surat_peringatan SET nim=?, nama=?, ketua_prodi=?, wali_dosen=?, tingkatan_sp=?, tanggal=?, alasan_sp=? WHERE id=?");
        $stmt->bind_param("sssssssi", $nim, $nama, $ketua_prodi, $wali_dosen, $tingkatan_sp, $tanggal, $alasan_sp, $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => $stmt->error]);
        }
        break;

    case 'DELETE':
        // Delete surat_peringatan
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

