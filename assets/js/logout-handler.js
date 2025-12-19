/*
  Logout Handler
  - Handles the logout button click event
  - Redirects to logout.php
*/

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to logout.php
            window.location.href = '../auth/logout.php';
        });
    }
});
