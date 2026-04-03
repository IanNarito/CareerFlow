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

// --- FETCH APPLICATION TRACKING DETAILS ---
app.get('/api/jobseeker/application/:appId', async (req, res) => {
    const { appId } = req.params;
    try {
        const query = `
            SELECT 
                a.app_id, a.status, a.applied_at, a.interview_date, a.match_score,
                j.title as job_title, j.location as job_location, j.description as job_desc,
                p.company_name, p.location as company_location
            FROM applications a
            JOIN jobs j ON a.job_id = j.job_id
            JOIN profiles p ON j.hr_id = p.user_id
            WHERE a.app_id = ?
        `;
        const [rows] = await db.execute(query, [appId]);
        
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Application record not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 1. GET PUBLIC COMPANY PROFILE ---
app.get('/api/public/company/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `SELECT company_name, industry, location, description, website FROM profiles WHERE user_id = ?`;
        const [rows] = await db.execute(query, [hrId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Company not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. GET ACTIVE JOBS FOR THIS COMPANY ---
app.get('/api/public/company/:hrId/jobs', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `SELECT * FROM jobs WHERE hr_id = ? AND status = 'active' ORDER BY posted_at DESC`;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 1. GET CONVERSATION LIST (INBOX) ---
app.get('/api/messages/inbox/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT DISTINCT 
                u.user_id, p.company_name, p.first_name, p.last_name, 
                j.title as role,
                (SELECT message_text FROM messages 
                 WHERE (sender_id = u.user_id AND receiver_id = ?) 
                 OR (sender_id = ? AND receiver_id = u.user_id) 
                 ORDER BY created_at DESC LIMIT 1) as lastMessage,
                (SELECT created_at FROM messages 
                 WHERE (sender_id = u.user_id AND receiver_id = ?) 
                 OR (sender_id = ? AND receiver_id = u.user_id) 
                 ORDER BY created_at DESC LIMIT 1) as time
            FROM users u
            JOIN profiles p ON u.user_id = p.user_id
            JOIN applications a ON (a.user_id = u.user_id OR a.user_id = ?)
            JOIN jobs j ON a.job_id = j.job_id
            WHERE u.user_id != ?
        `;
        const [rows] = await db.execute(query, [userId, userId, userId, userId, userId, userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. GET MESSAGES FOR A SPECIFIC CHAT ---
app.get('/api/messages/history/:userId/:otherId', async (req, res) => {
    const { userId, otherId } = req.params;
    try {
        const query = `
            SELECT * FROM messages 
            WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `;
        const [rows] = await db.execute(query, [userId, otherId, otherId, userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 3. SEND A MESSAGE ---
app.post('/api/messages/send', async (req, res) => {
    const { sender_id, receiver_id, message_text, message_type } = req.body;
    try {
        await db.execute(
            'INSERT INTO messages (sender_id, receiver_id, message_text, message_type) VALUES (?, ?, ?, ?)',
            [sender_id, receiver_id, message_text, message_type || 'text']
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET JOB SEEKER APPLICATIONS ---
app.get('/api/jobseeker/applications/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT 
                a.app_id as id, a.status, a.applied_at, a.match_score,
                j.title as jobTitle, j.location,
                p.company_name as company
            FROM applications a
            JOIN jobs j ON a.job_id = j.job_id
            JOIN profiles p ON j.hr_id = p.user_id
            WHERE a.user_id = ?
            ORDER BY a.applied_at DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET ALL SAVED JOBS FOR A USER ---
app.get('/api/saved-jobs/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT s.save_id, s.saved_at, j.*, p.company_name
            FROM saved_jobs s
            JOIN jobs j ON s.job_id = j.job_id
            JOIN profiles p ON j.hr_id = p.user_id
            WHERE s.user_id = ?
            ORDER BY s.saved_at DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- REMOVE A SAVED JOB ---
app.delete('/api/saved-jobs/:userId/:jobId', async (req, res) => {
    const { userId, jobId } = req.params;
    try {
        await db.execute('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [userId, jobId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/jobseeker/dashboard/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // 1. Get Stats (Applications, Saved, Unread)
        const [appCount] = await db.execute('SELECT COUNT(*) as c FROM applications WHERE user_id = ?', [userId]);
        const [savedCount] = await db.execute('SELECT COUNT(*) as c FROM saved_jobs WHERE user_id = ?', [userId]);
        const [unreadMsg] = await db.execute('SELECT COUNT(*) as c FROM messages WHERE receiver_id = ? AND is_read = 0', [userId]);
        const [intvCount] = await db.execute('SELECT COUNT(*) as c FROM applications WHERE user_id = ? AND status = "Interview Scheduled"', [userId]);

        // 2. Recent Applications
        const [recentApps] = await db.execute(`
            SELECT a.app_id as id, a.status, a.applied_at, j.title as jobTitle, p.company_name as company
            FROM applications a JOIN jobs j ON a.job_id = j.job_id JOIN profiles p ON j.hr_id = p.user_id
            WHERE a.user_id = ? ORDER BY a.applied_at DESC LIMIT 3`, [userId]);

        // 3. Recent Messages
        const [recentMessages] = await db.execute(`
            SELECT m.*, p.company_name as company
            FROM messages m JOIN profiles p ON m.sender_id = p.user_id
            WHERE m.receiver_id = ? ORDER BY m.created_at DESC LIMIT 3`, [userId]);

        // 4. Matches (Recommended Jobs)
        const [recommended] = await db.execute(`
            SELECT j.*, p.company_name FROM jobs j JOIN profiles p ON j.hr_id = p.user_id
            WHERE j.status = 'active' ORDER BY j.posted_at DESC LIMIT 3`);

        res.json({
            stats: { activeCount: appCount[0].c, savedCount: savedCount[0].c, unreadMessages: unreadMsg[0].c, interviewCount: intvCount[0].c },
            recentApps,
            recentMessages,
            recommendedJobs: recommended
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/jobseeker/profile/save', async (req, res) => {
    const { user_id, skills, description } = req.body;
    try {
        // 1. Update the profile
        await db.execute(
            'UPDATE profiles SET skills = ?, description = ? WHERE user_id = ?',
            [skills, description, user_id]
        );

        // 2. Mark user as onboarded in the users table
        await db.execute(
            'UPDATE users SET is_onboarded = 1 WHERE user_id = ?',
            [user_id]
        );

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const { extractResumeInfo } = require('./gemini');

app.post('/api/ai/extract-resume', async (req, res) => {
    const { transcript } = req.body;

    try {
        const structuredData = await extractResumeInfo(transcript);
        res.json(structuredData);
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "AI processing failed" });
    }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/ai/extract-resume', async (req, res) => {
    const { transcript, step } = req.body;

    // Custom prompt based on the interview step
    let promptSuffix = "";
    if (step === 0) promptSuffix = "Extract the 'role' and the 'company'.";
    if (step === 1) promptSuffix = "Extract 2-3 professional 'responsibilities' as bullet points.";
    if (step === 2) promptSuffix = "Extract a list of 3-5 technical 'skills' or tools mentioned.";

    const prompt = `
        Context: The user is a blue-collar worker in the Philippines providing voice answers for a resume. 
        The answer might be in Taglish (Tagalog-English).
        Transcript: "${transcript}"
        Task: ${promptSuffix} Translate to professional English if needed. 
        Return ONLY a raw JSON object with these keys: "role", "company", "responsibilities" (array), "skills" (array).
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean the markdown if Gemini returns it with ```json blocks
        const cleanedJson = text.replace(/```json|```/g, "").trim();
        res.json(JSON.parse(cleanedJson));
    } catch (err) {
        console.error("Gemini Error:", err);
        res.status(500).json({ error: "Failed to parse AI response" });
    }
});
// Important: Export the app so index.js can see it
module.exports = app;