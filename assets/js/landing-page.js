// ===== HAMBURGER MENU =====
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks = document.querySelectorAll(".menu-link");

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
document.getElementById("loginButton").addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "../login.php";
});

// Smooth scroll untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
