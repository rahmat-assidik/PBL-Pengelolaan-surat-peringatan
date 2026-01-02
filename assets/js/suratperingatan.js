// Surat Peringatan management with AdminLTE styling + Pagination
document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addSPBtn');
  const modalEl = document.getElementById('spModal');
  const modalBackdrop = document.getElementById('spModalBackdrop');
  const modalCloseBtn = document.getElementById('spModalClose');
  const cancelBtn = document.getElementById('spCancelBtn');
  const form = document.getElementById('spForm');
  const tableBody = document.querySelector('#spTable tbody');
  const emptyPlaceholder = document.getElementById('emptyPlaceholderSP');
  const searchInput = document.getElementById('searchSP');
  const filterTingkatSP = document.getElementById('filterTingkatSP');
  const filterTanggalMulai = document.getElementById('filterTanggalMulai');
  const filterTanggalSelesai = document.getElementById('filterTanggalSelesai');

  let spData = [];
  let mahasiswaData = [];
  let modalInstance = null;
  let currentPage = 1;
  let paginationData = null;
  
  // Filter state management - persist filters across pagination
  const filterState = {
    search: '',
    tingkatan_sp: '',
    tanggal_mulai: '',
    tanggal_selesai: ''
  };

  // Initialize Bootstrap 5 modal
  if (modalEl) {
    modalInstance = new bootstrap.Modal(modalEl, {
      backdrop: 'static',
      keyboard: true
    });
  }

  function openModal(editData) {
    if (!modalEl || !modalInstance) return;
    
    const modalTitle = document.getElementById('spModalTitle');
    const icon = modalTitle.querySelector('i');
    
    if (editData) {
      // Edit mode
      icon.className = 'fas fa-edit me-2';
      form.dataset.editId = String(editData.id);
      modalTitle.innerHTML = '<i class="fas fa-edit me-2"></i>Edit Surat Peringatan';
      document.getElementById('spNimInput').value = editData.nim || '';
      document.getElementById('spNamaInput').value = editData.nama || '';
      document.getElementById('spKaprodiInput').value = editData.ketua_prodi || '';
      document.getElementById('spWaliInput').value = editData.wali_dosen || '';
      document.getElementById('spTingkatInput').value = editData.tingsp || '';
      document.getElementById('spAlasanInput').value = editData.alasan_sp || '';
      
      // Set tanggal - use tgl_sp from database
      const tanggalInput = document.getElementById('spTanggalInput');
      if (editData.tgl_sp) {
        const date = new Date(editData.tgl_sp);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          tanggalInput.value = `${year}-${month}-${day}`;
        } else {
          tanggalInput.value = editData.tgl_sp;
        }
      } else {
        tanggalInput.value = '';
      }
    } else {
      // Add mode
      icon.className = 'fas fa-file-plus me-2';
      form.removeAttribute('data-edit-id');
      modalTitle.innerHTML = '<i class="fas fa-file-plus me-2"></i>Tambah Surat Peringatan';
      form.reset();
      clearAutoFill();
      
      // Set default tanggal to today
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      document.getElementById('spTanggalInput').value = `${year}-${month}-${day}`;
    }
    
    modalInstance.show();
    
    setTimeout(() => {
      const firstInput = form.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  }

  function closeModal() {
    if (!modalInstance) return;
    modalInstance.hide();
    form.removeAttribute('data-edit-id');
    clearAutoFill();
  }

  function updateEmptyState() {
    if (!tableBody) return;
    const hasRows = tableBody.querySelectorAll('tr').length > 0;
    if (emptyPlaceholder) {
      emptyPlaceholder.style.display = hasRows ? 'none' : 'block';
    }
    // Hide table when empty
    const table = document.getElementById('spTable');
    if (table) {
      table.style.display = hasRows ? '' : 'none';
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('id-ID');
    }
    return dateStr;
  }

  function addRowToTable(sp, index) {
    const tr = document.createElement('tr');
    tr.dataset.id = sp.id;
    
    // Calculate correct number based on current page
    const startNum = (paginationData && paginationData.page) ? ((paginationData.page - 1) * paginationData.limit + 1) : 1;
    
    // No
    const noTd = document.createElement('td');
    noTd.textContent = startNum + index;
    tr.appendChild(noTd);
    
    // NIM
    const nimTd = document.createElement('td');
    nimTd.textContent = sp.nim;
    tr.appendChild(nimTd);
    
    // Nama
    const namaTd = document.createElement('td');
    namaTd.textContent = sp.nama;
    tr.appendChild(namaTd);
    
    // Ketua Prodi
    const kaprodiTd = document.createElement('td');
    kaprodiTd.textContent = sp.ketua_prodi || '';
    tr.appendChild(kaprodiTd);
    
    // Wali Dosen
    const waliTd = document.createElement('td');
    waliTd.textContent = sp.wali_dosen || '';
    tr.appendChild(waliTd);
    
    // Tingkat SP
    const tingkatTd = document.createElement('td');
    const badgeClass = sp.tingsp === 'SP1' ? 'bg-primary' : 
                       sp.tingsp === 'SP2' ? 'bg-warning' : 'bg-danger';
    tingkatTd.innerHTML = `<span class="badge ${badgeClass}">${sp.tingsp}</span>`;
    tr.appendChild(tingkatTd);
    
    // Tanggal - use tgl_sp from database
    const tanggalTd = document.createElement('td');
    tanggalTd.textContent = formatDate(sp.tgl_sp);
    tr.appendChild(tanggalTd);
    
    // Actions
    const actionTd = document.createElement('td');
    actionTd.className = 'table-actions';
    
    // Download PDF button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'action-btn download';
    downloadBtn.type = 'button';
    downloadBtn.title = 'Unduh PDF';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    downloadBtn.addEventListener('click', () => {
      generatePDF(sp);
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', () => {
      openModal(sp);
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete';
    delBtn.type = 'button';
    delBtn.title = 'Hapus';
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin menghapus surat peringatan ini?')) {
        deleteSP(sp.id);
      }
    });

    actionTd.appendChild(downloadBtn);
    actionTd.appendChild(editBtn);
    actionTd.appendChild(delBtn);
    tr.appendChild(actionTd);

    tableBody.appendChild(tr);
    updateEmptyState();
  }

  function generatePDF(sp) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Judul Surat
    doc.setFontSize(18);
    doc.text("SURAT PERINGATAN", 105, 20, { align: "center" });
    
    // Garis Pemisah
    doc.line(20, 25, 190, 25);

    // Isi Surat
    doc.setFontSize(12);
    doc.text(`Nomor Surat : SP/${sp.tingsp}/${sp.id}/${new Date().getFullYear()}`, 20, 40);
    doc.text(`Tanggal     : ${sp.tgl_sp}`, 20, 50);
    
    doc.text("Diberikan kepada:", 20, 70);
    doc.text(`Nama        : ${sp.nama}`, 30, 80);
    doc.text(`NIM         : ${sp.nim}`, 30, 90);
    doc.text(`Tingkat     : ${sp.tingsp}`, 30, 100);
    
    doc.text("Alasan Pelanggaran:", 20, 120);
    const alasanSplit = doc.splitTextToSize(sp.alasan_sp || '', 160);
    doc.text(alasanSplit, 20, 130);

    doc.text("Demikian surat ini dibuat agar dapat diperhatikan.", 20, 160);

    // Tanda Tangan
    doc.text("Ketua Program Studi,", 140, 180);
    doc.text(`(${sp.ketua_prodi || ''})`, 140, 210);

    doc.save(`Surat_Peringatan_${sp.nim}.pdf`);
  }

  // Render pagination
  function renderPagination() {
    const existingPagination = document.getElementById('paginationWrapperSP');
    if (existingPagination) {
      existingPagination.remove();
    }
    
    if (!paginationData || paginationData.total_pages <= 1) return;
    
    const tableContainer = document.querySelector('.table-responsive');
    if (!tableContainer) return;
    
    const paginationWrapper = document.createElement('div');
    paginationWrapper.id = 'paginationWrapperSP';
    paginationWrapper.className = 'd-flex justify-content-between align-items-center mt-3';
    
    // Info text
    const startNum = (paginationData.page - 1) * paginationData.limit + 1;
    const endNum = Math.min(paginationData.page * paginationData.limit, paginationData.total_data);
    
    paginationWrapper.innerHTML = '<div class="text-muted small">Menampilkan ' + 
      (spData.length > 0 ? startNum : 0) + 
      '-' + endNum + 
      ' dari ' + paginationData.total_data + ' data</div>';
    
    const paginationNav = document.createElement('nav');
    paginationNav.setAttribute('aria-label', 'Page navigation');
    const ul = document.createElement('ul');
    ul.className = 'pagination pagination-sm mb-0';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (paginationData.has_prev ? '' : ' disabled');
    prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Previous">' +
      '<span aria-hidden="true">&laquo;</span></a>';
    if (paginationData.has_prev) {
      prevLi.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(paginationData.page - 1);
      });
    }
    ul.appendChild(prevLi);
    
    // Page numbers - show max 5 pages
    let startPage = Math.max(1, paginationData.page - 2);
    const endPage = Math.min(paginationData.total_pages, paginationData.page + 2);
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      const firstLi = document.createElement('li');
      firstLi.className = 'page-item';
      firstLi.innerHTML = '<a class="page-link" href="#">1</a>';
      firstLi.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(1);
      });
      ul.appendChild(firstLi);
      
      if (startPage > 2) {
        const ellipsisLi = document.createElement('li');
        ellipsisLi.className = 'page-item disabled';
        ellipsisLi.innerHTML = '<span class="page-link">...</span>';
        ul.appendChild(ellipsisLi);
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      const li = document.createElement('li');
      li.className = 'page-item' + (i === paginationData.page ? ' active' : '');
      li.innerHTML = '<a class="page-link" href="#">' + i + '</a>';
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(parseInt(e.target.textContent));
      });
      ul.appendChild(li);
    }
    
    // Add last page and ellipsis if needed
    if (endPage < paginationData.total_pages) {
      if (endPage < paginationData.total_pages - 1) {
        const ellipsisLi = document.createElement('li');
        ellipsisLi.className = 'page-item disabled';
        ellipsisLi.innerHTML = '<span class="page-link">...</span>';
        ul.appendChild(ellipsisLi);
      }
      
      const lastLi = document.createElement('li');
      lastLi.className = 'page-item';
      lastLi.innerHTML = '<a class="page-link" href="#">' + paginationData.total_pages + '</a>';
      lastLi.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(paginationData.total_pages);
      });
      ul.appendChild(lastLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (paginationData.has_next ? '' : ' disabled');
    nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Next">' +
      '<span aria-hidden="true">&raquo;</span></a>';
    if (paginationData.has_next) {
      nextLi.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        goToPage(paginationData.page + 1);
      });
    }
    ul.appendChild(nextLi);
    
    paginationNav.appendChild(ul);
    paginationWrapper.appendChild(paginationNav);
    
    tableContainer.after(paginationWrapper);
  }

  function goToPage(page) {
    currentPage = page;
    loadSP();
  }

  // API functions
  async function loadSP() {
    try {
      showLoading(true);
      const filterParams = getFilterParams();
      let url = '../crud/surat_peringatan.php?page=' + currentPage + '&limit=10';
      
      if (filterParams) {
        url += '&' + filterParams;
      }
      
      console.log('=== Loading Surat Peringatan ===');
      console.log('URL:', url);
      console.log('Filter params:', filterParams);
      console.log('Current page:', currentPage);
      console.log('================================');
      
      const response = await fetch(url, {
        credentials: 'same-origin'
      });
      console.log('Response status:', response.status);
      console.log('Response type:', response.type);
      console.log('Response url:', response.url);
      
      // Get response text first to debug
      const responseText = await response.text();
      console.log('Response text (first 500 chars):', responseText.substring(0, 500));
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }
      
      // Try to parse JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON: ' + contentType + '. Response: ' + responseText);
      }
      
      const result = JSON.parse(responseText);
      console.log('Parsed result:', result);
      
      // Validate result structure
      if (!result) {
        throw new Error('Result is null or undefined');
      }
      
      spData = Array.isArray(result.data) ? result.data : [];
      paginationData = result.pagination || null;
      
      console.log('Processed data:', spData);
      console.log('Processed pagination:', paginationData);
      
      renderTable();
      renderPagination();
    } catch (error) {
      console.error('Error loading SP:', error);
      console.error('Stack:', error.stack);
      alert('Gagal memuat data surat peringatan: ' + error.message);
    } finally {
      showLoading(false);
    }
  }

  async function loadMahasiswa() {
    try {
      const response = await fetch('../crud/mahasiswa.php');
      const result = await response.json();
      mahasiswaData = result.data || [];
      populateStudentDropdown();
    } catch (error) {
      console.error('Error loading mahasiswa:', error);
    }
  }

  async function saveSP(spDataToSave) {
    try {
      const response = await fetch('../crud/surat_peringatan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spDataToSave),
      });
      const result = await response.json();
      console.log('Save response:', result); // Debug log
      
      if (result.success) {
        await loadSP();
        return true;
      } else {
        if (result.error && result.error.includes('Duplicate entry')) {
          alert(`Tingkat ${spDataToSave.tingsp} sudah ada untuk mahasiswa ini.`);
        } else {
          alert('Gagal menyimpan data: ' + (result.error || 'Unknown error'));
        }
        return false;
      }
    } catch (error) {
      console.error('Error saving SP:', error);
      alert('Gagal menyimpan data surat peringatan: ' + error.message);
      return false;
    }
  }

  async function updateSP(id, spDataToUpdate) {
    try {
      const data = { id, ...spDataToUpdate };
      const response = await fetch('../crud/surat_peringatan.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await loadSP();
        // Refresh dashboard cards
        if (window.refreshCardsFromDatabase) {
          window.refreshCardsFromDatabase();
        }
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
        // Trigger dashboard refresh
        localStorage.setItem('dashboardNeedsRefresh', Date.now().toString());
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
    
    if (spData.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-4">
            <div class="text-muted">
              <i class="fas fa-folder-open fa-3x mb-3 text-secondary"></i>
              <p class="mb-0">Tidak ada data surat peringatan</p>
              <small class="text-muted">Coba ubah filter atau tambahkan data baru</small>
            </div>
          </td>
        </tr>
      `;
      updateEmptyState();
      return;
    }
    
    let rowCounter = 0;
    spData.forEach(sp => {
      addRowToTable(sp, rowCounter);
      rowCounter++;
    });
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
      clearAutoFill();
    }
  }

  function clearAutoFill() {
    const namaInput = document.getElementById('spNamaInput');
    const waliInput = document.getElementById('spWaliInput');

    if (namaInput) {
      namaInput.classList.remove('auto-filled');
      namaInput.readOnly = false;
    }
    if (waliInput) {
      waliInput.classList.remove('auto-filled');
      waliInput.readOnly = false;
    }
  }

  function showLoading(show) {
    const table = document.getElementById('spTable');
    if (table) {
      if (show) {
        table.style.opacity = '0.5';
        table.style.pointerEvents = 'none';
      } else {
        table.style.opacity = '1';
        table.style.pointerEvents = '';
      }
    }
  }

  // Update filter state from DOM elements
  function updateFilterState() {
    filterState.search = searchInput ? searchInput.value.trim() : '';
    filterState.tingkatan_sp = filterTingkatSP ? filterTingkatSP.value : '';
    filterState.tanggal_mulai = filterTanggalMulai ? filterTanggalMulai.value : '';
    filterState.tanggal_selesai = filterTanggalSelesai ? filterTanggalSelesai.value : '';
  }

  // Combined filter function - uses persisted filter state
  function getFilterParams() {
    updateFilterState();
    
    const params = new URLSearchParams();
    
    // Search
    if (filterState.search) {
      params.append('search', filterState.search);
    }
    
    // Tingkat SP filter
    if (filterState.tingkatan_sp) {
      params.append('tingkatan_sp', filterState.tingkatan_sp);
    }
    
    // Date range filter
    if (filterState.tanggal_mulai) {
      params.append('tanggal_mulai', filterState.tanggal_mulai);
    }
    if (filterState.tanggal_selesai) {
      params.append('tanggal_selesai', filterState.tanggal_selesai);
    }
    
    return params.toString();
  }

  // Reset all filters to default
  function resetFilters() {
    filterState.search = '';
    filterState.tingkatan_sp = '';
    filterState.tanggal_mulai = '';
    filterState.tanggal_selesai = '';
    
    if (searchInput) searchInput.value = '';
    if (filterTingkatSP) filterTingkatSP.value = '';
    if (filterTanggalMulai) filterTanggalMulai.value = '';
    if (filterTanggalSelesai) filterTanggalSelesai.value = '';
    
    currentPage = 1;
    loadSP();
    
    console.log('SP Filters reset, reloading data from page 1');
  }

  // Event listeners
  if (addBtn) {
    addBtn.addEventListener('click', () => openModal());
  }
  
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }

  // Form submit handler
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const nim = document.getElementById('spNimInput').value.trim();
      const nama = document.getElementById('spNamaInput').value.trim();
      const kaprodi = document.getElementById('spKaprodiInput').value.trim();
      const wali = document.getElementById('spWaliInput').value.trim();
      const tingkat = document.getElementById('spTingkatInput').value.trim();
      const tgl_sp = document.getElementById('spTanggalInput').value.trim();
      const alasan = document.getElementById('spAlasanInput').value.trim();

      if (!nim || !nama || !tingkat || !tgl_sp || !alasan) {
        alert('Semua field harus diisi!');
        return;
      }

      const spData = {
        nim: nim,
        nama: nama,
        ketua_prodi: kaprodi,
        wali_dosen: wali,
        tingsp: tingkat,
        tanggal: tgl_sp,  // Changed from tgl_sp to tanggal to match DB column
        alasan_sp: alasan
      };

      const editId = form.getAttribute('data-edit-id');
      let success = false;
      
      if (editId) {
        spData.id = editId;
        success = await updateSP(editId, spData);
      } else {
        success = await saveSP(spData);
      }

      if (success) {
        modalInstance.hide();
      }
    });
  }

  // Auto-fill functionality when NIM is entered
  const spNimInput = document.getElementById('spNimInput');
  if (spNimInput) {
    spNimInput.addEventListener('input', function(e) {
      const nim = e.target.value.trim();
      if (nim.length >= 3) {
        autoFillStudentData(nim);
      } else {
        clearAutoFill();
      }
    });
    
    spNimInput.addEventListener('change', function(e) {
      const nim = e.target.value.trim();
      if (nim) {
        autoFillStudentData(nim);
      }
    });
  }

  // Search functionality
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      console.log('Search input changed:', e.target.value);
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        updateFilterState();
        console.log('Executing search with value:', filterState.search);
        currentPage = 1; // Reset to first page on search
        loadSP();
      }, 300);
    });
  } else {
    console.warn('searchInput element not found');
  }

  // Filter functionality - Tingkat SP
  if (filterTingkatSP) {
    console.log('filterTingkatSP element found, attaching change listener');
    filterTingkatSP.addEventListener('change', (e) => {
      updateFilterState();
      console.log('Filter Tingkat SP changed:', filterState.tingkatan_sp);
      currentPage = 1; // Reset to first page on filter
      loadSP();
    });
  } else {
    console.warn('filterTingkatSP element not found');
  }

  // Filter functionality - Tanggal Mulai
  if (filterTanggalMulai) {
    console.log('filterTanggalMulai element found, attaching change listener');
    filterTanggalMulai.addEventListener('change', (e) => {
      updateFilterState();
      console.log('Filter Tanggal Mulai changed:', filterState.tanggal_mulai);
      currentPage = 1; // Reset to first page on filter
      loadSP();
    });
    // Also support input event for real-time filtering
    filterTanggalMulai.addEventListener('input', (e) => {
      clearTimeout(window.spDateTimeout);
      window.spDateTimeout = setTimeout(() => {
        updateFilterState();
        console.log('Filter Tanggal Mulai (input) changed:', filterState.tanggal_mulai);
        currentPage = 1;
        loadSP();
      }, 500);
    });
  } else {
    console.warn('filterTanggalMulai element not found');
  }

  // Filter functionality - Tanggal Selesai
  if (filterTanggalSelesai) {
    console.log('filterTanggalSelesai element found, attaching change listener');
    filterTanggalSelesai.addEventListener('change', (e) => {
      updateFilterState();
      console.log('Filter Tanggal Selesai changed:', filterState.tanggal_selesai);
      currentPage = 1; // Reset to first page on filter
      loadSP();
    });
    // Also support input event for real-time filtering
    filterTanggalSelesai.addEventListener('input', (e) => {
      clearTimeout(window.spDateTimeout);
      window.spDateTimeout = setTimeout(() => {
        updateFilterState();
        console.log('Filter Tanggal Selesai (input) changed:', filterState.tanggal_selesai);
        currentPage = 1;
        loadSP();
      }, 500);
    });
  } else {
    console.warn('filterTanggalSelesai element not found');
  }

  // Reset filter button
  const resetFilterBtn = document.getElementById('resetFilterSP');
  if (resetFilterBtn) {
    console.log('resetFilterSP element found, attaching click listener');
    resetFilterBtn.addEventListener('click', () => {
      console.log('Reset filter button clicked');
      resetFilters();
    });
  } else {
    console.warn('resetFilterSP element not found');
  }

  // Log all filter elements status
  console.log('=== Filter Elements Status ===');
  console.log('searchInput:', searchInput ? 'Found' : 'NOT FOUND');
  console.log('filterTingkatSP:', filterTingkatSP ? 'Found' : 'NOT FOUND');
  console.log('filterTanggalMulai:', filterTanggalMulai ? 'Found' : 'NOT FOUND');
  console.log('filterTanggalSelesai:', filterTanggalSelesai ? 'Found' : 'NOT FOUND');
  console.log('=============================');

  // Load initial data
  loadSP();
  loadMahasiswa();
});

