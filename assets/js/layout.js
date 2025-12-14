/**
 * layout.js - Simplified layout controller
 * Handles: sidebar toggle, responsive behavior, logout
 */

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const overlay = document.getElementById('sidebarOverlay');
  const logoutBtn = document.getElementById('logoutButton');

  // Sidebar toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile) {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
      } else {
        sidebar.classList.toggle('collapsed');
        content.classList.toggle('expanded');
        localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      }
    });
  }

  // Close sidebar on mobile overlay click
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    });
  }

  // Restore sidebar state on desktop
  if (window.innerWidth > 768) {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      content.classList.add('expanded');
    }
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    } else {
      sidebar.classList.remove('collapsed');
      content.classList.remove('expanded');
    }
  });

  // Logout handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('Apakah Anda yakin ingin logout?')) {
        window.location.href = '../auth/logout.php';
      }
    });
  }
});
