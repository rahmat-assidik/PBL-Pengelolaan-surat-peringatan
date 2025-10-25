// @ts-nocheck
document.addEventListener("DOMContentLoaded", () => {
  /* ========================================
              CEK STATUS LOGIN
  ======================================== */
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (isLoggedIn !== "true") {
    window.location.href = "login-page.html";
    return;
  }

  /* ========================================
              TOGGLE SIDEBAR
  ======================================== */
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const content = document.getElementById("content");
  const overlay = document.getElementById("sidebarOverlay");

  toggleBtn.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle("show");
      overlay.classList.toggle("show");
    } else {
      sidebar.classList.toggle("collapsed");
      content.classList.toggle("expanded");
      localStorage.setItem(
        "sidebarCollapsed",
        sidebar.classList.contains("collapsed")
      );
    }
  });

  const sidebarCollapsed = localStorage.getItem("sidebarCollapsed");
  if (sidebarCollapsed === "true" && window.innerWidth > 768) {
    sidebar.classList.add("collapsed");
    content.classList.add("expanded");
  }

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("show");
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    } else {
      sidebar.classList.remove("collapsed");
      content.classList.remove("expanded");
    }
  });

  /* ========================================
              NAVIGASI SIDEBAR
  ======================================== */
  const links = document.querySelectorAll(".sidebar a");
  const sections = document.querySelectorAll(".content-section");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      sections.forEach((sec) => sec.classList.remove("active"));
      const target = link.getAttribute("data-target");
      const section = document.getElementById(target);
      if (section) section.classList.add("active");

      if (window.innerWidth <= 768) {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
      }
    });
  });

  /* ========================================
              FITUR LOGOUT
  ======================================== */
  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (confirm("Apakah Anda yakin ingin logout?")) {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("sidebarCollapsed");
        window.location.href = "login-page.html";
      }
    });
  }

  /* ========================================
              TAMPILKAN NAMA USER
  ======================================== */
  const user = localStorage.getItem("username");
  const userElement = document.getElementById("userName");
  if (user && userElement) userElement.textContent = user;

  /* ========================================
              CRUD DATA MAHASISWA
  ======================================== */
  let mahasiswa = JSON.parse(localStorage.getItem("mahasiswa")) || [];

  function renderCards(filteredData = mahasiswa) {
    const container = document.getElementById("cardsContainer");
    if (!container) return;

    container.innerHTML = "";
    filteredData.forEach((mhs, index) => {
      container.innerHTML += `
        <div class="card" onclick="updateProfile(${index})">
          <h3>${mhs.nama}</h3>
          <p><strong>NIM:</strong> ${mhs.nim}</p>
          <p><strong>Jurusan:</strong> ${mhs.jurusan}</p>
          <p><strong>Semester:</strong> ${mhs.semester}</p>
          <div class="actions">
            <button class="edit" onclick="event.stopPropagation(); editMahasiswa(${index})">Edit</button>
            <button class="delete" onclick="event.stopPropagation(); deleteMahasiswa(${index})">Hapus</button>
          </div>
        </div>
      `;
    });

    localStorage.setItem("mahasiswa", JSON.stringify(mahasiswa));
  }

  window.toggleForm = function () {
    const form = document.getElementById("formContainer");
    form.style.display = form.style.display === "block" ? "none" : "block";
    document.getElementById("formTitle").innerText = "Tambah Mahasiswa";
    document.getElementById("editIndex").value = "";
    ["nama", "nim", "jurusan", "prodi", "semester"].forEach(
      (id) => (document.getElementById(id).value = "")
    );
  };

  window.saveMahasiswa = function () {
    const nama = document.getElementById("nama").value.trim();
    const nim = document.getElementById("nim").value.trim();
    const jurusan = document.getElementById("jurusan").value.trim();
    const prodi = document.getElementById("prodi").value.trim();
    const semester = document.getElementById("semester").value.trim();
    const editIndex = document.getElementById("editIndex").value;

    if (!nama || !nim || !jurusan || !prodi || !semester) {
      alert("Semua field harus diisi!");
      return;
    }

    const data = { nama, nim, jurusan, prodi, semester };
    if (editIndex) {
      mahasiswa[editIndex] = data;
      alert("Data berhasil diperbarui!");
    } else {
      mahasiswa.push(data);
      alert("Mahasiswa berhasil ditambahkan!");
    }

    toggleForm();
    renderCards();
  };

  window.editMahasiswa = function (index) {
    const mhs = mahasiswa[index];
    document.getElementById("formContainer").style.display = "block";
    document.getElementById("formTitle").innerText = "Edit Mahasiswa";
    document.getElementById("nama").value = mhs.nama;
    document.getElementById("nim").value = mhs.nim;
    document.getElementById("jurusan").value = mhs.jurusan;
    document.getElementById("prodi").value = mhs.prodi;
    document.getElementById("semester").value = mhs.semester;
    document.getElementById("editIndex").value = index;
  };

  window.deleteMahasiswa = function (index) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      mahasiswa.splice(index, 1);
      localStorage.setItem("mahasiswa", JSON.stringify(mahasiswa));
      renderCards();
      clearProfile();
    }
  };

  window.searchMahasiswa = function () {
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const filtered = mahasiswa.filter(
      (mhs) =>
        mhs.nama.toLowerCase().includes(keyword) ||
        mhs.nim.toLowerCase().includes(keyword)
    );
    renderCards(filtered);

    if (filtered.length === 1 && keyword !== "") {
      updateProfile(filtered[0]);
    } else if (filtered.length === 0 || keyword === "") {
      clearProfile();
    }
  };

  window.updateProfile = function (indexOrData) {
    const table = document.querySelector(".profile-info table");
    let mhs =
      typeof indexOrData === "number" ? mahasiswa[indexOrData] : indexOrData;

    table.innerHTML = `
      <tr><td>Nama</td><td>:</td><td>${mhs.nama}</td></tr>
      <tr><td>NIM</td><td>:</td><td>${mhs.nim}</td></tr>
      <tr><td>Jurusan</td><td>:</td><td>${mhs.jurusan}</td></tr>
      <tr><td>Prodi</td><td>:</td><td>${mhs.prodi}</td></tr>
      <tr><td>Semester</td><td>:</td><td>${mhs.semester}</td></tr>
      <tr><td>Status Akademik</td><td>:</td><td>Aktif</td></tr>
    `;
  };

  window.clearProfile = function () {
    const table = document.querySelector(".profile-info table");
    table.innerHTML = `
      <tr><td>Nama</td><td>:</td><td>-</td></tr>
      <tr><td>NIM</td><td>:</td><td>-</td></tr>
      <tr><td>Jurusan</td><td>:</td><td>-</td></tr>
      <tr><td>Prodi</td><td>:</td><td>-</td></tr>
      <tr><td>Semester</td><td>:</td><td>-</td></tr>
      <tr><td>Status Akademik</td><td>:</td><td>Aktif / Cuti / Nonaktif</td></tr>
    `;
  };

  // Render awal
  renderCards();
});
