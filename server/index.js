const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- FEATURE: USER REGISTRATION (CRUD) ---
app.post('/api/register', async (req, res) => {
  // If React sends 'fullName', you MUST pull 'fullName' here
  const { fullName, email, password, role } = req.body; 

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [fullName, email, hash, role || 'job_seeker']
    );
    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Database error occurred" });
  }
});
// --- FEATURE: LOGIN & AUTHENTICATION ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1. Check if user exists
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // 2. Web Security: Compare Hashed Passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 3. Send user data (excluding password) back to frontend
    res.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role // Necessary for HR/Admin vs Job Seeker redirection
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));