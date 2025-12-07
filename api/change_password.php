<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
include '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

$current_password = $data['current_password'] ?? '';
$new_password = $data['new_password'] ?? '';

if (empty($current_password) || empty($new_password)) {
    echo json_encode(['success' => false, 'message' => 'Current password and new password are required']);
    exit();
}

if (strlen($new_password) < 6) {
    echo json_encode(['success' => false, 'message' => 'New password must be at least 6 characters']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Get current user data
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo json_encode(['success' => false, 'message' => 'User not found']);
    exit();
}

$user = $result->fetch_assoc();

// Verify current password
if (!password_verify($current_password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    exit();
}

// Hash new password
$hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);

// Update password
$update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$update_stmt->bind_param("si", $hashed_new_password, $user_id);

if ($update_stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password changed successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update password']);
}

$stmt->close();
$update_stmt->close();
$conn->close();
?>
