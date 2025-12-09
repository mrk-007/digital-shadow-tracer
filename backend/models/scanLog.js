// backend/models/scanLog.js
const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  email: { type: String, required: true },
  found: { type: Boolean, required: true },
  count: { type: Number, required: true },
  risk: { type: String, required: true },
  scannedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScanLog', scanSchema);
