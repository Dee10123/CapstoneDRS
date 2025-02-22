const mongoose = require('mongoose');

const requestHistorySchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    documents: { type: [String], required: true },
    dateRequested: { type: Date, required: true },
    status: { type: String, default: 'Rejected' },
    rejectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RequestHistory', requestHistorySchema);
