<?php include ('login_proc.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Login Page</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
* {
    margin: 0;
    padding: 0;
    text-decoration: none;
    box-sizing: border-box;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
    background-color: #e2d7f7;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    width: 100%;
    max-width: 450px;
    padding: 20px;
}

.login-card {
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(120, 53, 149, 0.15);
    padding: 3rem 2.5rem;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-header h2 {
    color: #000000ff;
    font-weight: 700;
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.login-header p {
    color: #6c757d;
    font-size: 0.95rem;
}

.msg {
    color: #dc3545;
    font-size: 0.9rem;
    text-align: center;
    padding: 0.75rem;
    background: #ffe5e5;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    display: none;
}

.msg.show {
    display: block;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    color: #495057;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    display: block;
}

.form-control {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #0055ffff;
    box-shadow: 0 0 0 0.2rem rgba(120, 53, 149, 0.15);
}

.form-control::placeholder {
    color: #adb5bd;
}

.password-wrapper {
    position: relative;
}

.password-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #6c757d;
    transition: color 0.3s ease;
}

.password-toggle:hover {
    color: #783595;
}

.btn-login {
    width: 100%;
    padding: 0.875rem;
    background-color: #006affff;
    color: white;
    font-size: 1.05rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    margin-top: 1.5rem;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.btn-login:hover {
    background-color: #1135d5ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(51, 51, 147, 0.3);
}

.btn-login:active {
    transform: translateY(0);
}

@media (max-width: 576px) {
    .login-card {
        padding: 2rem 1.5rem;
    }
    
    .login-header h2 {
        font-size: 1.75rem;
    }
}
</style>
</head>
<body>
<div class="login-container">
    <div class="login-card">
        <div class="login-header">
            <img src="assets/img/logo.png" alt="Logo" width="100" class="mb-3">
            <h2>Login</h2>
            <p>Silakan masuk ke akun Anda</p>
        </div>

        <!-- Error Message - tampilkan dengan class 'show' jika ada error -->
        <?php if(isset($error_message) && !empty($error_message)): ?>
        <div class="msg show">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span><?php echo $error_message; ?></span>
        </div>
        <?php endif; ?>

        <form action="" method="post">
            <div class="form-group">
                <label class="form-label">Username</label>
                <input type="text" name="username" id="username" placeholder="Masukkan username anda" class="form-control" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">Password</label>
                <div class="password-wrapper">
                    <input type="password" name="password" id="password" placeholder="Masukkan password anda" class="form-control" required>
                    <i class="fa-regular fa-eye password-toggle" id="togglePassword"></i>
                </div>
                
            </div>
            
            <button type="submit" class="btn btn-login">Login</button>
        </form>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script>
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});
</script>
</body>
</html>