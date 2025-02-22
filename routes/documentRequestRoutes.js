const express = require('express');
const router = express.Router();
const DocumentRequest = require('../models/DocumentRequest');
const documentRequestController = require('../controllers/documentRequestController');
// ✅ Import the processRequest controller

const { processRequest } = require('../controllers/documentRequestController');
router.post('/request', documentRequestController.createDocumentRequest);

router.post('/request', async (req, res) => {
  try {
    const { documents, firstname, lastname } = req.body;

  
    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return res.status(400).json({ message: 'Documents field is required and should be a non-empty array.' });
    }

    if (!firstname || !lastname) {
      return res.status(400).json({ message: 'Firstname and lastname are required.' });
    }

    const newRequest = new DocumentRequest({ documents, firstname, lastname });
    await newRequest.save();

    res.status(201).json({
      message: 'Request saved successfully.',
      request: newRequest
    });

  } catch (error) {
    console.error('❌ Error saving document request:', error);
    res.status(500).json({ message: 'Error saving document request', error: error.message });
  }
});


router.get('/requestHistory', async (req, res) => {
  try {
      const requests = await DocumentRequest.find(); // Fetch all data from MongoDB
      res.json(requests);
  } catch (error) {
      console.error('Error fetching request history:', error);
      res.status(500).json({ message: 'Server error' });
  }
});
























// ✅ Use the processRequest controller for handling request processing
router.put('/request/process/:id', processRequest);



// In documentRequestRoutes.js or your routes file
router.put('/approve/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    console.log("Received requestId:", requestId);  // Add this log for debugging

    // Find the request by ID and update its status
    const request = await DocumentRequest.findByIdAndUpdate(
      requestId, 
      { status: 'Approved' }, // Update the status to Approved
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }
    
    res.status(200).json({ message: 'Request approved successfully.' });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Failed to approve the request.' });
  }
});













router.get("/history", async (req, res) => {
  try {
      const allRequests = await DocumentRequest.find();
      console.log("All Requests in Database:", allRequests); // Ipakita lahat ng laman

      const rejectedRequests = await DocumentRequest.find({ status: "Rejected" });
      console.log("Fetched Rejected Requests:", rejectedRequests);

      res.render("history", { history: rejectedRequests });
  } catch (error) {
      console.error("Error fetching rejected requests:", error);
      res.status(500).send("Server error");
  }
});







router.put('/request/reject/:id', async (req, res) => {
  try {
      const requestId = req.params.id;

      // Find the request by ID
      const request = await Request.findById(requestId);
      if (!request) {
          return res.status(404).json({ message: 'Request not found' });
      }

      // Move request data to requesthistories collection
      const requestHistory = new RequestHistory({
          requestId: request._id,
          firstname: request.firstname,
          lastname: request.lastname,
          documents: request.documents,
          dateRequested: request.dateRequested,
          status: 'Rejected',
          rejectedAt: new Date() // Timestamp for when it was rejected
      });

      await requestHistory.save(); // Save to requesthistories
      await Request.findByIdAndDelete(requestId); // Remove from requests

      res.json({ message: 'Request successfully rejected and moved to history.' });

  } catch (error) {
      console.error('Error rejecting request:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});








module.exports = router;
