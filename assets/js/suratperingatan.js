// Surat Peringatan management with database integration
// Features: open/close modal, add row, edit row, delete row, empty placeholder toggle

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addSPBtn');
  const modal = document.getElementById('spModal');
  const backdrop = document.getElementById('spModalBackdrop');
  const modalContent = document.querySelector('.modal-content');
  const closeBtn = document.getElementById('spModalClose');
  const cancelBtn = document.getElementById('spCancelBtn');
  const form = document.getElementById('spForm');
  const tableBody = document.querySelector('#spTable tbody');
  const emptyPlaceholder = document.getElementById('emptyPlaceholderSP');
  const searchInput = document.getElementById('searchSP');

  let spData = [];
  let rowCounter = 1;
  let mahasiswaData = [];
  let activeSPList = []; // Untuk menyimpan SP yang sudah aktif

  async function checkActiveSP(nim) {
    try {
      const response = await fetch(`../crud/surat_peringatan.php?check_nim=${encodeURIComponent(nim)}`);
      const data = await response.json();
      activeSPList = data.sp_aktif || [];
      updateTingkatanOptions();
    } catch (error) {
      console.error('Error checking active SP:', error);
      activeSPList = [];
    }
  }

  function updateTingkatanOptions() {
    const tingkatanSelect = document.getElementById('spTingkatanInput');
    if (!tingkatanSelect) return;
    
    const options = tingkatanSelect.querySelectorAll('option:not([value=""])');
    options.forEach(option => {
      if (activeSPList.includes(option.value)) {
        option.disabled = true;
        option.textContent = option.textContent.split(' - ')[0] + ' - Sudah ada (Pilih tingkatan lain)';
      } else {
        option.disabled = false;
        option.textContent = option.textContent.split(' - ')[0];
      }
    });
  }

  function openModal(editData) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // store edit data if editing
    if (editData) {
      form.dataset.editId = String(editData.id);
      // populate form
      document.getElementById('spNimInput').value = editData.nim;
      document.getElementById('spNamaInput').value = editData.nama;
      document.getElementById('spKaprodiInput').value = editData.ketua_prodi || '';
      document.getElementById('spWaliInput').value = editData.wali_dosen || '';
      document.getElementById('spTingkatanInput').value = editData.tingkatan_sp;
      document.getElementById('spAlasanInput').value = editData.alasan_sp;
      
      // Check active SP untuk nim ini (ketika edit)
      checkActiveSP(editData.nim);
    } else {
      form.removeAttribute('data-edit-id');
      form.reset();
      clearAutoFill();
      activeSPList = []; // Reset list SP aktif
      const tingkatanSelect = document.getElementById('spTingkatanInput');
      if (tingkatanSelect) {
        tingkatanSelect.querySelectorAll('option:not([value=""])').forEach(option => {
          option.disabled = false;
          option.textContent = option.textContent.split(' - ')[0];
        });
      }
    }
    // focus pertama
    setTimeout(() => {
      const first = form.querySelector('input, select');
      if (first) first.focus();
    }, 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling
    form.removeAttribute('data-edit-id');
    form.reset();
  }

  function updateEmptyState() {
    if (!tableBody) return;
    const hasRows = tableBody.querySelectorAll('tr').length > 0;
    if (emptyPlaceholder) emptyPlaceholder.style.display = hasRows ? 'none' : '';
  }

  function createCell(text) {
    const td = document.createElement('td');
    td.textContent = text || '';
    return td;
  }

  function addRowToTable(sp) {
    const tr = document.createElement('tr');
    tr.dataset.id = sp.id;
    tr.appendChild(createCell(rowCounter++)); // No urut
    tr.appendChild(createCell(sp.nim));
    tr.appendChild(createCell(sp.nama));
    tr.appendChild(createCell(sp.ketua_prodi));
    tr.appendChild(createCell(sp.wali_dosen));
    tr.appendChild(createCell(sp.tingkatan_sp));
    tr.appendChild(createCell(sp.alasan_sp));

    // Status cell dengan badge styling
    const statusTd = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = 'status-badge';
    
    if (sp.status === 'Aktif') {
      statusBadge.classList.add('status-aktif');
      statusBadge.innerHTML = '<i class="ri-check-circle-line"></i> Aktif';
    } else {
      statusBadge.classList.add('status-tidak-aktif');
      statusBadge.innerHTML = '<i class="ri-close-circle-line"></i> Tidak Aktif';
    }
    
    statusTd.appendChild(statusBadge);
    tr.appendChild(statusTd);

    const actionTd = document.createElement('td');
    actionTd.className = 'table-actions';

    // View/Detail button
    const viewBtn = document.createElement('button');
    viewBtn.className = 'action-btn view';
    viewBtn.type = 'button';
    viewBtn.title = 'Lihat Detail';
    viewBtn.innerHTML = '<i class="ri-file-text-line"></i>';
    viewBtn.addEventListener('click', () => {
      // View logic here
      alert('Detail Surat Peringatan:\n\nNIM: ' + sp.nim + '\nNama: ' + sp.nama + '\nTingkatan: ' + sp.tingkatan_sp + '\nAlasan: ' + sp.alasan_sp);
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<i class="ri-edit-2-line"></i>';
    editBtn.addEventListener('click', () => {
      openModal(sp);
    });

    // Download PDF button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'action-btn download';
    downloadBtn.type = 'button';
    downloadBtn.title = 'Unduh PDF';
    downloadBtn.innerHTML = '<i class="ri-download-2-line"></i>';
    downloadBtn.addEventListener('click', () => {
      // Download logic here
      alert('Mengunduh surat peringatan dalam format PDF...');
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete';
    delBtn.type = 'button';
    delBtn.title = 'Hapus';
    delBtn.innerHTML = '<i class="ri-delete-bin-5-line"></i>';
    delBtn.addEventListener('click', () => {
      if (confirm('Hapus surat peringatan ini?')) {
        deleteSP(sp.id);
      }
    });

    // Menambahkan semua tombol ke dalam actionTd
    actionTd.appendChild(viewBtn);
    actionTd.appendChild(document.createTextNode(' '));
    actionTd.appendChild(editBtn);
    actionTd.appendChild(document.createTextNode(' '));
    actionTd.appendChild(downloadBtn);
    actionTd.appendChild(document.createTextNode(' '));
    actionTd.appendChild(delBtn);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
    updateEmptyState();
  }

  // API functions
  async function loadSP(search = '') {
    try {
      const url = search ? `../crud/surat_peringatan.php?search=${encodeURIComponent(search)}` : '../crud/surat_peringatan.php';
      const response = await fetch(url);
      const data = await response.json();
      spData = data;
      renderTable();
    } catch (error) {
      console.error('Error loading SP:', error);
      alert('Gagal memuat data surat peringatan');
    }
  }

  async function loadMahasiswa() {
    try {
      const response = await fetch('../crud/mahasiswa.php');
      const data = await response.json();
      mahasiswaData = data;
      populateStudentDropdown();
    } catch (error) {
      console.error('Error loading mahasiswa:', error);
      alert('Gagal memuat data mahasiswa');
    }
  }

  async function saveSP(spData) {
    try {
      const response = await fetch('../crud/surat_peringatan.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spData),
      });
      const result = await response.json();
      if (result.success) {
        await loadSP();
        return true;
      } else {
        // Handle error - check jika duplicate entry
        if (result.error && result.error.includes('Duplicate entry')) {
          alert(`Tingkatan ${spData.tingkatan_sp} sudah ada untuk mahasiswa ini. Data akan diperbarui otomatis.`);
          // Reload data untuk tampilkan perubahan
          await loadSP();
          return true;
        } else {
          alert('Gagal menyimpan data: ' + result.error);
        }
        return false;
      }
    } catch (error) {
      console.error('Error saving SP:', error);
      alert('Gagal menyimpan data surat peringatan');
      return false;
    }
  }

  async function updateSP(id, spData) {
    try {
      const data = { id, ...spData };
      const response = await fetch('../crud/surat_peringatan.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await loadSP();
        return true;
      } else {
        alert('Gagal mengupdate data: ' + result.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating SP:', error);
      alert('Gagal mengupdate data surat peringatan');
      return false;
    }
  }

  async function deleteSP(id) {
    try {
      const response = await fetch(`../crud/surat_peringatan.php?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        await loadSP();
      } else {
        alert('Gagal menghapus data: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting SP:', error);
      alert('Gagal menghapus data surat peringatan');
    }
  }

  function renderTable() {
    tableBody.innerHTML = '';
    rowCounter = 1;
    spData.forEach(sp => addRowToTable(sp));
  }

  function populateStudentDropdown() {
    const nimDatalist = document.getElementById('nimDatalist');
    if (!nimDatalist) return;
    nimDatalist.innerHTML = '';
    mahasiswaData.forEach(student => {
      const option = document.createElement('option');
      option.value = student.nim;
      option.textContent = `${student.nim} - ${student.nama}`;
      nimDatalist.appendChild(option);
    });
  }

  function autoFillStudentData(nim) {
    const namaInput = document.getElementById('spNamaInput');
    const waliInput = document.getElementById('spWaliInput');

    const student = mahasiswaData.find(s => s.nim === nim);
    if (student) {
      namaInput.value = student.nama;
      waliInput.value = student.wali_dosen || '';
      namaInput.classList.add('auto-filled');
      waliInput.classList.add('auto-filled');
      namaInput.readOnly = true;
      waliInput.readOnly = true;
    } else {
      // Clear auto-fill if no student found
      clearAutoFill();
    }
  }

  function clearAutoFill() {
    const namaInput = document.getElementById('spNamaInput');
    const waliInput = document.getElementById('spWaliInput');

    namaInput.classList.remove('auto-filled');
    waliInput.classList.remove('auto-filled');
    namaInput.readOnly = false;
    waliInput.readOnly = false;
  }

  // Event listeners
  if (addBtn) addBtn.addEventListener('click', () => openModal());
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  // modal close when clicking outside modal-content
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Search functionality
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        loadSP(e.target.value);
      }, 300);
    });
  }

  // Auto-fill functionality for NIM input
  const nimInput = document.getElementById('spNimInput');
  if (nimInput) {
    nimInput.addEventListener('input', (e) => {
      const nim = e.target.value.trim();
      if (nim) {
        autoFillStudentData(nim);
        // Check SP aktif untuk nim ini
        checkActiveSP(nim);
      } else {
        activeSPList = [];
        const tingkatanSelect = document.getElementById('spTingkatanInput');
        if (tingkatanSelect) {
          tingkatanSelect.querySelectorAll('option:not([value=""])').forEach(option => {
            option.disabled = false;
            option.textContent = option.textContent.split(' - ')[0];
          });
        }
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nim = (document.getElementById('spNimInput') || {}).value?.trim();
      const nama = (document.getElementById('spNamaInput') || {}).value?.trim();
      const kaprodi = (document.getElementById('spKaprodiInput') || {}).value?.trim();
      const wali = (document.getElementById('spWaliInput') || {}).value?.trim();
      const tingkatan = (document.getElementById('spTingkatanInput') || {}).value;
      const alasan = (document.getElementById('spAlasanInput') || {}).value?.trim();

      if (!nim || !nama) {
        alert('NIM dan Nama harus diisi.');
        return;
      }

      // Validate required fields
      if (!tingkatan) {
        alert('Tingkatan SP harus dipilih.');
        return;
      }

      if (!alasan) {
        alert('Alasan SP harus diisi.');
        return;
      }

      // VALIDASI TAMBAHAN: Cek jika tidak dalam edit mode dan tingkatan sudah ada
      const editId = form.getAttribute('data-edit-id');
      if (!editId && activeSPList.includes(tingkatan)) {
        alert(`Tingkatan ${tingkatan} sudah ada untuk mahasiswa ini. Pilih tingkatan lain!`);
        return;
      }

      const sp = {
        nim,
        nama,
        ketua_prodi: kaprodi,
        wali_dosen: wali,
        tingkatan_sp: tingkatan,
        alasan_sp: alasan
      };

      let success = false;
      if (editId) {
        success = await updateSP(editId, sp);
      } else {
        success = await saveSP(sp);
      }

      if (success) {
        closeModal();
      }
    });
  }

  // Load initial data
  loadSP();
  loadMahasiswa();
});
