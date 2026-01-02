/*
  Logout Handler
  - Handles the logout button click event
  - Shows confirmation before redirecting to logout.php
*/

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                window.location.href = '../auth/logout.php';
            }
        });
    }
});

