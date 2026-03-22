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
  const { fullName, email, password, role } = req.body; 

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    // We only insert columns that exist in your 'users' table
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash, role, is_onboarded) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, hash, role || 'job_seeker', 0] 
    );
    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.error("DETAILED ERROR:", err); // This shows the real problem in your terminal
    res.status(500).json({ error: err.message }); // Temporarily show the real error to React
  }
});
// --- FEATURE: LOGIN & AUTHENTICATION ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Include is_onboarded in the response
    res.json({
      id: user.user_id,
      username: user.username,
      email: user.email,
      role: user.role,
      is_onboarded: user.is_onboarded // This is the key for your React logic!
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/complete-onboarding', async (req, res) => {
  const { userId, role, profileData } = req.body;

  try {
    // 1. Insert into the profiles table
    const query = `
      INSERT INTO profiles 
      (user_id, first_name, last_name, phone, dob, gender, location, education_level, preferred_jobs, company_name, corporate_email, company_size, industry) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      profileData.firstName || null,
      profileData.lastName || null,
      profileData.phone || null,
      profileData.dob || null,
      profileData.gender || null,
      profileData.address || profileData.companyAddress || null,
      profileData.education || null,
      profileData.preferredJobs ? JSON.stringify(profileData.preferredJobs) : null,
      profileData.companyName || null,
      profileData.corporateEmail || null,
      profileData.companySize || null,
      profileData.industry || null
    ];

    await db.execute(query, values);

    // 2. FIXED: Update both 'is_onboarded' AND 'role'
    // This ensures the role changes from the registration default to what they picked in Onboarding
    await db.execute(
      'UPDATE users SET is_onboarded = 1, role = ? WHERE user_id = ?', 
      [role, userId]
    );

    res.json({ success: true, message: "Onboarding complete!" });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Failed to save profile. Check console for details." });
  }
});

app.post('/api/send-otp', async (req, res) => {
  const { userId, phoneNumber } = req.body;
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000); 

  try {
    // 1. Clear any old codes for this user first (optional but clean)
    await db.execute('DELETE FROM otp_codes WHERE user_id = ?', [userId]);

    // 2. Insert the new code (Valid for 5 minutes)
    await db.execute(
      'INSERT INTO otp_codes (user_id, code, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))',
      [userId, otp]
    );

    console.log(`>>> LOG: OTP for User ${userId} is ${otp} <<<`);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));