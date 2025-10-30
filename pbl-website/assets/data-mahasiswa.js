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
    // edit
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.type = 'button';
    editBtn.innerHTML = '<i class="ri-edit-line"></i> Ubah';
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

    // delete
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete';
    delBtn.type = 'button';
    delBtn.innerHTML = '<i class="ri-delete-bin-line"></i> Hapus';
    delBtn.addEventListener('click', () => {
      if (confirm('Hapus data mahasiswa ini?')) {
        tr.remove();
        updateEmptyState();
      }
    });

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

  // Dummy data for testing
  const dummyMahasiswa = [
    {
      nim: "2241720001",
      nama: "Ahmad Firdaus",
      prodi: "D4 Teknik Informatika",
      semester: "3",
      wali: "Drs. Imam Fahrur Rozi, M.T"
    },
    {
      nim: "2241720002",
      nama: "Siti Aminah",
      prodi: "D4 Teknik Informatika",
      semester: "3",
      wali: "Septian Enggar Sukmana, S.Pd., M.T"
    },
    {
      nim: "2241720003",
      nama: "Muhammad Rizky",
      prodi: "D4 Teknik Informatika",
      semester: "1",
      wali: "Drs. Adi Putra, M.Kom"
    },
    {
      nim: "2241720004",
      nama: "Anisa Putri",
      prodi: "D4 Sistem Informasi Bisnis",
      semester: "5",
      wali: "Dr. Eko Sutrisno, S.Kom., M.Sc"
    },
    {
      nim: "2241720005",
      nama: "Budi Santoso",
      prodi: "D4 Sistem Informasi Bisnis",
      semester: "3",
      wali: "Dra. Maya Indah, M.M"
    }
  ];

  // Load dummy data
  dummyMahasiswa.forEach(student => addRowToTable(student));

  // init empty state on load
  updateEmptyState();
});