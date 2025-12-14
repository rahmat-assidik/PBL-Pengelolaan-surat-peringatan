<?php
$page_title = 'Data Mahasiswa';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <div class="content-data-mahasiswa">
                    <div class="mahasiswa-header">
                        <div>
                            <h4 class="form-title" style="margin:0; font-size: 1.875rem; font-weight: 700; color: var(--gray-900); letter-spacing: -0.025em;">Data Mahasiswa</h4>
                            <p style="color:var(--gray-600);margin:var(--space-sm) 0 0 0; font-size: 1rem; line-height: 1.5;">Manajemen Data Mahasiswa, anda dapat menambahkan, mengubah, dan menghapus data mahasiswa.</p>
                        </div>
                        <div class="mahasiswa-actions">
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
                                <i class="fas fa-plus"></i>
                                <span>Tambah Mahasiswa</span>
                            </button>
                        </div>
                    </div>

                    <div class="table-container">
                        <div class="table-card">
                            <table class="data-table" id="mahasiswaTable">
                                <thead>
                                    <tr>
                                        <th>NIM</th>
                                        <th>Nama</th>
                                        <th>Prodi</th>
                                        <th>Semester</th>
                                        <th>Wali Dosen</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="placeholder-box mt-1" id="emptyPlaceholder" style="display:none;">
                                <i class="fas fa-users" style="font-size: 2.5rem; color: var(--gray-600); margin-bottom: 0.5rem;"></i>
                                <p style="margin: 0; font-size: 0.875rem; color: var(--gray-700); font-weight: 500;">Belum ada data mahasiswa</p>
                                <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--gray-600);">Klik tombol "Tambah Mahasiswa" untuk menambahkan data</p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Tambah / Edit Mahasiswa -->
                    <div id="mahasiswaModal" class="modal" aria-hidden="true">
                        <div class="modal-backdrop" id="modalBackdrop"></div>
                        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
                            <button class="modal-close" id="modalClose" aria-label="Tutup">&times;</button>
                            <h3 id="modalTitle" style="margin-top:0">Tambah Mahasiswa</h3>
                            <form id="mahasiswaForm">
                                <div class="mb-1 row">
                                    <label for="nimInput" class="col-sm-3 col-form-label">NIM</label>
                                    <div class="col-sm-9"><input id="nimInput" type="text" class="form-control" required placeholder="Masukkan NIM" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="namaInput" class="col-sm-3 col-form-label">Nama</label>
                                    <div class="col-sm-9"><input id="namaInput" type="text" class="form-control" required placeholder="Masukkan Nama" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="prodiInput" class="col-sm-3 col-form-label">Prodi</label>
                                    <div class="col-sm-9"><input id="prodiInput" type="text" class="form-control" placeholder="Masukkan Prodi" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="semesterInput" class="col-sm-3 col-form-label">Semester</label>
                                    <div class="col-sm-9"><input id="semesterInput" type="number" min="1" class="form-control" placeholder="Masukkan Semester" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="waliInput" class="col-sm-3 col-form-label">Wali Dosen</label>
                                    <div class="col-sm-9"><input id="waliInput" type="text" class="form-control" placeholder="Masukkan nama wali dosen" /></div>
                                </div>
                                <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
                                    <button type="button" class="btn btn-ghost" id="cancelBtn">Batal</button>
                                    <button type="submit" class="btn btn-primary" id="saveBtn">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

<?php
$extra_scripts = '<script src="../assets/js/data-mahasiswa.js"></script>';
include 'shared-layout-footer.php';
?>
