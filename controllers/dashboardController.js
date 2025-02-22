const User = require('../models/User'); // Make sure the path is correct
const RequestHistory = require('../models/RequestHistory');


exports.getHistory = async (req, res) => {
    try {
        const history = await RequestHistory.find({ status: { $in: ['Approved', 'Rejected'] } }).sort({ dateRequested: -1 });
        res.render('history', { history });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).send('Server Error');
    }
};
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments(); // Count all users in MongoDB
    res.render('dashboard', { totalUsers }); // Pass totalUsers to EJS
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.render('dashboard', { totalUsers: 0 });
  }
};


exports.getHistory = async (req, res) => {
    try {
        const history = await RequestHistory.find({ status: { $in: ['Approved', 'Rejected'] } }).sort({ dateRequested: -1 });
        res.render('history', { history });
    } catch (err) {
        console.error('Error fetching history:', err);
        res.status(500).send('Server Error');
    }
};
exports.getRequestHistory = async (req, res) => {
  try {
      const history = await RequestHistory.find().sort({ dateRequested: -1 });
      res.render('history', { history });
  } catch (err) {
      console.error('Error fetching history:', err);
      res.render('history', { history: [] });
  }
};
