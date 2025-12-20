<?php
$page_title = 'Surat Peringatan';
include 'shared-layout.php';
?>

            <section class="content-section active">
                <div class="content-data-mahasiswa">
                    <div class="mahasiswa-header">
                        <div>
                            <h4 class="form-title" style="margin:0; font-size: 1.875rem; font-weight: 700; color: var(--gray-900); letter-spacing: -0.025em;">Kelola Surat Peringatan</h4>
                            <p style="color:var(--gray-600);margin:var(--space-sm) 0 0 0; font-size: 1rem; line-height: 1.5;">Manajemen surat peringatan mahasiswa, anda dapat menambahkan, mengubah, dan menghapus surat peringatan.</p>
                        </div>
                        <div class="mahasiswa-actions">
                            <div class="search-input">
                                <i class="fas fa-search search-icon"></i>
                                <input 
                                    type="text" 
                                    id="searchSP" 
                                    placeholder="Cari surat peringatan..."
                                    aria-label="Cari surat peringatan"
                                />
                            </div>
                            <button id="addSPBtn" class="btn btn-primary">
                                <i class="fas fa-plus"></i>
                                <span>Tambah Surat Peringatan</span>
                            </button>
                        </div>
                    </div>

                    <div class="table-container">
                        <div class="table-card">
                            <table class="data-table" id="spTable">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>NIM</th>
                                        <th>Nama</th>
                                        <th>Ketua Prodi</th>
                                        <th>Wali Dosen</th>
                                        <th>Tingkatan SP</th>
                                        <th>Tanggal Surat</th>
                                        <th>Alasan SP</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                            <div class="placeholder-box mt-1" id="emptyPlaceholderSP" style="display:none;">
                                <i class="fas fa-file-circle-exclamation" style="font-size: 2.5rem; color: var(--gray-600); margin-bottom: 0.5rem;"></i>
                                <p style="margin: 0; font-size: 0.875rem; color: var(--gray-700); font-weight: 500;">Belum ada data surat peringatan</p>
                                <p style="margin: 0.25rem 0 0 0; font-size: 0.8125rem; color: var(--gray-600);">Klik tombol "Tambah Surat Peringatan" untuk menambahkan data</p>
                            </div>
                        </div>
                    </div>

                    <!-- Modal Tambah / Edit Surat Peringatan -->
                    <div id="spModal" class="modal" aria-hidden="true">
                        <div class="modal-backdrop" id="spModalBackdrop"></div>
                        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="spModalTitle">
                            <button class="modal-close" id="spModalClose" aria-label="Tutup">&times;</button>
                            <h3 id="spModalTitle" style="margin-top:0">Tambah Surat Peringatan</h3>
                            <form id="spForm">
                                <div class="mb-1 row">
                                    <label for="spNimInput" class="col-sm-3 col-form-label">NIM</label>
                                    <div class="col-sm-9">
                                        <input id="spNimInput" type="text" class="form-control" required placeholder="Masukkan NIM" list="nimDatalist" autocomplete="off">
                                        <datalist id="nimDatalist"></datalist>
                                    </div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="spNamaInput" class="col-sm-3 col-form-label">Nama</label>
                                    <div class="col-sm-9"><input id="spNamaInput" type="text" class="form-control" required placeholder="Masukkan Nama" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="spKaprodiInput" class="col-sm-3 col-form-label">Ketua Prodi</label>
                                    <div class="col-sm-9"><input id="spKaprodiInput" type="text" class="form-control" required placeholder="Masukkan nama Ketua Prodi" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="spWaliInput" class="col-sm-3 col-form-label">Wali Dosen</label>
                                    <div class="col-sm-9"><input id="spWaliInput" type="text" class="form-control" required placeholder="Masukkan nama Wali Dosen" /></div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="spTingkatanInput" class="col-sm-3 col-form-label">Tingkatan SP</label>
                                    <div class="col-sm-9">
                                        <select id="spTingkatanInput" class="form-control" required>
                                            <option value="">Pilih Tingkatan SP</option>
                                            <option value="SP1">SP 1</option>
                                            <option value="SP2">SP 2</option>
                                            <option value="SP3">SP 3</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="spAlasanInput" class="col-sm-3 col-form-label">Alasan SP</label>
                                    <div class="col-sm-9">
                                        <textarea id="spAlasanInput" class="form-control" required placeholder="Masukkan alasan terkena SP" rows="3"></textarea>
                                    </div>
                                </div>
                                <div class="mb-1 row">
                                    <label for="spTanggalInput" class="col-sm-3 col-form-label">Tanggal Surat</label>
                                    <div class="col-sm-9">
                                        <input id="spTanggalInput" type="date" class="form-control" required placeholder="Pilih tanggal surat" />
                                    </div>
                                </div>
                                <div style="display:flex;justify-content:flex-end;gap:0.5rem;margin-top:1rem;">
                                    <button type="button" class="btn btn-ghost" id="spCancelBtn">Batal</button>
                                    <button type="submit" class="btn btn-primary" id="spSaveBtn">Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

<?php
$extra_scripts = '<script src="../assets/js/suratperingatan.js"></script>';
include 'shared-layout-footer.php';
?>
