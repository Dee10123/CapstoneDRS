const mongoose = require('mongoose');

const documentRequestSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  documentType: [String],  
  purpose: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'], // Assuming the status can be one of these
    default: 'Pending',
  },
  dateRequested: { type: Date, default: Date.now },
}, { timestamps: true });

// ✅ Check if model already exists to prevent OverwriteModelError
module.exports = mongoose.models.DocumentRequest || mongoose.model('DocumentRequest', documentRequestSchema); 