// Login redirect handling
document.getElementById('loginButton').addEventListener('click', function(e) {
    e.preventDefault();
    // Ganti URL_LOGIN_PAGE dengan URL halaman login yang akan dibuat
    window.location.href = "login-page.html";
});

// Search form handling
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchQuery = document.getElementById('searchInput').value.trim();
    
    if (searchQuery === '') {
        alert('Please enter a NIM or Name to search');
        return;
    }

    // Here you would typically make an API call to your backend
    // For demonstration, we'll simulate a search with mock data
    searchStudents(searchQuery);
});

function searchStudents(query) {
    // This is mock data - replace with actual API call
    const mockData = [
        { nim: '4311901015', name: 'John Doe', programStudy: 'Informatics Engineering', status: 'Active' },
        { nim: '4311901016', name: 'Jane Smith', programStudy: 'Information Systems', status: 'Warning' }
    ];

    // Simulate search filtering
    const results = mockData.filter(student => 
        student.nim.toLowerCase().includes(query.toLowerCase()) ||
        student.name.toLowerCase().includes(query.toLowerCase())
    );

    displaySearchResults(results);
}

function displaySearchResults(results) {
    const tbody = document.getElementById('searchResultsBody');
    const noResults = document.getElementById('noResultsMessage');
    tbody.innerHTML = '';

    if (results.length === 0) {
        noResults.classList.remove('d-none');
    } else {
        noResults.classList.add('d-none');
        results.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.nim}</td>
                <td>${student.name}</td>
                <td>${student.programStudy}</td>
                <td><span class="badge ${student.status === 'Warning' ? 'bg-warning' : 'bg-success'}">${student.status}</span></td>
            `;
            tbody.appendChild(row);
        });
    }

    // Show the modal
    const searchResultsModal = new bootstrap.Modal(document.getElementById('searchResultsModal'));
    searchResultsModal.show();
}