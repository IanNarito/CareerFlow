const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- 1. FETCH PROFILE (The missing piece for your Dashboard) ---
app.get('/api/hr/profile/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid User ID format" });
    }

    try {
        const [rows] = await db.execute('SELECT * FROM profiles WHERE user_id = ?', [userId]);
        
        if (rows.length > 0) {
            console.log(`>>> Success: Profile for User ${userId} sent to Dashboard <<<`);
            res.json(rows[0]); 
        } else {
            console.log(`>>> Error: User ${userId} has no profile row yet <<<`);
            res.status(404).json({ error: "Profile not found" });
        }
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: "Server database error" });
    }
});

// --- 2. USER REGISTRATION ---
app.post('/api/register', async (req, res) => {
    const { fullName, email, password, role } = req.body; 

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (username, email, password_hash, role, is_onboarded) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, hash, role || 'job_seeker', 0] 
        );
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- 3. LOGIN ---
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

        res.json({
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            is_onboarded: user.is_onboarded 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// --- 4. COMPLETE ONBOARDING ---
app.post('/api/complete-onboarding', async (req, res) => {
    const { userId, role, profileData } = req.body;

    try {
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

        await db.execute(
            'UPDATE users SET is_onboarded = 1, role = ? WHERE user_id = ?', 
            [role, userId]
        );

        res.json({ success: true, message: "Onboarding complete!" });
    } catch (err) {
        console.error("Onboarding Database Error:", err);
        res.status(500).json({ error: "Failed to save profile." });
    }
});

// --- 5. OTP FEATURES ---
app.post('/api/send-otp', async (req, res) => {
    const { userId } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); 

    try {
        await db.execute('DELETE FROM otp_codes WHERE user_id = ?', [userId]);
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

// --- NEW ROUTE: SAVE JOB TO DATABASE ---
app.post('/api/jobs/create', async (req, res) => {
    const { hrId, companyName, jobData } = req.body;

    try {
        const query = `
            INSERT INTO jobs 
            (hr_id, title, vacancies, location, employment_type, salary_min, salary_max, pay_period, education_level, required_skills, description, company_name, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `;

        const values = [
            hrId,
            jobData.title,
            jobData.vacancies,
            jobData.location,
            jobData.employmentType,
            jobData.salaryMin || 0,
            jobData.salaryMax || 0,
            jobData.payPeriod,
            jobData.education,
            JSON.stringify(jobData.requirements), // Saves the array as a string
            jobData.description,
            companyName
        ];

        await db.execute(query, values);
        
        console.log(`>>> Success: Job "${jobData.title}" posted by ${companyName} <<<`);
        res.json({ success: true, message: "Job published!" });
        
    } catch (err) {
        console.error("Job Post Error:", err);
        res.status(500).json({ error: "Failed to save job to database." });
    }
});

// --- NEW ROUTE: FETCH JOBS FOR SPECIFIC HR ---
// --- 1. FETCH JOBS FOR HR ---
app.get('/api/hr/jobs/:hrId', async (req, res) => {
    const { hrId } = req.params;
    
    // Safety check: ensure hrId is a number
    if (!hrId || isNaN(hrId)) {
        return res.status(400).json({ error: "Invalid HR ID" });
    }

    try {
        // We use posted_at because that is what is in your database screenshot
        const [rows] = await db.execute(
            'SELECT * FROM jobs WHERE hr_id = ? ORDER BY posted_at DESC', 
            [hrId]
        );
        res.json(rows);
    } catch (err) {
        console.error("CRITICAL DATABASE ERROR:", err.message);
        res.status(500).json({ error: "Database query failed", details: err.message });
    }
});

// --- 2. UPDATE JOB (Fixed for ENUM and Case Sensitivity) ---
app.put('/api/jobs/update/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const { title, location, vacancies, status, salary_min, salary_max } = req.body;
    
    try {
        // We use .toLowerCase() because MySQL ENUM is case-sensitive 
        // and expects 'active', not 'Active'
        const cleanStatus = status ? status.toLowerCase() : 'active';

        await db.execute(
            'UPDATE jobs SET title=?, location=?, vacancies=?, status=?, salary_min=?, salary_max=? WHERE job_id=?',
            [title, location, vacancies, cleanStatus, salary_min, salary_max, jobId]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Update Job Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- 3. DELETE JOB ---
app.delete('/api/jobs/delete/:jobId', async (req, res) => {
    const { jobId } = req.params;
    try {
        await db.execute('DELETE FROM jobs WHERE job_id = ?', [jobId]);
        res.json({ success: true });
    } catch (err) {
        console.error("Delete Job Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// --- FETCH CANDIDATE & APPLICATION DETAILS ---
app.get('/api/hr/application-review/:appId', async (req, res) => {
    const { appId } = req.params;
    try {
        const query = `
            SELECT 
                a.app_id, a.status, a.match_score, a.applied_at, a.interview_date,
                p.first_name, p.last_name, p.phone, p.location, p.education_level, p.gender,
                u.email,
                j.title as job_title
            FROM applications a
            JOIN profiles p ON a.user_id = p.user_id
            JOIN users u ON a.user_id = u.user_id
            JOIN jobs j ON a.job_id = j.job_id
            WHERE a.app_id = ?
        `;
        const [rows] = await db.execute(query, [appId]);
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Application not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error fetching application" });
    }
});

// --- UPDATE APPLICATION STATUS (Reject/Review) ---
app.put('/api/applications/status/:appId', async (req, res) => {
    const { appId } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE applications SET status = ? WHERE app_id = ?', [status, appId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- SCHEDULE INTERVIEW ---
app.put('/api/applications/schedule/:appId', async (req, res) => {
    const { appId } = req.params;
    const { interviewDate } = req.body; // Expects YYYY-MM-DD HH:MM:SS
    try {
        await db.execute(
            'UPDATE applications SET status = "Interview Scheduled", interview_date = ? WHERE app_id = ?', 
            [interviewDate, appId]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 1. GET ALL APPLICATIONS FOR HR PIPELINE ---
app.get('/api/hr/applications/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT 
                a.app_id, a.status, a.match_score, a.applied_at,
                p.first_name, p.last_name, p.education_level,
                j.title as job_title
            FROM applications a
            JOIN profiles p ON a.user_id = p.user_id
            JOIN jobs j ON a.job_id = j.job_id
            WHERE j.hr_id = ?
            ORDER BY a.applied_at DESC
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. UPDATE APPLICATION STATUS (On Drag/Drop) ---
app.put('/api/applications/status/:appId', async (req, res) => {
    const { appId } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE applications SET status = ? WHERE app_id = ?', [status, appId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- FETCH INTERVIEWS FOR HR ---
app.get('/api/hr/interviews/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT 
                a.app_id, a.interview_date, a.status,
                p.first_name, p.last_name,
                j.title as job_title
            FROM applications a
            JOIN profiles p ON a.user_id = p.user_id
            JOIN jobs j ON a.job_id = j.job_id
            WHERE j.hr_id = ? AND a.interview_date IS NOT NULL
            ORDER BY a.interview_date ASC
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/hr/profile/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT p.*, u.email 
            FROM profiles p 
            JOIN users u ON p.user_id = u.user_id 
            WHERE p.user_id = ?
        `;
        const [rows] = await db.execute(query, [hrId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Profile not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/hr/profile/update/:hrId', async (req, res) => {
    const { hrId } = req.params;
    const { company_name, location, description, phone } = req.body;

    try {
        // We use user_id because that is the Primary Key in your profiles table
        const [result] = await db.execute(
            `UPDATE profiles SET 
            company_name = ?, 
            location = ?, 
            description = ?, 
            phone = ? 
            WHERE user_id = ?`,
            [company_name, location, description, phone, hrId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Profile not found to update" });
        }

        res.json({ success: true, message: "Profile updated!" });
    } catch (err) {
        // Check your Node.js terminal for this specific message
        console.error("UPDATE PROFILE ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// Important: Export the app so index.js can see it
module.exports = app;