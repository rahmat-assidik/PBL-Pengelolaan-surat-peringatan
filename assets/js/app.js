/**
 * AdminLTE-style App JavaScript
 * Handles sidebar toggle, logout, and common interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initSidebarToggle();
    initLogout();
    initPasswordToggles();
    initBootstrapDropdowns();
    restoreSidebarState();
});

/**
 * Bootstrap Dropdown Initialization
 */
function initBootstrapDropdowns() {
    // Initialize Bootstrap 5 dropdowns
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
    dropdownElementList.forEach(function(dropdownToggleEl) {
        new bootstrap.Dropdown(dropdownToggleEl);
    });
}

/**
 * Sidebar Toggle Functionality
 */
function initSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mainSidebar = document.getElementById('mainSidebar');
    const body = document.body;
    
    if (!sidebarToggle || !mainSidebar) {
        console.warn('Sidebar elements not found');
        return;
    }
    
    // Toggle sidebar on button click
    sidebarToggle.addEventListener('click', function(e) {
        e.preventDefault();
        toggleSidebar();
    });
    
    // Toggle sidebar on overlay click (mobile)
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            closeSidebar();
        });
    }
    
    // Make functions globally accessible
    window.toggleSidebar = function() {
        if (window.innerWidth <= 991.98) {
            // Mobile: show/hide sidebar
            mainSidebar.classList.toggle('show');
            sidebarOverlay.classList.toggle('show');
            document.body.style.overflow = mainSidebar.classList.contains('show') ? 'hidden' : '';
        } else {
            // Desktop: collapse/expand
            body.classList.toggle('sidebar-collapse');
            saveSidebarState();
        }
    };
    
    // Function to close sidebar (mobile)
    window.closeSidebar = function() {
        mainSidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
    };
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991.98) {
            // On desktop resize, ensure sidebar is visible and overlay is hidden
            mainSidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Save sidebar state to localStorage
 */
function saveSidebarState() {
    const body = document.body;
    const isCollapsed = body.classList.contains('sidebar-collapse');
    localStorage.setItem('lte.sidebar.state', isCollapsed ? 'collapsed' : 'expanded');
}

/**
 * Restore sidebar state from localStorage
 */
function restoreSidebarState() {
    const body = document.body;
    const savedState = localStorage.getItem('lte.sidebar.state');
    const windowWidth = window.innerWidth;
    
    // Only restore on desktop (not mobile)
    if (windowWidth > 991.98) {
        if (savedState === 'collapsed') {
            body.classList.add('sidebar-collapse');
        } else {
            body.classList.remove('sidebar-collapse');
        }
    }
}

/**
 * Logout Functionality
 */
function initLogout() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                // Show loading state
                this.disabled = true;
                this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Keluar...';
                
                // Redirect to logout
                window.location.href = '../auth/logout.php';
            }
        });
    }
}

/**
 * Password Visibility Toggles
 */
function initPasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Modal Helper Functions
 */
window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
};

/**
 * Show notification/toast
 */
window.showNotification = function(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }, 3000);
};

/**
 * Format date to Indonesian format
 */
window.formatDate = function(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

/**
 * Format date short (DD/MM/YYYY)
 */
window.formatDateShort = function(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Debounce function for search
 */
window.debounce = function(func, wait) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Confirm delete action
 */
window.confirmDelete = function(message) {
    return confirm(message || 'Apakah Anda yakin ingin menghapus data ini?');
};

