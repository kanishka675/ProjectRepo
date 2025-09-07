const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // serves login.html etc.

const usersFile = path.join(__dirname, 'users.json');

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

// 🔐 LOGIN endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Redirect to home if successful
    res.redirect('/home.html');
  } else {
    res.status(401).send('Invalid credentials. <a href="/login.html">Try again</a>');
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

  users.push({ name, email, password });
  saveUsers(users);

  // After signup, go to home
  res.redirect('/home.html');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
