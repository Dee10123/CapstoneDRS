// controllers/requestController.js
const Request = require('../models/Request');
const RequestHistory = require('../models/RequestHistory');

// Create a new request
exports.createRequest = async (req, res) => {
  try {
    const { name, documentType, reason } = req.body;
    const newRequest = new Request({ name, documentType, reason, status: 'Pending' });
    await newRequest.save();
    res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};

// Get all requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
};

// Approve request and move to history
exports.approveRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const approvedRequest = new RequestHistory({
      name: request.name,
      documentType: request.documentType,
      reason: request.reason,
      status: 'Approved',
      createdAt: request.createdAt,
    });

    await approvedRequest.save();
    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Request approved and moved to history', request: approvedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error approving request', error });
  }
};

// Reject request and move to history
exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const rejectedRequest = new RequestHistory({
      name: request.name,
      documentType: request.documentType,
      reason: request.reason,
      status: 'Rejected',
      createdAt: request.createdAt,
    });

    await rejectedRequest.save();
    await Request.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Request rejected and moved to history', request: rejectedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting request', error });
  }
};

// Delete request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error });
  }
};
