// data-mahasiswa.js — simple modal + table management
// Features: open/close modal, add row, edit row, delete row, empty placeholder toggle

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addMahasiswaBtn');
  const modal = document.getElementById('mahasiswaModal');
  const backdrop = document.getElementById('modalBackdrop');
  const modalContent = document.querySelector('.modal-content');
  const closeBtn = document.getElementById('modalClose');
  const cancelBtn = document.getElementById('cancelBtn');
  const form = document.getElementById('mahasiswaForm');
  const tableBody = document.querySelector('#mahasiswaTable tbody');
  const emptyPlaceholder = document.getElementById('emptyPlaceholder');

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

  function addRowToTable(student) {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(student.nim));
    tr.appendChild(createCell(student.nama));
    tr.appendChild(createCell(student.prodi || ''));
    tr.appendChild(createCell(student.semester || ''));
    tr.appendChild(createCell(student.wali || ''));

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
      alert('Detail Mahasiswa:\n\nNIM: ' + student.nim + '\nNama: ' + student.nama + '\nProdi: ' + student.prodi + '\nSemester: ' + student.semester + '\nDosen Wali: ' + student.wali);
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<i class="ri-edit-2-line"></i>';
    editBtn.addEventListener('click', () => {
      // populate form and open modal
      const cells = tr.querySelectorAll('td');
      document.getElementById('nimInput').value = cells[0].textContent;
      document.getElementById('namaInput').value = cells[1].textContent;
      document.getElementById('prodiInput').value = cells[2].textContent;
      document.getElementById('semesterInput').value = cells[3].textContent;
      document.getElementById('waliInput').value = cells[4].textContent;

      // set edit index
      const idx = Array.from(tableBody.children).indexOf(tr);
      openModal(idx);
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete';
    delBtn.type = 'button';
    delBtn.title = 'Hapus';
    delBtn.innerHTML = '<i class="ri-delete-bin-5-line"></i>';
    delBtn.addEventListener('click', () => {
      if (confirm('Hapus data mahasiswa ini?')) {
        tr.remove();
        updateEmptyState();
      }
    });

    // Menambahkan semua tombol ke dalam actionTd
    actionTd.appendChild(viewBtn);
    actionTd.appendChild(document.createTextNode(' '));
    actionTd.appendChild(editBtn);
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

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nim = (document.getElementById('nimInput') || {}).value?.trim();
      const nama = (document.getElementById('namaInput') || {}).value?.trim();
      const prodi = (document.getElementById('prodiInput') || {}).value?.trim();
      const semester = (document.getElementById('semesterInput') || {}).value?.trim();
      const wali = (document.getElementById('waliInput') || {}).value?.trim();

      if (!nim || !nama) {
        alert('NIM dan Nama harus diisi.');
        return;
      }

      const student = { nim, nama, prodi, semester, wali };

      const editIndex = form.getAttribute('data-edit-index');
      if (editIndex !== null && editIndex !== undefined) {
        const idx = Number(editIndex);
        const row = tableBody.children[idx];
        if (row) {
          row.children[0].textContent = student.nim;
          row.children[1].textContent = student.nama;
          row.children[2].textContent = student.prodi;
          row.children[3].textContent = student.semester;
          row.children[4].textContent = student.wali;
        }
      } else {
        addRowToTable(student);
      }

      closeModal();
    });
  }

  // No dummy data - start with empty table

  // init empty state on load
  updateEmptyState();
});