const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'edugamehub-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(express.static('public')); // serves login.html etc.

const usersFile = path.join(__dirname, 'users.json');
const teachersFile = path.join(__dirname, 'teachers.json');

// Load users from JSON
function loadUsers() {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, '[]');
  }
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

// Save users to JSON
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Load teachers from JSON
function loadTeachers() {
  if (!fs.existsSync(teachersFile)) {
    // Create default teacher account
    const defaultTeachers = [
      { name: 'Demo Teacher', email: 'teacher@edu.com', password: 'teacher123' }
    ];
    fs.writeFileSync(teachersFile, JSON.stringify(defaultTeachers, null, 2));
  }
  const data = fs.readFileSync(teachersFile);
  return JSON.parse(data);
}

// 🔐 STUDENT LOGIN endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Store user data in session
    req.session.user = {
      name: user.name,
      email: user.email,
      type: 'student'
    };
    // Redirect to home if successful
    res.redirect('/home.html');
  } else {
    res.status(401).send('Invalid credentials. <a href="/login.html">Try again</a>');
  }
});

// 👨‍🏫 TEACHER LOGIN endpoint
app.post('/teacher-login', (req, res) => {
  const { email, password } = req.body;
  const teachers = loadTeachers();

  const teacher = teachers.find(t => t.email === email && t.password === password);

  if (teacher) {
    // Store teacher data in session
    req.session.user = {
      name: teacher.name,
      email: teacher.email,
      type: 'teacher'
    };
    // Redirect to teacher dashboard if successful
    res.redirect('/teacher.html');
  } else {
    res.status(401).send('Invalid teacher credentials. <a href="/login.html">Try again</a>');
  }
});

// 📝 SIGNUP endpoint
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const users = loadUsers();

  const userExists = users.some(u => u.email === email);
  if (userExists) {
    return res.status(400).send('User already exists. <a href="/login.html">Login</a>');
  }

  const newUser = { name, email, password };
  users.push(newUser);
  saveUsers(users);

  // Store user data in session
  req.session.user = {
    name: newUser.name,
    email: newUser.email,
    type: 'student'
  };

  // After signup, go to home
  res.redirect('/home.html');
});

// 👤 GET CURRENT USER INFO endpoint
app.get('/api/user-info', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

// 🚪 LOGOUT endpoint
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
