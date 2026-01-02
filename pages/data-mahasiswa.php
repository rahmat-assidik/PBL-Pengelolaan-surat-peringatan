<?php
$page_title = 'Data Mahasiswa';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <div class="card card-primary">
                    <div class="card-header">
                        <h5 class="card-title">
                            <i class="fas fa-user-graduate me-2"></i>
                            Data Mahasiswa
                        </h5>
                    </div>
                    <div class="card-body">
                        <!-- Toolbar -->
                        <div class="toolbar">
                            <div class="toolbar-left">
                                <h4 class="toolbar-title">
                                    Manajemen Data Mahasiswa
                                </h4>
                                <p class="toolbar-description">Anda dapat menambahkan, mengubah, dan menghapus data mahasiswa.</p>
                            </div>
                            <div class="toolbar-actions">
                                <!-- Filter Section -->
                                <div class="filter-section me-2">
                                    <select id="filterProdi" class="form-select form-select-sm" aria-label="Filter Prodi">
                                        <option value="">Semua Prodi</option>
                                        <option value="Teknik Informatika">Teknik Informatika</option>
                                        <option value="Teknik Elektro">Teknik Elektro</option>
                                        <option value="Teknik Mesin">Teknik Mesin</option>
                                        <option value="Teknik Kimia">Teknik Kimia</option>
                                        <option value="Akuntansi">Akuntansi</option>
                                        <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                                    </select>
                                </div>
                                <div class="filter-section me-2">
                                    <select id="filterSemester" class="form-select form-select-sm" aria-label="Filter Semester">
                                        <option value="">Semua Semester</option>
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                        <option value="3">Semester 3</option>
                                        <option value="4">Semester 4</option>
                                        <option value="5">Semester 5</option>
                                        <option value="6">Semester 6</option>
                                        <option value="7">Semester 7</option>
                                        <option value="8">Semester 8</option>
                                    </select>
                                </div>
                                <div class="filter-section me-2">
                                    <button id="resetFilterMahasiswa" class="btn btn-outline-secondary btn-sm" title="Reset Filter">
                                        <i class="fas fa-filter-slash"></i>
                                    </button>
                                </div>
                                <div class="search-input">
                                    <i class="fas fa-search search-icon"></i>
                                    <input 
                                        type="text" 
                                        id="searchMahasiswa" 
                                        placeholder="Cari mahasiswa..."
                                        aria-label="Cari mahasiswa"
                                    />
                                </div>
                                <button id="addMahasiswaBtn" class="btn btn-primary">
                                    <i class="fas fa-plus me-1"></i>
                                    <span>Tambah Mahasiswa</span>
                                </button>
                            </div>
                        </div>

                        <!-- Table -->
                        <div class="table-responsive">
                            <table class="table" id="mahasiswaTable">
                                <thead>
                                    <tr>
                                        <th style="width: 60px;">No.</th>
                                        <th>NIM</th>
                                        <th>Nama</th>
                                        <th>Prodi</th>
                                        <th>Semester</th>
                                        <th>Wali Dosen</th>
                                        <th class="text-end" style="width: 130px;">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="placeholder-box" id="emptyPlaceholder" style="display:none;">
                                <i class="fas fa-users"></i>
                                <p>Belum ada data mahasiswa</p>
                                <p class="text-muted">Klik tombol "Tambah Mahasiswa" untuk menambahkan data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Modal Tambah / Edit Mahasiswa -->
            <div class="modal fade" id="mahasiswaModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalTitle">
                                <i class="fas fa-user-plus me-2"></i>
                                <span>Tambah Mahasiswa</span>
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form id="mahasiswaForm">
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="nimInput" class="form-label">NIM</label>
                                        <input id="nimInput" type="text" class="form-control" required placeholder="Masukkan NIM" />
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="namaInput" class="form-label">Nama</label>
                                        <input id="namaInput" type="text" class="form-control" required placeholder="Masukkan Nama" />
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="prodiInput" class="form-label">Prodi</label>
                                        <select id="prodiInput" class="form-select" required>
                                            <option value="">Pilih Prodi</option>
                                            <option value="Teknik Informatika">Teknik Informatika</option>
                                            <option value="Teknik Elektro">Teknik Elektro</option>
                                            <option value="Teknik Mesin">Teknik Mesin</option>
                                            <option value="Teknik Kimia">Teknik Kimia</option>
                                            <option value="Akuntansi">Akuntansi</option>
                                            <option value="Administrasi Bisnis">Administrasi Bisnis</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="semesterInput" class="form-label">Semester</label>
                                        <select id="semesterInput" class="form-select" required>
                                            <option value="">Pilih Semester</option>
                                            <option value="1">Semester 1</option>
                                            <option value="2">Semester 2</option>
                                            <option value="3">Semester 3</option>
                                            <option value="4">Semester 4</option>
                                            <option value="5">Semester 5</option>
                                            <option value="6">Semester 6</option>
                                            <option value="7">Semester 7</option>
                                            <option value="8">Semester 8</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="waliInput" class="form-label">Wali Dosen</label>
                                    <input id="waliInput" type="text" class="form-control" required placeholder="Masukkan nama wali dosen" />
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-1"></i>
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Modal Detail Mahasiswa -->
            <div class="modal fade" id="mahasiswaDetailModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title">
                                <i class="fas fa-user-graduate me-2"></i>
                                Detail Data Mahasiswa
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">NIM</label>
                                    <p id="detailMhsNim" class="form-control-static">-</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Nama</label>
                                    <p id="detailMhsNama" class="form-control-static">-</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Program Studi</label>
                                    <p id="detailMhsProdi" class="form-control-static">-</p>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label fw-bold">Semester</label>
                                    <p id="detailMhsSemester" class="form-control-static">-</p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12 mb-3">
                                    <label class="form-label fw-bold">Wali Dosen</label>
                                    <p id="detailMhsWali" class="form-control-static">-</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                <i class="fas fa-times me-1"></i>
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>

<?php
$extra_scripts = '<script src="../assets/js/data-mahasiswa.js"></script>';
include 'shared-layout-footer.php';
?>

