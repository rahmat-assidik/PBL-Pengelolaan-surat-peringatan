let totalSurat = 0; // ini merupakan nilai awal

function updateDisplay() {
    const span = document.getElementById("suratPeringatanChange");
    const tanda = totalSurat >= 0 ? "+" : "";
    span.textContent = `${tanda}${totalSurat} bulan ini`;
}

// tambah data setelah create
function tambah() {
    totalSurat++;
    updateDisplay();
}

// data berkurang ketika di delete
function kurang() {
    totalSurat--;
    updateDisplay();
}

// inisialisasi tampilan awal
updateDisplay();

// contoh create
fetch('/api/surat-peringatan', {
  method: 'POST',
  body: JSON.stringify(data),
  headers: { 'Content-Type': 'application/json' }
})
.then(res => res.json())
.then(() => {
  tambah(); // panggil fungsi untuk update angka di tampilan
});

fetch(`/api/surat-peringatan/${id}`, {
  method: 'DELETE'
})
.then(res => res.json())
.then(() => {
  kurang();
});

localStorage.setItem('totalSurat', totalSurat);
totalSurat = parseInt(localStorage.getItem('totalSurat')) || 0;