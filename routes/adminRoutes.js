const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DocumentRequest = require('../models/DocumentRequest');
const RequestHistory = require('../models/RequestHistory');

// Helper function for status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'bg-green-500';
    case 'Pending': return 'bg-yellow-500';
    case 'Rejected': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

// Request Page - Displays all document requests
router.get('/request', async (req, res) => {
  const user = req.session.user;
  if (!user) return res.redirect('/login');

  try {
    const requests = await DocumentRequest.find().sort({ createdAt: -1 });
    res.render('admin/request', { requests, getStatusColor, user });
  } catch (error) {
    console.error('Error fetching document requests:', error);
    res.render('admin/request', { requests: [], getStatusColor, user });
  }
});

// Account Creation Page - Displays user creation form and user list
router.get('/accountcreation', async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin/accountcreation', { title: 'Account Creation', users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.render('admin/accountcreation', { title: 'Account Creation', users: [] });
  }
});

// Documents Page
router.get('/documents', (req, res) => {
  res.render('admin/documents', { title: 'Documents' });
});

// Request History Page - Displays approved and rejected requests
router.get('/history', async (req, res) => {
  try {
    const history = await RequestHistory.find({
      status: { $in: ['approved', 'rejected'] }
    }).sort({ dateProcessed: -1 });

    res.render('admin/history', { title: 'Request History', history });
  } catch (error) {
    console.error('Error fetching request history:', error);
    res.status(500).render('admin/history', { title: 'Request History', history: [] });
  }
});

// Messages Page
router.get('/messages', (req, res) => {
  res.render('admin/messages', { title: 'Messages' });
});

// Payments Page
router.get('/payments', (req, res) => {
  res.render('admin/payments', { title: 'Payments' });
});
// Reject Document Request
router.put('/request/reject/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const request = await DocumentRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Document request not found.' });
    }
    
    // Update the status to 'Rejected'
    request.status = 'Rejected';
    await request.save();
    
    res.status(200).json({ message: 'Document request rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting document request:', error);
    res.status(500).json({ message: 'Failed to reject document request.' });
  }
});


// Route para makuha lang ang mga "rejected" na requests
router.get("/rejected-requests", async (req, res) => {
    try {
        const rejectedRequests = await DocumentRequest.find({ status: "rejected" }); // Filter
        res.render("history", { history: rejectedRequests }); // I-send sa frontend
    } catch (error) {
        console.error("Error fetching rejected requests:", error);
        res.status(500).send("Server error");
    }
});

module.exports = router;


