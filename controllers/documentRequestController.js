const DocumentRequest = require('../models/DocumentRequest'); // ✅ Ensure correct model import

exports.processRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await DocumentRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // ✅ Update status to 'Processed', set processedAt timestamp, and save
    request.status = 'Processed';
    request.processedAt = new Date();
    await request.save();

    res.status(200).json({ 
      message: 'Request processed successfully.', 
      updatedRequest: request 
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ 
      message: 'Error processing request', 
      error: error.message 
    });
  }
};



exports.createDocumentRequest = async (req, res) => {
  console.log("Received Request Body:", req.body);

  // Validate documentType field
  if (!req.body.documentType || !Array.isArray(req.body.documentType) || req.body.documentType.length === 0) {
      return res.status(400).json({ message: "Documents field is required and should be a non-empty array." });
  }

  try {
      const newRequest = new DocumentRequest(req.body);
      await newRequest.save();
      res.status(201).json({ message: "Request saved successfully." });
  } catch (error) {
      console.error("Error saving request:", error);
      res.status(500).json({ message: "Internal server error." });
  }
};







// controllers/documentRequestController.js
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await DocumentRequest.findByIdAndDelete(id);
    if (!deletedRequest) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
