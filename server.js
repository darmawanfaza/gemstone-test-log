// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // opsional kalau pakai .env

const Sample = require('./models/Sample');

const app = express();
const PORT = process.env.PORT || 5000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ====== KONEKSI MONGODB ======
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gemstone_test_log';

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ====== ROUTES API ======

// GET semua sample
app.get('/api/samples', async (req, res) => {
  try {
    const samples = await Sample.find().sort({ tanggalUji: -1 });
    res.json(samples);
  } catch (err) {
    res.status(500).json({ message: 'Error mengambil data', error: err.message });
  }
});

// POST tambah sample
app.post('/api/samples', async (req, res) => {
  try {
    const sample = new Sample(req.body);
    const saved = await sample.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: 'Error menyimpan data', error: err.message });
  }
});

// DELETE hapus sample
app.delete('/api/samples/:id', async (req, res) => {
  try {
    await Sample.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sample dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Error menghapus data', error: err.message });
  }
});

// ====== JALANKAN SERVER ======
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
