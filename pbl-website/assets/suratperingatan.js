// Surat Peringatan management
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

  function openModal(editIndex) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // store edit index if editing
    if (typeof editIndex === 'number') {
      form.dataset.editIndex = String(editIndex);
    } else {
      form.removeAttribute('data-edit-index');
      form.reset();
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
    form.removeAttribute('data-edit-index');
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
    const rows = tableBody.querySelectorAll('tr').length + 1;
    tr.appendChild(createCell(rows)); // No urut
    tr.appendChild(createCell(sp.nim));
    tr.appendChild(createCell(sp.nama));
    tr.appendChild(createCell(sp.kaprodi));
    tr.appendChild(createCell(sp.wali));
    tr.appendChild(createCell(sp.tingkatan));
    tr.appendChild(createCell(sp.alasan));

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
      alert('Detail Surat Peringatan:\n\nNIM: ' + sp.nim + '\nNama: ' + sp.nama + '\nTingkatan: ' + sp.tingkatan);
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<i class="ri-edit-2-line"></i>';
    editBtn.addEventListener('click', () => {
      // populate form and open modal
      document.getElementById('spNimInput').value = sp.nim;
      document.getElementById('spNamaInput').value = sp.nama;
      document.getElementById('spKaprodiInput').value = sp.kaprodi;
      document.getElementById('spWaliInput').value = sp.wali;
      document.getElementById('spTingkatanInput').value = sp.tingkatan;
      document.getElementById('spAlasanInput').value = sp.alasan;

      // set edit index
      const idx = Array.from(tableBody.children).indexOf(tr);
      openModal(idx);
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
        // Remove from localStorage
        const spData = JSON.parse(localStorage.getItem('spData') || '[]');
        const idx = Array.from(tableBody.children).indexOf(tr);
        spData.splice(idx, 1);
        localStorage.setItem('spData', JSON.stringify(spData));
        
        tr.remove();
        updateEmptyState();
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
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const rows = tableBody.querySelectorAll('tr');
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      });
      
      updateEmptyState();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
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

      const sp = { nim, nama, kaprodi, wali, tingkatan, alasan };

      const editIndex = form.getAttribute('data-edit-index');
      if (editIndex !== null && editIndex !== undefined) {
        const idx = Number(editIndex);
        const row = tableBody.children[idx];
        if (row) {
          row.children[1].textContent = sp.nim; // index 1 karena index 0 adalah nomor urut
          row.children[2].textContent = sp.nama;
          row.children[3].textContent = sp.kaprodi;
          row.children[4].textContent = sp.wali;
          row.children[5].textContent = sp.tingkatan;
          row.children[6].textContent = sp.alasan;
          
          // Save to localStorage
          const spData = JSON.parse(localStorage.getItem('spData') || '[]');
          spData[idx] = sp;
          localStorage.setItem('spData', JSON.stringify(spData));
        }
      } else {
        addRowToTable(sp);
        // Save to localStorage
        const spData = JSON.parse(localStorage.getItem('spData') || '[]');
        spData.push(sp);
        localStorage.setItem('spData', JSON.stringify(spData));
      }

      closeModal();
    });
  }

  // Load saved data from localStorage
  function loadSavedData() {
    const savedData = localStorage.getItem('spData');
    if (savedData) {
      const spData = JSON.parse(savedData);
      spData.forEach(sp => addRowToTable(sp));
    }
  }

  // Clear all dummy data completely
  localStorage.removeItem('spData');
  localStorage.setItem('spData', JSON.stringify([]));

  // Initialize table and load saved data
  updateEmptyState();
  loadSavedData();
});