<?php
session_start(); // Start the session

// Determine correct path based on current location
$base_path = (basename(__DIR__) === 'auth') ? '../' : './auth/';
include $base_path . 'config/config.php'; // Include your database connection file



if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $error_message = ''; // Initialize error message variable
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    // Prepare a SQL statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        
        // Verify the hashed password
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            
            // Handle remember me checkbox
            if(isset($_POST['remember'])) {
                // Set cookie for 30 days
                setcookie('username', $username, time() + (30 * 24 * 60 * 60), '/');
            }
            
            // Redirect to dashboard
            header("Location: ../pages/dashboard-index.php");
            exit();
        } else {
            $error_message = "Password yang Anda masukkan salah";
        }
    } else {
        $error_message = "Username tidak ditemukan";
    }
    
    $stmt->close();
    $conn->close();
}
?>