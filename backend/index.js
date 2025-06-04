const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, 'data', 'users.json');

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    return res.json({ success: true, token: 'dummy-token' });
  } else {
    return res.json({ success: false, message: 'Invalid credentials' });
  }
});

// Register endpoint (optional)
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  users.push({ email, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  
  return res.json({ success: true, message: 'User registered successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
