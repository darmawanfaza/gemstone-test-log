// public/app.js
const API_BASE = '/api/samples'; // karena frontend & backend satu server

const sampleForm = document.getElementById('sampleForm');
const tableBody = document.getElementById('sampleTableBody');

async function fetchSamples() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    renderTable(data);
  } catch (err) {
    console.error('Error fetch data:', err);
    alert('Gagal mengambil data dari server');
  }
}

function renderTable(samples) {
  tableBody.innerHTML = '';

  if (!samples.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; color:#9ca3af;">
          Belum ada data pengujian.
        </td>
      </tr>
    `;
    return;
  }

  samples.forEach(sample => {
    const tr = document.createElement('tr');

    const tanggal = new Date(sample.tanggalUji);
    const tanggalStr = tanggal.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    tr.innerHTML = `
      <td>${sample.kodeSample}</td>
      <td>${sample.namaCustomer}</td>
      <td>${sample.jenisBarang}</td>
      <td>${sample.jenisBatu || '-'}</td>
      <td><span class="badge">${sample.metodeUji}</span></td>
      <td>${sample.hasilUji}</td>
      <td>${tanggalStr}</td>
      <td>
        <button class="aksi-btn delete-btn" data-id="${sample._id}">
          Hapus
        </button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  // event listener tombol hapus
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      const id = e.target.getAttribute('data-id');
      if (!confirm('Yakin hapus data ini?')) return;

      try {
        await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
        fetchSamples();
      } catch (err) {
        console.error('Error delete:', err);
        alert('Gagal menghapus data');
      }
    });
  });
}

// submit form
sampleForm.addEventListener('submit', async e => {
  e.preventDefault();

  const payload = {
    kodeSample: document.getElementById('kodeSample').value.trim(),
    namaCustomer: document.getElementById('namaCustomer').value.trim(),
    jenisBarang: document.getElementById('jenisBarang').value,
    jenisBatu: document.getElementById('jenisBatu').value.trim(),
    metodeUji: document.getElementById('metodeUji').value,
    hasilUji: document.getElementById('hasilUji').value.trim()
  };

  if (!payload.kodeSample || !payload.namaCustomer || !payload.jenisBarang || !payload.metodeUji || !payload.hasilUji) {
    alert('Harap isi semua field wajib.');
    return;
  }

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Gagal menyimpan data');
    }

    // reset form & refresh table
    sampleForm.reset();
    fetchSamples();
  } catch (err) {
    console.error('Error submit:', err);
    alert(err.message);
  }
});

// load awal
fetchSamples();
