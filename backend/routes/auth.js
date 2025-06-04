const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const usersFile = path.join(__dirname, '../data/users.json');
  const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    return res.json({ success: true, token: 'fake-token-12345' });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
