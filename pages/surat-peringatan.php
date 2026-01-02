<?php
$page_title = 'Surat Peringatan';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <div class="card card-warning">
                    <div class="card-header">
                        <h5 class="card-title">
                            <i class="fas fa-file-circle-exclamation me-2"></i>
                            Kelola Surat Peringatan
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- Toolbar -->
                        <div class="toolbar">
                            <div class="toolbar-left">
                                <h4 class="toolbar-title">
                                    Manajemen Surat Peringatan
                                </h4>
                                <p class="toolbar-description">Anda dapat menambahkan, mengubah, dan menghapus surat peringatan.</p>
                            </div>
                            <div class="toolbar-actions">
                                <!-- Filter Section -->
                                <div class="filter-section me-2">
                                    <select id="filterTingkatSP" class="form-select form-select-sm" aria-label="Filter Tingkat SP">
                                        <option value="">Semua Tingkat</option>
                                        <option value="SP1">SP1</option>
                                        <option value="SP2">SP2</option>
                                        <option value="SP3">SP3</option>
                                    </select>
                                </div>
                                <div class="filter-section me-2">
                                    <input type="date" id="filterTanggalMulai" class="form-control form-control-sm" placeholder="Dari Tanggal" aria-label="Dari Tanggal">
                                </div>
                                <div class="filter-section me-2">
                                    <input type="date" id="filterTanggalSelesai" class="form-control form-control-sm" placeholder="Sampai Tanggal" aria-label="Sampai Tanggal">
                                </div>
                                <div class="filter-section me-2">
                                    <button id="resetFilterSP" class="btn btn-outline-secondary btn-sm" title="Reset Filter">
                                        <i class="fas fa-filter-slash"></i>
                                    </button>
                                </div>
                                <div class="search-input">
                                    <i class="fas fa-search search-icon"></i>
                                    <input 
                                        type="text" 
                                        id="searchSP" 
                                        placeholder="Cari surat peringatan..."
                                        aria-label="Cari surat peringatan"
                                    />
                                </div>
                                <button id="addSPBtn" class="btn btn-warning">
                                    <i class="fas fa-plus me-1"></i>
                                    <span>Tambah Surat</span>
                                </button>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="table-responsive">
                            <table class="table" id="spTable">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NIM</th>
                                        <th>Nama</th>
                                        <th>Ket. Prodi</th>
                                        <th>Wali Dosen</th>
                                        <th>Tingkat SP</th>
                                        <th>Tanggal</th>
                                        <th class="text-end">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="placeholder-box" id="emptyPlaceholderSP" style="display:none;">
                                <i class="fas fa-file-circle-exclamation"></i>
                                <p>Belum ada data surat peringatan</p>
                                <p class="text-muted">Klik tombol "Tambah Surat" untuk menambahkan data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Modal Tambah / Edit Surat Peringatan -->
            <div class="modal fade" id="spModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="spModalTitle">
                                <i class="fas fa-file-plus me-2"></i>
                                Tambah Surat Peringatan
                            </h5>
                            <button type="button" class="btn-close" id="spModalClose" aria-label="Close"></button>
                        </div>
                        <form id="spForm">
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="spNimInput" class="form-label">NIM</label>
                                        <input id="spNimInput" type="text" class="form-control" required placeholder="Masukkan NIM" list="nimDatalist" autocomplete="off">
                                        <datalist id="nimDatalist"></datalist>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="spNamaInput" class="form-label">Nama</label>
                                        <input id="spNamaInput" type="text" class="form-control" required placeholder="Masukkan Nama" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="spKaprodiInput" class="form-label">Ket. Prodi</label>
                                        <input id="spKaprodiInput" type="text" class="form-control" required placeholder="Masukkan nama Ketua Prodi" />
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="spWaliInput" class="form-label">Wali Dosen</label>
                                        <input id="spWaliInput" type="text" class="form-control" required placeholder="Masukkan nama Wali Dosen" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="spTingkatInput" class="form-label">Tingkat SP</label>
                                        <select id="spTingkatInput" class="form-select" required>
                                            <option value="">Pilih Tingkat SP</option>
                                            <option value="SP1">SP 1</option>
                                            <option value="SP2">SP 2</option>
                                            <option value="SP3">SP 3</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="spTanggalInput" class="form-label">Tanggal Surat</label>
                                        <input id="spTanggalInput" type="date" class="form-control" required />
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="spAlasanInput" class="form-label">Alasan SP</label>
                                    <textarea id="spAlasanInput" class="form-control" required placeholder="Masukkan alasan terkena SP" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="spCancelBtn" data-bs-dismiss="modal">Batal</button>
                                <button type="submit" class="btn btn-warning">
                                    <i class="fas fa-save me-1"></i>
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

<?php
$extra_scripts = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="../assets/js/suratperingatan.js"></script>';
include 'shared-layout-footer.php';
?>

