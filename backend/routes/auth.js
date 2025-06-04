const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/register', (req, res) => {
  console.log('Register endpoint HIT');
  console.log('Users file path:', usersFile);

  const { email, password } = req.body;

  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify([], null, 2));
  }

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters and include at least one uppercase letter, one number, and one special character.'
    });
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    const fileData = fs.readFileSync(usersFile, 'utf-8');
    console.log('FileData:', fileData);
    users = JSON.parse(fileData);
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User already exists.' });
  }

  users.push({ id: Date.now(), email, password });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  return res.json({ success: true, message: 'User registered successfully', token: 'dummy-token' });
});

module.exports = router;
