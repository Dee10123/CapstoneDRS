const User = require('../models/User');

exports.registerUser = async (req, res) => {
  try {
    const { firstname, lastname, age, birthday, address, mobile, email, password } = req.body;
    const user = new User({ firstname, lastname, age, birthday, address, mobile, email, password });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.render('register', { error: 'Registration failed. Please try again.' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password });

   
    if (email === 'admin@gmail.com' && password === 'admin123') {
      req.session.user = { email: 'admin@gmail.com', role: 'admin' };
      console.log("Admin login successful, redirecting to dashboard.");
      return res.redirect('/dashboard'); 
    }

    // Regular user login
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user || user.password !== password) {
      console.log("Invalid credentials.");
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.user = user;
    console.log("Login successful, redirecting...");
    res.redirect('/index');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'An error occurred. Please try again.' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    // Kung sakaling gusto mong gamitin ang user id mula sa session, pwede mong gawin:
    if (!req.session.user) return res.redirect('/login');
    const userId = req.session.user._id;

    // Kunin ang data mula sa form submission
    const { firstname, lastname, age, birthday, address, mobile, email, password } = req.body;

    // Gumawa ng update object; kung walang bagong password, huwag itong isama
    const updateData = { firstname, lastname, age, birthday, address, mobile, email };
    if (password && password.trim() !== '') {
      // Dito, siguraduhing i-hash ang password bago i-save (halimbawa gamit ang bcrypt)
      updateData.password = password;
    }

    await User.findByIdAndUpdate(userId, updateData);
    res.redirect('/profile/edit');
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.redirect('/admin_users');
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.render('admin_users', { users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error retrieving users' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    res.render('profile', { user: req.session.user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving profile' });
  }
};

exports.renderEditProfile = async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if (!user) return res.redirect('/login');
    res.render('editProfile', { user });
  } catch (error) {
    console.error('Error fetching user for edit profile:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Logout error:', err);
    res.redirect('/login');
  });
};
