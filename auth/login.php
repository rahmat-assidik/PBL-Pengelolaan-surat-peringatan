<?php include('login_proc.php'); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Login | SP POLIBATAM</title>

  <!-- Google Font: Source Sans Pro -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- icheck bootstrap -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/icheck-bootstrap/3.0.1/icheck-bootstrap.min.css">
  <!-- Theme style -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css">
  <style>
    body {
        background-image: url('https://www.polibatam.ac.id/wp-content/uploads/2024/04/MG_8893-2048x1365.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #e2d7f7; /* Fallback */
    }
    .login-page {
        background-color: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(5px);
    }
    .login-box {
        width: 400px;
    }
    @media (max-width: 576px) {
        .login-box {
            width: 100%;
        }
    }
  </style>
</head>
<body class="hold-transition login-page">
<div class="login-box">
  <div class="card card-outline card-primary shadow-lg">
    <div class="card-header text-center bg-white border-bottom-0 pb-0">
        <div class="mb-2">
            <img src="../assets/img/logo polibatam.png" alt="Logo Polibatam" width="80" class="brand-image elevation-1" style="opacity: .9;">
        </div>
      <h5 class="font-weight-bold text-dark mb-0">Sistem Pengelolaan</h5>
      <h4 class="font-weight-bold text-primary mb-1">Surat Peringatan</h4>
    </div>
    <div class="card-body login-card-body bg-white">
      <p class="login-box-msg text-muted">Silakan login untuk memulai sesi Anda</p>

      <form action="" method="post">
        <div class="input-group mb-3">
          <input type="text" name="username" id="username" class="form-control" placeholder="Username" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-user"></span>
            </div>
          </div>
        </div>
        <div class="input-group mb-3">
          <input type="password" name="password" id="password" class="form-control" placeholder="Password" required>
          <div class="input-group-append">
            <div class="input-group-text">
              <span class="fas fa-lock" id="togglePassword" style="cursor: pointer;"></span>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <button type="submit" class="btn btn-primary btn-block font-weight-bold">MASUK</button>
          </div>
          <!-- /.col -->
        </div>
      </form>

      <?php if(isset($error_message) && !empty($error_message)): ?>
        <div class="alert alert-danger mt-3 text-center">
            <i class="icon fas fa-ban"></i> <?php echo htmlspecialchars($error_message); ?>
        </div>
      <?php endif; ?>

      <div class="mt-3 text-center text-sm text-muted">
          <small>&copy; <?php echo date('Y'); ?> Polibatam. All rights reserved.</small>
      </div>
    </div>
    <!-- /.login-card-body -->
  </div>
</div>
<!-- /.login-box -->

<!-- jQuery -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<!-- Bootstrap 4 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.6.0/js/bootstrap.bundle.min.js"></script>
<!-- AdminLTE App -->
<script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
<script>
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');

  togglePassword.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.classList.toggle('fa-lock-open');
    this.classList.toggle('fa-lock');
  });
</script>
</body>
</html>

