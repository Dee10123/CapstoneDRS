const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');

// Create a new announcement
router.post('/create', async (req, res) => {
  try {
    const { title, description, image } = req.body;

    const newAnnouncement = new Announcement({ title, description, image });
    await newAnnouncement.save();

    res.status(201).json({ message: 'Announcement created successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create announcement', error: err });
  }
});

// Get all announcements
router.get('/all', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch announcements', error: err });
  }
});

module.exports = router;
