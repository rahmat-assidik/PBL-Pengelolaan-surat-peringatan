// =============================
// LOGIN BUTTON REDIRECT
// =============================
document.getElementById("loginButton").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "login-page.html";
});

// =============================
// MOCK DATA (contoh data mahasiswa)
// =============================
const mockData = [
  {
    nim: "4311901015",
    name: "John Doe",
    kelas: "TI-3A",
    Walidosen: "Dr. Ahmad Fauzi",
    programStudy: "Informatics Engineering",
    status: "Active",
    sp: "SP1",
  },
  {
    nim: "4311901016",
    name: "Jane Smith",
    programStudy: "Information Systems",
    status: "Warning",
  },
  {
    nim: "4311901020",
    name: "Ayu Lestari",
    programStudy: "Multimedia",
    status: "Active",
  },
  {
    nim: "4311901033",
    name: "Rizky Ramadhan",
    programStudy: "Design Graphics",
    status: "Inactive",
  },
];

// =============================
// SEARCH PREVIEW REALTIME
// =============================
const searchInput = document.getElementById("searchInput");
const searchPreview = document.getElementById("searchPreview");
const searchForm = document.getElementById("searchForm");

searchInput.addEventListener("keyup", function () {
  const query = this.value.trim().toLowerCase();
  searchPreview.innerHTML = "";

  if (query.length < 1) return;

  const results = mockData.filter(
    (student) =>
      student.nim.toLowerCase().includes(query) ||
      student.name.toLowerCase().includes(query)
  );

  if (results.length > 0) {
    results.forEach((student) => {
      const item = document.createElement("button");
      item.type = "button";
      item.classList.add("list-group-item", "list-group-item-action");
      item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>${student.name}</strong><br>
            <small class="text-muted">${student.nim} - ${
        student.programStudy
      }</small>
          </div>
          <span class="badge ${
            student.status === "Warning"
              ? "bg-warning"
              : student.status === "Inactive"
              ? "bg-secondary"
              : "bg-success"
          }">
            ${student.status}
          </span>
        </div>
      `;

      item.addEventListener("click", function () {
        searchInput.value = `${student.name} (${student.nim})`;
        searchPreview.innerHTML = "";
        showStudentProfile(student); // <== tampilkan card profil
      });

      searchPreview.appendChild(item);
    });
  } else {
    searchPreview.innerHTML = `<div class="list-group-item text-muted">Tidak ditemukan</div>`;
  }
});

// Tutup preview jika klik di luar
document.addEventListener("click", function (e) {
  if (!e.target.closest(".position-relative")) {
    searchPreview.innerHTML = "";
  }
});

// =============================
// SEARCH FORM (BUTTON SUBMIT)
// =============================
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const searchQuery = searchInput.value.trim();

  if (searchQuery === "") {
    alert("Masukkan NIM atau Nama untuk mencari");
    return;
  }

  const results = mockData.filter(
    (student) =>
      student.nim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  displaySearchResults(results);
});

// =============================
// TAMPILKAN KARTU PROFIL MAHASISWA
// =============================
function showStudentProfile(student) {
  const profileCard = document.getElementById('studentProfile');
  document.getElementById('profileName').textContent = student.name;
  document.getElementById('profileNIM').textContent = student.nim;
  document.getElementById('profileKelas').textContent = student.kelas || '-';
  document.getElementById('profileProdi').textContent = student.programStudy;
  document.getElementById('profileWaliDosen').textContent = student.Walidosen || '-';
  document.getElementById('profileSP').textContent = student.sp || '-';
  document.getElementById('profileStatus').textContent = student.status;

  // Ganti warna status otomatis
  const statusSpan = document.getElementById('profileStatus');
  statusSpan.classList.remove('text-primary', 'text-warning', 'text-danger', 'text-success');
  if (student.status === 'Active') statusSpan.classList.add('text-success');
  else if (student.status === 'Warning') statusSpan.classList.add('text-warning');
  else statusSpan.classList.add('text-danger');

  // Tampilkan card
  profileCard.classList.remove('d-none');
}
