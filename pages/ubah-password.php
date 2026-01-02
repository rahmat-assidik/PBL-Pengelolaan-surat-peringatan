<?php
$page_title = 'Ubah Kata Sandi';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <!-- App Content Header -->
                <div class="app-content-header">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-sm-6">
                                <h3 class="mb-0">Ubah Kata Sandi</h3>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-end">
                                    <li class="breadcrumb-item"><a href="dashboard-index.php">Home</a></li>
                                    <li class="breadcrumb-item active" aria-current="page">Ubah Password</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- App Content -->
                <div class="app-content">
                    <div class="container-fluid">
                        <div class="row justify-content-center">
                            <div class="col-lg-6 col-md-8">
                                <!-- Password Card -->
                                <div class="password-card enhanced">
                                    <div class="card-header-custom">
                                        <div class="icon-wrapper">
                                            <i class="fas fa-shield-alt"></i>
                                        </div>
                                        <h4>Keamanan Akun</h4>
                                        <p class="text-muted mb-0">Perbarui kata sandi Anda untuk menjaga keamanan akun</p>
                                    </div>
                                    
                                    <form id="changePasswordForm" class="mt-4">
                                        <div class="input-password-group">
                                            <label for="currentPassword" class="form-label">
                                                <i class="fas fa-lock me-2"></i>Kata Sandi Saat Ini
                                            </label>
                                            <div class="input-password-wrapper">
                                                <input id="currentPassword" type="password" class="form-control" required placeholder="Masukkan kata sandi saat ini" />
                                                <button type="button" class="toggle-password" tabindex="-1" aria-label="Tampilkan/Sembunyikan sandi">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="input-password-group">
                                            <label for="newPassword" class="form-label">
                                                <i class="fas fa-key me-2"></i>Kata Sandi Baru
                                            </label>
                                            <div class="input-password-wrapper">
                                                <input id="newPassword" type="password" class="form-control" required minlength="6" placeholder="Masukkan kata sandi baru (min. 6 karakter)" />
                                                <button type="button" class="toggle-password" tabindex="-1" aria-label="Tampilkan/Sembunyikan sandi">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div class="input-password-group">
                                            <label for="confirmPassword" class="form-label">
                                                <i class="fas fa-check-circle me-2"></i>Konfirmasi Kata Sandi Baru
                                            </label>
                                            <div class="input-password-wrapper">
                                                <input id="confirmPassword" type="password" class="form-control" required minlength="6" placeholder="Konfirmasi kata sandi baru" />
                                                <button type="button" class="toggle-password" tabindex="-1" aria-label="Tampilkan/Sembunyikan sandi">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        
                                        <button type="submit" class="btn btn-primary btn-lg mt-3">
                                            <i class="fas fa-save me-2"></i>Simpan Perubahan
                                        </button>
                                        <p id="passwordMessage" class="text-center mt-3 mb-0"></p>
                                    </form>
                                    
                                    <!-- Security Tips -->
                                    <div class="security-tips mt-4">
                                        <h6 class="mb-3">
                                            <i class="fas fa-lightbulb me-2 text-warning"></i>Tips Keamanan
                                        </h6>
                                        <ul class="tips-list">
                                            <li><i class="fas fa-check me-2 text-success"></i>Gunakan minimal 6 karakter</li>
                                            <li><i class="fas fa-check me-2 text-success"></i>Kombinasikan huruf besar dan kecil</li>
                                            <li><i class="fas fa-check me-2 text-success"></i>Tambahkan angka dan simbol</li>
                                            <li><i class="fas fa-check me-2 text-success"></i>Hindari menggunakan kata sandi yang sama</li>
                                        </ul>
                                    </div>
                                </div>
                                
                                <!-- Info Card -->
                                <div class="info-card mt-4">
                                    <div class="info-card-content">
                                        <div class="info-card-header">
                                            <div class="info-icon-wrapper">
                                                <i class="fas fa-headset"></i>
                                            </div>
                                            <div>
                                                <h6 class="info-card-title">Butuh Bantuan?</h6>
                                                <p class="info-card-subtitle">Hubungi Administrator</p>
                                            </div>
                                        </div>
                                        <div class="info-card-body">
                                            <p class="info-card-text">
                                                <i class="fas fa-envelope me-2 text-primary"></i>
                                                admin@polibatam.ac.id
                                            </p>
                                            <p class="info-card-text mb-0">
                                                <i class="fas fa-phone me-2 text-success"></i>
                                                (0778) 123-4567
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

<?php
$extra_scripts = '<script src="../assets/js/password-manager.js"></script>';
include 'shared-layout-footer.php';
?>

