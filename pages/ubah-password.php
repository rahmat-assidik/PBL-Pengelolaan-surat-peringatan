<?php
$page_title = 'Ubah Kata Sandi';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <div style="margin-bottom: var(--space-2xl);">
                    <h2 style="margin-bottom: var(--space-sm); color: var(--gray-900); font-size: 1.875rem; font-weight: 700; letter-spacing: -0.025em;">Manajemen Password</h2>
                    <p style="color: var(--gray-600); margin: 0; font-size: 1rem; line-height: 1.5;">Ubah kata sandi akun Anda di sini.</p>
                </div>
                <div class="password-card">
                    <form id="changePasswordForm">
                        <div class="input-password-group">
                            <label for="currentPassword">Kata sandi saat ini</label>
                            <div class="input-password-wrapper">
                                <input id="currentPassword" type="password" required="required"/>
                                <button
                                    type="button"
                                    class="toggle-password-visibility"
                                    tabindex="-1"
                                    aria-label="Tampilkan/Sembunyikan sandi">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="input-password-group">
                            <label for="newPassword">Kata sandi baru</label>
                            <div class="input-password-wrapper">
                                <input id="newPassword" type="password" required="required" minlength="6"/>
                                <button
                                    type="button"
                                    class="toggle-password-visibility"
                                    tabindex="-1"
                                    aria-label="Tampilkan/Sembunyikan sandi">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="input-password-group">
                            <label for="confirmPassword">Konfirmasi kata sandi baru</label>
                            <div class="input-password-wrapper">
                                <input id="confirmPassword" type="password" required="required" minlength="6"/>
                                <button
                                    type="button"
                                    class="toggle-password-visibility"
                                    tabindex="-1"
                                    aria-label="Tampilkan/Sembunyikan sandi">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit">Ubah Kata Sandi</button>
                        <p id="passwordMessage" style="margin-top:8px;color:var(--gray-800);"></p>
                    </form>
                </div>
            </section>

<?php
$extra_scripts = '<script src="../assets/js/password-manager.js"></script>';
include 'shared-layout-footer.php';
?>
