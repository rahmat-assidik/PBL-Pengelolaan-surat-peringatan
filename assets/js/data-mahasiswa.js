// data-mahasiswa.js — Modal + Table management with Bootstrap 5 + Pagination
document.addEventListener('DOMContentLoaded', function() {
    var addBtn = document.getElementById('addMahasiswaBtn');
    var modalEl = document.getElementById('mahasiswaModal');
    var form = document.getElementById('mahasiswaForm');
    var tableBody = document.querySelector('#mahasiswaTable tbody');
    var emptyPlaceholder = document.getElementById('emptyPlaceholder');
    var searchInput = document.getElementById('searchMahasiswa');
    var filterProdi = document.getElementById('filterProdi');
    var filterSemester = document.getElementById('filterSemester');

    var mahasiswaData = [];
    var modalInstance = null;
    var currentPage = 1;
    var paginationData = null;
    
    // Filter state management - persist filters across pagination
    var filterState = {
        search: '',
        prodi: '',
        semester: ''
    };

    // Initialize Bootstrap 5 modal
    if (modalEl) {
        modalInstance = new bootstrap.Modal(modalEl, {
            backdrop: 'static',
            keyboard: true
        });
    }

    function openModal(editData) {
        if (!modalEl || !modalInstance) return;
        
        var modalTitle = document.getElementById('modalTitle');
        
        if (editData) {
            // Change to edit mode
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-edit me-2"></i>Edit Mahasiswa';
            }
            form.setAttribute('data-edit-id', String(editData.id));
            document.getElementById('nimInput').value = editData.nim || '';
            document.getElementById('namaInput').value = editData.nama || '';
            document.getElementById('prodiInput').value = editData.prodi || '';
            document.getElementById('semesterInput').value = editData.semester || '';
            document.getElementById('waliInput').value = editData.wali_dosen || '';
            document.getElementById('nimInput').disabled = true;
        } else {
            // Change to add mode
            if (modalTitle) {
                modalTitle.innerHTML = '<i class="fas fa-user-plus me-2"></i>Tambah Mahasiswa';
            }
            form.removeAttribute('data-edit-id');
            form.reset();
            document.getElementById('nimInput').disabled = false;
        }
        
        modalInstance.show();
        
        // Focus first input
        setTimeout(function() {
            var firstInput = form.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 100);
    }

    function updateEmptyState() {
        if (!tableBody) return;
        var hasRows = tableBody.querySelectorAll('tr').length > 0;
        if (emptyPlaceholder) {
            emptyPlaceholder.style.display = hasRows ? 'none' : 'block';
        }
        // Hide table when empty
        var table = document.getElementById('mahasiswaTable');
        if (table) {
            table.style.display = hasRows ? '' : 'none';
        }
    }

    function addRowToTable(student, index) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-id', student.id);
        
        // Calculate correct number based on current page
        var startNum = (paginationData && paginationData.page) ? ((paginationData.page - 1) * paginationData.limit + 1) : 1;
        
        // No.
        var noTd = document.createElement('td');
        noTd.textContent = startNum + index;
        noTd.className = 'text-muted';
        tr.appendChild(noTd);
        
        // NIM
        var nimTd = document.createElement('td');
        nimTd.textContent = student.nim;
        tr.appendChild(nimTd);
        
        // Nama
        var namaTd = document.createElement('td');
        namaTd.textContent = student.nama;
        tr.appendChild(namaTd);
        
        // Prodi
        var prodiTd = document.createElement('td');
        prodiTd.textContent = student.prodi || '';
        tr.appendChild(prodiTd);
        
        // Semester
        var semesterTd = document.createElement('td');
        semesterTd.textContent = student.semester || '';
        tr.appendChild(semesterTd);
        
        // Wali Dosen
        var waliTd = document.createElement('td');
        waliTd.textContent = student.wali_dosen || '';
        tr.appendChild(waliTd);
        
        // Actions
        var actionTd = document.createElement('td');
        actionTd.className = 'text-end';
        
        // Edit button
        var editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-outline-primary me-1';
        editBtn.type = 'button';
        editBtn.title = 'Edit';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener('click', function() {
            openModal(student);
        });

        // Delete button
        var delBtn = document.createElement('button');
        delBtn.className = 'btn btn-sm btn-outline-danger';
        delBtn.type = 'button';
        delBtn.title = 'Hapus';
        delBtn.innerHTML = '<i class="fas fa-trash"></i>';
        delBtn.addEventListener('click', function() {
            if (confirm('Apakah Anda yakin ingin menghapus data mahasiswa ini?')) {
                deleteMahasiswa(student.id);
            }
        });

        actionTd.appendChild(editBtn);
        actionTd.appendChild(delBtn);
        tr.appendChild(actionTd);

        tableBody.appendChild(tr);
        updateEmptyState();
    }

    // Render pagination
    function renderPagination() {
        var existingPagination = document.getElementById('paginationWrapper');
        if (existingPagination) {
            existingPagination.remove();
        }
        
        if (!paginationData || paginationData.total_pages <= 1) return;
        
        var tableContainer = document.querySelector('.table-responsive');
        if (!tableContainer) return;
        
        var paginationWrapper = document.createElement('div');
        paginationWrapper.id = 'paginationWrapper';
        paginationWrapper.className = 'd-flex justify-content-between align-items-center mt-3';
        
        // Info text
        var startNum = (paginationData.page - 1) * paginationData.limit + 1;
        var endNum = Math.min(paginationData.page * paginationData.limit, paginationData.total_data);
        
        paginationWrapper.innerHTML = '<div class="text-muted small">Menampilkan ' + 
            (mahasiswaData.length > 0 ? startNum : 0) + 
            '-' + endNum + 
            ' dari ' + paginationData.total_data + ' data</div>';
        
        var paginationNav = document.createElement('nav');
        paginationNav.setAttribute('aria-label', 'Page navigation');
        var ul = document.createElement('ul');
        ul.className = 'pagination pagination-sm mb-0';
        
        // Previous button
        var prevLi = document.createElement('li');
        prevLi.className = 'page-item' + (paginationData.has_prev ? '' : ' disabled');
        prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Previous">' +
            '<span aria-hidden="true">&laquo;</span></a>';
        if (paginationData.has_prev) {
            prevLi.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                goToPage(paginationData.page - 1);
            });
        }
        ul.appendChild(prevLi);
        
        // Page numbers - show max 5 pages
        var startPage = Math.max(1, paginationData.page - 2);
        var endPage = Math.min(paginationData.total_pages, paginationData.page + 2);
        
        // Add first page and ellipsis if needed
        if (startPage > 1) {
            var firstLi = document.createElement('li');
            firstLi.className = 'page-item';
            firstLi.innerHTML = '<a class="page-link" href="#">1</a>';
            firstLi.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                goToPage(1);
            });
            ul.appendChild(firstLi);
            
            if (startPage > 2) {
                var ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item disabled';
                ellipsisLi.innerHTML = '<span class="page-link">...</span>';
                ul.appendChild(ellipsisLi);
            }
        }
        
        for (var i = startPage; i <= endPage; i++) {
            var li = document.createElement('li');
            li.className = 'page-item' + (i === paginationData.page ? ' active' : '');
            li.innerHTML = '<a class="page-link" href="#">' + i + '</a>';
            li.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                goToPage(parseInt(this.textContent));
            });
            ul.appendChild(li);
        }
        
        // Add last page and ellipsis if needed
        if (endPage < paginationData.total_pages) {
            if (endPage < paginationData.total_pages - 1) {
                var ellipsisLi = document.createElement('li');
                ellipsisLi.className = 'page-item disabled';
                ellipsisLi.innerHTML = '<span class="page-link">...</span>';
                ul.appendChild(ellipsisLi);
            }
            
            var lastLi = document.createElement('li');
            lastLi.className = 'page-item';
            lastLi.innerHTML = '<a class="page-link" href="#">' + paginationData.total_pages + '</a>';
            lastLi.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                goToPage(paginationData.total_pages);
            });
            ul.appendChild(lastLi);
        }
        
        // Next button
        var nextLi = document.createElement('li');
        nextLi.className = 'page-item' + (paginationData.has_next ? '' : ' disabled');
        nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Next">' +
            '<span aria-hidden="true">&raquo;</span></a>';
        if (paginationData.has_next) {
            nextLi.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                goToPage(paginationData.page + 1);
            });
        }
        ul.appendChild(nextLi);
        
        paginationNav.appendChild(ul);
        paginationWrapper.appendChild(paginationNav);
        
        tableContainer.after(paginationWrapper);
    }

    function goToPage(page) {
        currentPage = page;
        loadMahasiswa();
    }

    // API functions
    async function loadMahasiswa() {
        try {
            showLoading(true);
            var filterParams = getFilterParams();
            var url = '../crud/mahasiswa.php?page=' + currentPage + '&limit=10';
            
            if (filterParams) {
                url += '&' + filterParams;
            }
            
            console.log('=== Loading Mahasiswa ===');
            console.log('URL:', url);
            console.log('Filter params:', filterParams);
            console.log('Current page:', currentPage);
            console.log('=========================');
            
            var response = await fetch(url, {
                credentials: 'same-origin'
            });
            console.log('Response status:', response.status);
            console.log('Response type:', response.type);
            console.log('Response url:', response.url);
            
            // Get response text first to debug
            var responseText = await response.text();
            console.log('Response text (first 500 chars):', responseText.substring(0, 500));
            
            if (!response.ok) {
                throw new Error('HTTP error! status: ' + response.status + ', body: ' + responseText);
            }
            
            // Try to parse JSON
            var contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON: ' + contentType + '. Response: ' + responseText);
            }
            
            var result = JSON.parse(responseText);
            console.log('Parsed result:', result);
            
            // Validate result structure
            if (!result) {
                throw new Error('Result is null or undefined');
            }
            
            mahasiswaData = Array.isArray(result.data) ? result.data : [];
            paginationData = result.pagination || null;
            
            console.log('Processed data:', mahasiswaData);
            console.log('Processed pagination:', paginationData);
            
            renderTable();
            renderPagination();
        } catch (error) {
            console.error('Error loading mahasiswa:', error);
            console.error('Stack:', error.stack);
            alert('Gagal memuat data mahasiswa: ' + error.message);
        } finally {
            showLoading(false);
        }
    }

    async function saveMahasiswa(studentData) {
        try {
            var response = await fetch('../crud/mahasiswa.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            var result = await response.json();
            if (result.success) {
                await loadMahasiswa();
                // Trigger dashboard refresh
                localStorage.setItem('dashboardNeedsRefresh', Date.now().toString());
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
            var data = { id: id };
            for (var key in studentData) {
                if (studentData.hasOwnProperty(key)) {
                    data[key] = studentData[key];
                }
            }
            var response = await fetch('../crud/mahasiswa.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            var result = await response.json();
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
            var response = await fetch('../crud/mahasiswa.php?id=' + id, {
                method: 'DELETE'
            });
            var result = await response.json();
            if (result.success) {
                await loadMahasiswa();
                // Trigger dashboard refresh
                localStorage.setItem('dashboardNeedsRefresh', Date.now().toString());
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
        
        if (mahasiswaData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="text-muted">
                            <i class="fas fa-users fa-3x mb-3 text-secondary"></i>
                            <p class="mb-0">Tidak ada data mahasiswa</p>
                            <small class="text-muted">Coba ubah filter atau tambahkan data baru</small>
                        </div>
                    </td>
                </tr>
            `;
            updateEmptyState();
            return;
        }
        
        mahasiswaData.forEach(function(student, index) {
            addRowToTable(student, index);
        });
        updateEmptyState();
    }

    function showLoading(show) {
        var table = document.getElementById('mahasiswaTable');
        if (table) {
            if (show) {
                table.style.opacity = '0.5';
                table.style.pointerEvents = 'none';
            } else {
                table.style.opacity = '1';
                table.style.pointerEvents = '';
            }
        }
    }

    // Update filter state from DOM elements
    function updateFilterState() {
        filterState.search = searchInput ? searchInput.value.trim() : '';
        filterState.prodi = filterProdi ? filterProdi.value : '';
        filterState.semester = filterSemester ? filterSemester.value : '';
    }

    // Combined filter function - uses persisted filter state
    function getFilterParams() {
        updateFilterState();
        
        var params = new URLSearchParams();
        
        // Search
        if (filterState.search) {
            params.append('search', filterState.search);
        }
        
        // Prodi filter
        if (filterState.prodi) {
            params.append('prodi', filterState.prodi);
        }
        
        // Semester filter
        if (filterState.semester) {
            params.append('semester', filterState.semester);
        }
        
        return params.toString();
    }

    // Reset all filters to default
    function resetFilters() {
        filterState = {
            search: '',
            prodi: '',
            semester: ''
        };
        
        if (searchInput) searchInput.value = '';
        if (filterProdi) filterProdi.value = '';
        if (filterSemester) filterSemester.value = '';
        
        currentPage = 1;
        loadMahasiswa();
        
        console.log('Filters reset, reloading data from page 1');
    }

    // Event listeners
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            openModal();
        });
    }

    // Reset form when modal is hidden
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', function() {
            form.removeAttribute('data-edit-id');
            form.reset();
            var nimInput = document.getElementById('nimInput');
            if (nimInput) nimInput.disabled = false;
        });
    }

    // Form submit
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            var nim = document.getElementById('nimInput').value.trim();
            var nama = document.getElementById('namaInput').value.trim();
            var prodi = document.getElementById('prodiInput').value.trim();
            var semester = document.getElementById('semesterInput').value.trim();
            var wali = document.getElementById('waliInput').value.trim();

            if (!nim || !nama) {
                alert('NIM dan Nama harus diisi.');
                return;
            }

            var student = {
                nim: nim,
                nama: nama,
                prodi: prodi,
                semester: semester ? parseInt(semester) : null,
                wali_dosen: wali
            };

            var editId = form.getAttribute('data-edit-id');
            var success = false;
            
            if (editId) {
                success = await updateMahasiswa(editId, student);
            } else {
                success = await saveMahasiswa(student);
            }

            if (success) {
                modalInstance.hide();
            }
        });
    }

    // Search functionality
    if (searchInput) {
        var searchTimeout;
        searchInput.addEventListener('input', function(e) {
            console.log('Search input changed:', e.target.value);
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                updateFilterState();
                console.log('Executing search with value:', filterState.search);
                currentPage = 1; // Reset to first page on search
                loadMahasiswa();
            }, 300);
        });
    } else {
        console.warn('searchInput element not found');
    }

    // Filter functionality
    if (filterProdi) {
        console.log('filterProdi element found, attaching change listener');
        filterProdi.addEventListener('change', function(e) {
            updateFilterState();
            console.log('Filter Prodi changed:', filterState.prodi);
            currentPage = 1; // Reset to first page on filter
            loadMahasiswa();
        });
    } else {
        console.warn('filterProdi element not found');
    }

    if (filterSemester) {
        console.log('filterSemester element found, attaching change listener');
        filterSemester.addEventListener('change', function(e) {
            updateFilterState();
            console.log('Filter Semester changed:', filterState.semester);
            currentPage = 1; // Reset to first page on filter
            loadMahasiswa();
        });
    } else {
        console.warn('filterSemester element not found');
    }

    // Reset filter button
    var resetFilterBtn = document.getElementById('resetFilterMahasiswa');
    if (resetFilterBtn) {
        console.log('resetFilterMahasiswa element found, attaching click listener');
        resetFilterBtn.addEventListener('click', function() {
            console.log('Reset filter button clicked');
            resetFilters();
        });
    } else {
        console.warn('resetFilterMahasiswa element not found');
    }

    // Log all filter elements status
    console.log('=== Filter Elements Status ===');
    console.log('searchInput:', searchInput ? 'Found' : 'NOT FOUND');
    console.log('filterProdi:', filterProdi ? 'Found' : 'NOT FOUND');
    console.log('filterSemester:', filterSemester ? 'Found' : 'NOT FOUND');
    console.log('=============================');

    // Load initial data
    loadMahasiswa();
});
