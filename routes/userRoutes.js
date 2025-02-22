// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middleware/auth');
const User = require('../models/User');


// Render pages
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});
router.get('/user', (req, res) => res.render('userview'));
router.get('/admin_dashboard', (req, res) => res.render('admin_dashboard'));
router.get('/index', (req, res) => res.render('index', { user: req.session.user }));
router.get('/admin_users', userController.getAllUsers);
router.get('/profile', isAuthenticated, userController.getUserProfile);
router.get('/logout', userController.logout);

// API routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/update-user/:id', userController.updateUser);
router.post('/delete-user/:id', userController.deleteUser);
router.get('/about', (req, res) => {
    res.render('about', {
      title: 'About Us'
      // You can add any additional data here if needed
    });
  });
  router.get('/faq', (req, res) => {
    res.render('faq', {
      title: 'faq daw'
      // You can add any additional data here if needed
    });
  });
  router.get('/contact', (req, res) => {
    res.render('contact', {
      title: 'contact daw'
      // You can add any additional data here if needed
    });
  });
  router.get('/profile', (req, res) => {
    res.render('profile', {
      title: 'profile daw'
      // You can add any additional data here if needed
    });
  });
  router.get('/forgotpass', (req, res) => {
    res.render('forgotpass', {
      title: 'forgotpass daw sabi nila' 
      // You can add any additional data here if needed
    });
  });
  router.get('/accountcreation', async (req, res) => {
    try {
      const users = await User.find();
      res.render('admin/accountcreation', { users });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    }
  });
  router.get('/announcement', async (req, res) => {
    try {
      const users = await User.find();
      res.render('admin/announcement', { users });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    }
  });


  router.delete('/delete-resident/:id', async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Check if user exists before deleting
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      await User.findByIdAndDelete(userId);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete user", error });
    }
  });

module.exports = router;
