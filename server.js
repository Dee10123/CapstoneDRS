const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const documentRequestRoutes = require('./routes/documentRequestRoutes');
const DocumentRequest = require('./models/DocumentRequest');
const User = require('./models/User');
app.use(express.static('public'));
const dashboardRoutes = require('./routes/dashboardRoutes');
const Message = require('./models/Message'); 
const announcementRoutes = require('./routes/announcementRoutes');

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/api', documentRequestRoutes);


app.use('/api/documents', documentRequestRoutes);
app.use('/api/announcements', announcementRoutes);

app.use('/', dashboardRoutes);

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/', userRoutes);
app.use('/', adminRoutes);

// Initialize the router here
const router = express.Router();

// Define the approval route here



// Use the router after defining routes
app.use('/api', router);

app.get('/', (req, res) => {
  res.redirect('/login');  // or res.render('login') if you prefer
});














// Route to handle form submission (Saving message to MongoDB)
app.post('/send-message', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Create a new message document and save it to the database
    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();
    res.status(200).send({ message: 'Message sent successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving message', error });
  }
});



app.get('/api/messages', async (req, res) => {
  try {
      const messages = await Message.find(); // Fetch all messages from MongoDB
      res.json(messages); // Send messages as a response
  } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
  }
});


// Endpoint to delete a message by ID
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedMessage = await Message.findByIdAndDelete(id); // Delete the message by its ID
      if (!deletedMessage) {
          return res.status(404).json({ message: 'Message not found' });
      }
      res.json({ message: 'Message deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting message' });
  }
});







const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
