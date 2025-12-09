// models/Sample.js
const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  kodeSample: { type: String, required: true },
  namaCustomer: { type: String, required: true },
  jenisBarang: { type: String, required: true },       // cincin, batu lepasan, logam mulia, dll
  jenisBatu: { type: String },                         // ruby, sapphire, diamond (opsional)
  metodeUji: { type: String, required: true },         // XRF, UTG, PMV, dll
  hasilUji: { type: String, required: true },          // pass/fail / kadar / catatan singkat
  tanggalUji: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sample', sampleSchema);
