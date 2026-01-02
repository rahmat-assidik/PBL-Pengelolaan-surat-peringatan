<?php
// shared-layout-footer.php - Include this at the end of content
?>
        </main>
        
        <!-- Main Footer -->
        <footer class="main-footer">
            <div class="float-end d-none d-sm-inline">
                <strong>Version</strong> 1.0.0
            </div>
            <strong>Copyright &copy; <?php echo date('Y'); ?> <a href="#">Pengelolaan Surat Peringatan</a>.</strong> All rights reserved.
        </footer>
    </div>

    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- App JS -->
    <script src="../assets/js/app.js"></script>
    
    <!-- Logout handler -->
    <script src="../assets/js/logout-handler.js"></script>
    
    <?php if (isset($extra_scripts)): ?>
        <?php echo $extra_scripts; ?>
    <?php endif; ?>
</body>
</html>

