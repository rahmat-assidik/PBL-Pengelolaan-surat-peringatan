// data-mahasiswa.js — simple modal + table management with database integration
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
  const searchInput = document.getElementById('searchMahasiswa');

  let mahasiswaData = [];

  function openModal(editData) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // store edit data if editing
    if (editData) {
      form.dataset.editId = String(editData.id);
      // populate form
      document.getElementById('nimInput').value = editData.nim;
      document.getElementById('namaInput').value = editData.nama;
      document.getElementById('prodiInput').value = editData.prodi || '';
      document.getElementById('semesterInput').value = editData.semester || '';
      document.getElementById('waliInput').value = editData.wali_dosen || '';
    } else {
      form.removeAttribute('data-edit-id');
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

  function addRowToTable(student) {
    const tr = document.createElement('tr');
    tr.dataset.id = student.id;
    tr.appendChild(createCell(student.nim));
    tr.appendChild(createCell(student.nama));
    tr.appendChild(createCell(student.prodi || ''));
    tr.appendChild(createCell(student.semester || ''));
    tr.appendChild(createCell(student.wali_dosen || ''));

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
      alert('Detail Mahasiswa:\n\nNIM: ' + student.nim + '\nNama: ' + student.nama + '\nProdi: ' + student.prodi + '\nSemester: ' + student.semester + '\nDosen Wali: ' + student.wali_dosen);
    });

    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit';
    editBtn.type = 'button';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<i class="ri-edit-2-line"></i>';
    editBtn.addEventListener('click', () => {
      openModal(student);
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete';
    delBtn.type = 'button';
    delBtn.title = 'Hapus';
    delBtn.innerHTML = '<i class="ri-delete-bin-5-line"></i>';
    delBtn.addEventListener('click', () => {
      if (confirm('Hapus data mahasiswa ini?')) {
        deleteMahasiswa(student.id);
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

  // API functions
  async function loadMahasiswa(search = '') {
    try {
      const url = search ? `../api/mahasiswa.php?search=${encodeURIComponent(search)}` : '../api/mahasiswa.php';
      const response = await fetch(url);
      const data = await response.json();
      mahasiswaData = data;
      renderTable();
    } catch (error) {
      console.error('Error loading mahasiswa:', error);
      alert('Gagal memuat data mahasiswa');
    }
  }

  async function saveMahasiswa(studentData) {
    try {
      const response = await fetch('../api/mahasiswa.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });
      const result = await response.json();
      if (result.success) {
        await loadMahasiswa();
        return true;
      } else {
        alert('Gagal menyimpan data: ' + result.error);
        return false;
      }
    } catch (error) {
      console.error('Error saving mahasiswa:', error);
      alert('Gagal menyimpan data mahasiswa');
      return false;
    }
  }

  async function updateMahasiswa(id, studentData) {
    try {
      const data = { id, ...studentData };
      const response = await fetch('../api/mahasiswa.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await loadMahasiswa();
        return true;
      } else {
        alert('Gagal mengupdate data: ' + result.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating mahasiswa:', error);
      alert('Gagal mengupdate data mahasiswa');
      return false;
    }
  }

  async function deleteMahasiswa(id) {
    try {
      const response = await fetch(`../api/mahasiswa.php?id=${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        await loadMahasiswa();
      } else {
        alert('Gagal menghapus data: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting mahasiswa:', error);
      alert('Gagal menghapus data mahasiswa');
    }
  }

  function renderTable() {
    tableBody.innerHTML = '';
    mahasiswaData.forEach(student => addRowToTable(student));
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
        loadMahasiswa(e.target.value);
      }, 300);
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
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

      const student = {
        nim,
        nama,
        prodi,
        semester: semester ? parseInt(semester) : null,
        wali_dosen: wali
      };

      const editId = form.getAttribute('data-edit-id');
      let success = false;
      if (editId) {
        success = await updateMahasiswa(editId, student);
      } else {
        success = await saveMahasiswa(student);
      }

      if (success) {
        closeModal();
      }
    });
  }

  // Load initial data
  loadMahasiswa();
});
