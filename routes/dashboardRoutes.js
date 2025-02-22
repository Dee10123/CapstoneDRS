const express = require('express');
const router = express.Router();
const User = require('../models/User'); // ✅ Check the path to your User model
const dashboardController = require('../controllers/dashboardController');

// Dashboard route
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // 📝 Get total users
    console.log('✅ Passing totalUsers:', totalUsers); // 🔍 Log the value here

    res.render('admin/dashboard', { totalUsers }); // 🚀 Pass totalUsers to the EJS view
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.render('admin/dashboard', { totalUsers: 0 }); // 🛡️ Pass default value if error occurs
  }
});



module.exports = router;
