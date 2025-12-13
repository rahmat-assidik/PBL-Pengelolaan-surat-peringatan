// ===== ELEMENTS =====
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks = document.querySelectorAll(".menu-link");
const loginButton = document.getElementById("loginButton");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const filterProdi = document.getElementById("filterProdi");
const filterStatus = document.getElementById("filterStatus");
const searchPreview = document.getElementById("searchPreview");
const resultContainer = document.getElementById("resultContainer");
const emptyState = document.getElementById("emptyState");
// ===== HAMBURGER MENU =====
hamburgerBtn.addEventListener("click", () => {
  hamburgerBtn.classList.toggle("active");
  mobileMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
});

menuOverlay.addEventListener("click", () => {
  hamburgerBtn.classList.remove("active");
  mobileMenu.classList.remove("active");
  menuOverlay.classList.remove("active");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburgerBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
    menuOverlay.classList.remove("active");
  });
});

// ===== LOGIN BUTTON =====
if (loginButton) {
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.location.href = "login-page.html";
  });
}

// ===== SCROLL ANIMATION =====
const scrollElements = document.querySelectorAll(".fade-scroll");

function scrollAnimation() {
  scrollElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", scrollAnimation);
window.addEventListener("load", scrollAnimation);

// ===== FILTER DATA =====
function filterData() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedProdi = filterProdi.value;
  const selectedStatus = filterStatus.value;

  if (!query) {
    searchPreview.style.display = "none";
    resultContainer.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  const filtered = mahasiswaData.filter(
    (mhs) =>
      (mhs.nama.toLowerCase().includes(query) ||
        mhs.nim.toLowerCase().includes(query)) &&
      (selectedProdi === "" || mhs.prodi === selectedProdi) &&
      (selectedStatus === "" || mhs.status === selectedStatus)
  );

  displayPreview(filtered);
}

// ===== DISPLAY PREVIEW =====
function displayPreview(data) {
  if (data.length === 0) {
    searchPreview.style.display = "none";
    return;
  }

  const previewHTML = data
    .map(
      (mhs) => `
        <div class="preview-item" onclick='selectMahasiswa(${JSON.stringify(
          mhs
        )})'>
          <strong>${mhs.nama}</strong> <br />
          <small>${mhs.nim} - ${mhs.prodi}</small>
        </div>
      `
    )
    .join("");

  searchPreview.innerHTML = previewHTML;
  searchPreview.style.display = "block";
}

// ===== SELECT MAHASISWA =====
function selectMahasiswa(mhs) {
  // isi kolom pencarian secara otomatis
  searchInput.value = `${mhs.nama} (${mhs.nim})`;

  // sembunyikan elemen yang tidak perlu
  emptyState.style.display = "none";
  searchPreview.style.display = "none";

  // tampilkan hasil detail
  resultContainer.innerHTML = `
    <div class="card shadow-sm p-3 mb-4 fade-scroll visible">
      <h4 class="text-primary mb-2">${mhs.nama}</h4>
      <p><strong>NIM:</strong> ${mhs.nim}</p>
      <p><strong>Kelas:</strong> ${mhs.kelas}</p>
      <p><strong>Program Studi:</strong> ${mhs.prodi}</p>
      <p><strong>Status:</strong> ${mhs.status}</p>
      <p><strong>Surat Peringatan:</strong> ${mhs.sp}</p>
      <p><strong>Dosen Wali:</strong> ${mhs.wali}</p>
    </div>
  `;
}

// ===== EVENT LISTENERS =====
searchInput.addEventListener("input", filterData);
filterProdi.addEventListener("change", filterData);
filterStatus.addEventListener("change", filterData);

clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  resultContainer.innerHTML = "";
  searchPreview.style.display = "none";
  emptyState.style.display = "block";
});
