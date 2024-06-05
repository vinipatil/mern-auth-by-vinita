const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://vv131835:BzRzJnEm0voFXXua@cluster0.onyltqk.mongodb.net/authuser?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  username: String,
  password: String,
  userType: { type: String, enum: ['admin', 'user'], default: 'user' },
  logins: [
    {
      loginTime: Date,
      logoutTime: Date,
    }
  ],
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async (req, res) => {
  const { name, phone, email, username, password } = req.body;
  let userType = 'user';
  if (email.endsWith('@numetry.com')) {
    userType = 'admin';
  }
  const user = new User({ name, phone, email, username, password, userType });
  await user.save();
  res.send({ message: 'User registered successfully' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    const loginTime = new Date();
    user.logins.push({ loginTime });
    await user.save();
    const loginIndex = user.logins.length - 1;  
    if (user.userType === 'admin') {
      res.send({ message: 'Welcome to the admin dashboard', loginIndex });
    } else {
      res.send({ message: 'Welcome to the user dashboard', loginIndex });
    }
  } else {
    res.send({ message: 'Invalid email or password' });
  }
});

app.post('/logout', async (req, res) => {
  const { email, loginIndex } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const logoutTime = new Date();
    user.logins[loginIndex].logoutTime = logoutTime;
    await user.save();
    res.send({ message: 'Logout successful' });
  } else {
    res.send({ message: 'User not found' });
  }
});

app.get('/user-logs', async (req, res) => {
  const users = await User.find({ userType: 'user' }, 'name email logins');
  res.send(users);
});

app.put('/update-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body; 
  try {
    await User.findByIdAndUpdate(userId, updatedUserData);
    res.send({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating user' });
  }
});

app.delete('/remove-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error deleting user' });
  }
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
