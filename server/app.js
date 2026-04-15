const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const { spawn } = require('child_process');
const multer = require('multer'); 
const path = require('path');     
require('dotenv').config();

const app = express();

// --- 1. RENDER PROXY FIX (Required for HTTPS and absolute URLs) ---
app.set('trust proxy', 1);

// --- 2. MULTER IMAGE UPLOAD SETUP ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, 'job_' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// --- 3. DYNAMIC CORS SETUP ---
const allowedOrigins = [
    'https://main.dtrl0392tieit.amplifyapp.com', // Production URL
    'http://localhost:3000',                     // Local Testing
    'http://localhost:5173'                      // Vite Local Testing
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// ==========================================
// AUTH & ONBOARDING ROUTES
// ==========================================

app.post('/api/register', async (req, res) => {
    const { fullName, email, password, role } = req.body; 
    if (!fullName || !email || !password) return res.status(400).json({ error: "All fields are required" });

    try {
        const hash = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (username, email, password_hash, role, is_onboarded) VALUES (?, ?, ?, ?, ?)',
            [fullName, email, hash, role || 'job_seeker', 0] 
        );
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

        res.json({
            id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            is_onboarded: user.is_onboarded 
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post('/api/complete-onboarding', async (req, res) => {
    const { userId, role, profileData } = req.body;
    try {
        const query = `
            INSERT INTO profiles 
            (user_id, first_name, last_name, phone, dob, gender, location, education_level, preferred_jobs, company_name, corporate_email, company_size, industry) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            userId, profileData.firstName || null, profileData.lastName || null,
            profileData.phone || null, profileData.dob || null, profileData.gender || null,
            profileData.address || profileData.companyAddress || null, profileData.education || null,
            profileData.preferredJobs ? JSON.stringify(profileData.preferredJobs) : null,
            profileData.companyName || null, profileData.corporateEmail || null,
            profileData.companySize || null, profileData.industry || null
        ];

        await db.execute(query, values);
        await db.execute('UPDATE users SET is_onboarded = 1, role = ? WHERE user_id = ?', [role, userId]);

        res.json({ success: true, message: "Onboarding complete!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save profile." });
    }
});

// ==========================================
// OTP (SKYSMS) ROUTES
// ==========================================

app.post('/api/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('0')) formattedPhone = '+63' + formattedPhone.slice(1);

    try {
        const response = await fetch('https://skysms.skyio.site/api/v1/otp/send', {
            method: 'POST',
            headers: { 'X-API-Key': process.env.SKYSMS_API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone_number: formattedPhone, message: "Your CareerFlow verification code is {{otp}}. Valid for 5 minutes.", expire: 300 })
        });
        if (response.ok) res.json({ success: true });
        else res.status(400).json({ error: "Failed to send SMS." });
    } catch (err) {
        res.status(500).json({ error: "Server connection failed." });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const { code, phoneNumber } = req.body;
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('0')) formattedPhone = '+63' + formattedPhone.slice(1);

    try {
        const verifyUrl = new URL('https://skysms.skyio.site/api/v1/otp/verify');
        verifyUrl.searchParams.append('code', String(code).trim());
        verifyUrl.searchParams.append('phone_number', formattedPhone);

        const response = await fetch(verifyUrl.toString(), {
            method: 'GET',
            headers: { 'X-API-Key': process.env.SKYSMS_API_KEY, 'Accept': 'application/json' }
        });
        
        const rawText = await response.text();
        let data;
        try { data = JSON.parse(rawText); } 
        catch (e) { return res.status(500).json({ error: "SMS Provider returned HTML." }); }

        if (response.ok && !data.error && !data.errors && data.status !== 'error') {
            res.json({ success: true, message: "OTP Verified" });
        } else {
            res.status(400).json({ error: data.message || "Invalid or expired OTP code." });
        }
    } catch (err) {
        res.status(500).json({ error: "Server connection failed." });
    }
});

// ==========================================
// JOB LISTINGS ROUTES
// ==========================================

// --- GET ALL ACTIVE JOBS (Production Optimized) ---
app.get('/api/jobs', async (req, res) => {
    try {
        const query = `
            SELECT j.*, COALESCE(p.company_name, j.company_name, 'Unknown Company') as company_name 
            FROM jobs j 
            LEFT JOIN profiles p ON j.hr_id = p.user_id 
            WHERE j.status = 'active' 
            ORDER BY j.posted_at DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch job listings." });
    }
});

// --- GET SINGLE JOB ---
app.get('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT j.*, COALESCE(p.company_name, j.company_name, 'Unknown Company') as company_name 
            FROM jobs j 
            LEFT JOIN profiles p ON j.hr_id = p.user_id 
            WHERE j.job_id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Job not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/jobs/create', upload.single('jobImage'), async (req, res) => {
    const hrId = req.body.hrId;
    const companyName = req.body.companyName;
    const jobData = JSON.parse(req.body.jobData); 
    
    // Dynamic URL generation for Render compatibility
    const serverUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const imageUrl = req.file ? `${serverUrl}/uploads/${req.file.filename}` : null;

    try {
        const query = `INSERT INTO jobs (hr_id, title, image_url, vacancies, location, employment_type, salary_min, salary_max, pay_period, education_level, required_skills, description, company_name, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`;
        const values = [hrId, jobData.title, imageUrl, jobData.vacancies, jobData.location, jobData.employmentType, jobData.salaryMin || 0, jobData.salaryMax || 0, jobData.payPeriod, jobData.education, JSON.stringify(jobData.requirements), jobData.description, companyName];
        await db.execute(query, values);
        res.json({ success: true, message: "Job published!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save job to database." });
    }
});

app.get('/api/hr/jobs/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `SELECT j.*, (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.job_id) as applicant_count FROM jobs j WHERE j.hr_id = ? ORDER BY j.posted_at DESC`;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/jobs/update/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const { title, location, vacancies, status, salary_min, salary_max } = req.body;
    try {
        await db.execute('UPDATE jobs SET title=?, location=?, vacancies=?, status=?, salary_min=?, salary_max=? WHERE job_id=?', [title, location, vacancies, status ? status.toLowerCase() : 'active', salary_min, salary_max, jobId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/jobs/delete/:jobId', async (req, res) => {
    const { jobId } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute('DELETE FROM saved_jobs WHERE job_id = ?', [jobId]);
        await connection.execute('DELETE FROM interviews WHERE app_id IN (SELECT app_id FROM applications WHERE job_id = ?)', [jobId]);
        await connection.execute('DELETE FROM applications WHERE job_id = ?', [jobId]);
        await connection.execute('DELETE FROM jobs WHERE job_id = ?', [jobId]);
        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// ==========================================
// APPLICATION & INTERVIEW ROUTES
// ==========================================

app.post('/api/applications/apply', async (req, res) => {
    const { job_id, user_id, match_score } = req.body;
    try {
        await db.execute(`INSERT INTO applications (job_id, user_id, status, match_score) VALUES (?, ?, 'pending', ?)`, [job_id, user_id, match_score]);
        res.json({ success: true });
    } catch (err) {
        if (err.errno === 1062) return res.status(400).json({ error: "Already applied" });
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/hr/applications/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT a.app_id, a.status, a.match_score, a.applied_at, p.first_name, p.last_name, p.education_level, j.title as job_title
            FROM applications a JOIN profiles p ON a.user_id = p.user_id JOIN jobs j ON a.job_id = j.job_id
            WHERE j.hr_id = ? ORDER BY a.applied_at DESC
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hr/application-review/:appId', async (req, res) => {
    const { appId } = req.params;
    try {
        const query = `
            SELECT a.app_id, a.status, a.match_score, a.applied_at, p.first_name, p.last_name, p.phone, p.location, p.education_level, p.gender, p.skills, p.description, u.email, j.job_id, j.title as job_title
            FROM applications a JOIN profiles p ON a.user_id = p.user_id JOIN users u ON a.user_id = u.user_id JOIN jobs j ON a.job_id = j.job_id
            WHERE a.app_id = ?
        `;
        const [rows] = await db.execute(query, [appId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Application not found" });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
});

app.put('/api/applications/status/:appId', async (req, res) => {
    const { appId } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });
    try {
        await db.execute('UPDATE applications SET status = ? WHERE app_id = ?', [status.toLowerCase(), appId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hr/interviews/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT i.interview_id, i.interview_date, i.location, i.status, p.first_name, p.last_name, j.title as job_title, a.app_id
            FROM interviews i JOIN applications a ON i.app_id = a.app_id JOIN jobs j ON a.job_id = j.job_id JOIN profiles p ON a.user_id = p.user_id
            WHERE j.hr_id = ? ORDER BY i.interview_date ASC
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/interviews/schedule', async (req, res) => {
    const { app_id, interview_date, location } = req.body;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [appData] = await connection.execute('SELECT j.hr_id FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.app_id = ?', [app_id]);
        const hrId = appData[0]?.hr_id;

        const checkQuery = `SELECT i.interview_date FROM interviews i JOIN applications a ON i.app_id = a.app_id JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND i.status != 'Cancelled' AND ABS(TIMESTAMPDIFF(MINUTE, i.interview_date, ?)) < 60`;
        const [conflicts] = await connection.execute(checkQuery, [hrId, interview_date]);

        if (conflicts.length > 0) {
            await connection.rollback();
            return res.status(409).json({ success: false, message: `Schedule Conflict` });
        }

        await connection.execute("INSERT INTO interviews (app_id, interview_date, location, status) VALUES (?, ?, ?, 'Scheduled')", [app_id, interview_date, location || 'Online']);
        await connection.execute("UPDATE applications SET status = 'interview scheduled' WHERE app_id = ?", [app_id]);
        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally { connection.release(); }
});

app.put('/api/interviews/complete/:interviewId', async (req, res) => {
    try {
        await db.execute("UPDATE interviews SET status = 'Completed' WHERE interview_id = ?", [req.params.interviewId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/interviews/cancel/:interviewId', async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [row] = await connection.execute("SELECT app_id FROM interviews WHERE interview_id = ?", [req.params.interviewId]);
        await connection.execute("UPDATE interviews SET status = 'Cancelled' WHERE interview_id = ?", [req.params.interviewId]);
        await connection.execute("UPDATE applications SET status = 'under review' WHERE app_id = ?", [row[0].app_id]);
        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally { connection.release(); }
});

app.get('/api/jobseeker/applications/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT a.app_id as id, a.status, a.applied_at, a.match_score, j.title as jobTitle, j.location, p.company_name as company
            FROM applications a JOIN jobs j ON a.job_id = j.job_id JOIN profiles p ON j.hr_id = p.user_id
            WHERE a.user_id = ? ORDER BY a.applied_at DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/jobseeker/application/:appId', async (req, res) => {
    const { appId } = req.params;
    try {
        const query = `
            SELECT a.app_id, a.status, a.applied_at, a.interview_date, a.match_score, j.title as job_title, j.location as job_location, j.description as job_desc, p.company_name, p.location as company_location
            FROM applications a JOIN jobs j ON a.job_id = j.job_id JOIN profiles p ON j.hr_id = p.user_id
            WHERE a.app_id = ?
        `;
        const [rows] = await db.execute(query, [appId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Application record not found" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});


// ==========================================
// SAVED JOBS ROUTES
// ==========================================

app.get('/api/saved-jobs/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT s.save_id, s.saved_at, j.*, p.company_name
            FROM saved_jobs s JOIN jobs j ON s.job_id = j.job_id JOIN profiles p ON j.hr_id = p.user_id
            WHERE s.user_id = ? ORDER BY s.saved_at DESC
        `;
        const [rows] = await db.execute(query, [userId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/saved-jobs', async (req, res) => {
    const { user_id, job_id } = req.body;
    try {
        const [existing] = await db.execute('SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?', [user_id, job_id]);
        if (existing.length > 0) return res.json({ success: true, message: "Already saved" });
        await db.execute('INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)', [user_id, job_id]);
        res.json({ success: true, message: "Job saved!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/saved-jobs/:userId/:jobId', async (req, res) => {
    const { userId, jobId } = req.params;
    try {
        await db.execute('DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', [userId, jobId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// MESSAGING ROUTES (Unified Fixes Included)
// ==========================================

app.get('/api/messages/inbox/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = `
            SELECT 
                u.user_id as id, 
                u.username as name, 
                u.role, 
                p.company_name, 
                p.first_name, 
                p.last_name,
                COALESCE(
                    (SELECT message_text FROM messages WHERE (sender_id = u.user_id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.user_id) ORDER BY created_at DESC LIMIT 1),
                    'Application Submitted'
                ) as lastMessage,
                COALESCE(
                    (SELECT created_at FROM messages WHERE (sender_id = u.user_id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.user_id) ORDER BY created_at DESC LIMIT 1),
                    (SELECT MAX(a.applied_at) FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.user_id = ? AND j.hr_id = u.user_id)
                ) as time
            FROM users u
            JOIN profiles p ON u.user_id = p.user_id
            WHERE u.user_id IN (
                SELECT sender_id FROM messages WHERE receiver_id = ?
                UNION
                SELECT receiver_id FROM messages WHERE sender_id = ?
                UNION
                SELECT j.hr_id FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.user_id = ?
                UNION
                SELECT a.user_id FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ?
            )
            AND u.user_id != ?
            ORDER BY time DESC
        `;
        // Pass the userId 10 times to fulfill all the ? parameters in this robust query
        const [rows] = await db.execute(query, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId]);
        res.json(rows);
    } catch (err) {
        console.error("Inbox Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages/history/:userId/:otherId', async (req, res) => {
    const { userId, otherId } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC', [userId, otherId, otherId, userId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/messages/send', async (req, res) => {
    const { sender_id, receiver_id, message_text, message_type } = req.body;
    try {
        const [result] = await db.execute('INSERT INTO messages (sender_id, receiver_id, message_text, message_type) VALUES (?, ?, ?, ?)', [sender_id, receiver_id, message_text, message_type || 'text']);
        res.json({ success: true, message_id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// USER & HR PROFILE DASHBOARD ROUTES
// ==========================================

app.get('/api/hr/profile/:userId', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT p.*, u.email FROM profiles p JOIN users u ON p.user_id = u.user_id WHERE p.user_id = ?', [req.params.userId]);
        res.json(rows[0] || {});
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/hr/profile/update/:hrId', upload.single('logo'), async (req, res) => {
    const { hrId } = req.params;
    const { company_name, location, description, phone, industry, company_size, website } = req.body;
    
    // Dynamic URL generation
    const serverUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const newLogoUrl = req.file ? `${serverUrl}/uploads/${req.file.filename}` : null;
    
    try {
        if (newLogoUrl) await db.execute(`UPDATE profiles SET company_name = ?, location = ?, description = ?, phone = ?, industry = ?, company_size = ?, website = ?, logo_url = ? WHERE user_id = ?`, [company_name, location, description, phone, industry, company_size, website, newLogoUrl, hrId]);
        else await db.execute(`UPDATE profiles SET company_name = ?, location = ?, description = ?, phone = ?, industry = ?, company_size = ?, website = ? WHERE user_id = ?`, [company_name, location, description, phone, industry, company_size, website, hrId]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/hr/profile/personal/:hrId', async (req, res) => {
    const { hrId } = req.params;
    const { first_name, last_name, email, phone, job_title } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute('UPDATE users SET email = ? WHERE user_id = ?', [email, hrId]);
        await connection.execute('UPDATE profiles SET first_name = ?, last_name = ?, phone = ?, job_title = ? WHERE user_id = ?', [first_name, last_name, phone, job_title, hrId]);
        await connection.commit();
        res.json({ success: true });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: "Failed to update settings" });
    } finally {
        connection.release();
    }
});

app.post('/api/jobseeker/upload-photo/:userId', upload.single('photo'), async (req, res) => {
    const { userId } = req.params;
    const serverUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const newPhotoUrl = req.file ? `${serverUrl}/uploads/${req.file.filename}` : null;

    if (!newPhotoUrl) return res.status(400).json({ error: "No image provided" });
    try {
        await db.execute('UPDATE profiles SET processed_image = ? WHERE user_id = ?', [newPhotoUrl, userId]);
        res.json({ success: true, imageUrl: newPhotoUrl });
    } catch (err) { res.status(500).json({ error: "Database error" }); }
});

app.post('/api/jobseeker/profile/save', async (req, res) => {
    const { user_id, skills, description } = req.body;
    try {
        await db.execute('UPDATE profiles SET skills = ?, description = ? WHERE user_id = ?', [skills, description, user_id]);
        await db.execute('UPDATE users SET is_onboarded = 1 WHERE user_id = ?', [user_id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/jobseeker/dashboard/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const [[{ activeCount }]] = await db.execute("SELECT COUNT(*) as activeCount FROM applications WHERE user_id = ?", [userId]);
        const [[{ interviewCount }]] = await db.execute("SELECT COUNT(*) as interviewCount FROM applications WHERE user_id = ? AND status LIKE '%Interview%'", [userId]);
        const [[{ savedCount }]] = await db.execute("SELECT COUNT(*) as savedCount FROM saved_jobs WHERE user_id = ?", [userId]);
        let unreadMessages = 0;
        try { const [[unread]] = await db.execute("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0", [userId]); unreadMessages = unread.count; } catch(e){}
        const [recentApps] = await db.execute(`SELECT a.app_id as id, j.title as jobTitle, j.company_name as company, a.status, a.applied_at FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.user_id = ? ORDER BY a.applied_at DESC LIMIT 5`, [userId]);
        const [recommendedJobs] = await db.execute("SELECT * FROM jobs WHERE status = 'active' ORDER BY posted_at DESC LIMIT 4");
        res.json({ stats: { activeCount, interviewCount, unreadMessages, savedCount }, recentApps, recentMessages: [], recommendedJobs });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hr/dashboard-stats/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const [candidates] = await db.execute("SELECT COUNT(*) as count FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND a.status NOT IN ('rejected', 'hired')", [hrId]);
        const [interviews] = await db.execute("SELECT COUNT(*) as count FROM interviews i JOIN applications a ON i.app_id = a.app_id JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND i.interview_date > NOW() AND i.status = 'Scheduled'", [hrId]);
        const [hired] = await db.execute("SELECT COUNT(*) as count FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND a.status = 'hired'", [hrId]);
        res.json({ totalCandidates: candidates[0].count, upcomingInterviews: interviews[0].count, hiredTotal: hired[0].count });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/hr/rejected-candidates/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `SELECT a.app_id, p.first_name, p.last_name, j.title as job_title, a.status FROM applications a JOIN profiles p ON a.user_id = p.user_id JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND a.status = 'rejected' ORDER BY a.app_id DESC LIMIT 5`;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// PUBLIC ROUTES
// ==========================================

app.get('/api/public/company/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const [rows] = await db.execute('SELECT company_name, industry, location, description, website FROM profiles WHERE user_id = ?', [hrId]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Company not found" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/public/company/:hrId/jobs', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM jobs WHERE hr_id = ? AND status = 'active' ORDER BY posted_at DESC", [req.params.hrId]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// PYTHON SCRIPTS (Face Processing)
// ==========================================

app.post('/api/process-face', async (req, res) => {
    const { image, userId } = req.body;
    if (!image || !userId) return res.status(400).json({ error: "Missing image or user ID" });

    const pythonProcess = spawn('python', ['remove_bg.py', userId]);
    let imageUrl = '';

    pythonProcess.stdin.write(image);
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => { imageUrl += data.toString().trim(); });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) return res.status(500).json({ error: "Failed to process image" });
        try {
            const cleanUrl = imageUrl.split('\n')[0].trim();
            await db.execute('UPDATE profiles SET processed_image = ? WHERE user_id = ?', [cleanUrl, userId]);
            res.json({ success: true, imageUrl: cleanUrl });
        } catch (dbErr) { res.status(500).json({ error: "Image processed, but failed to save to database." }); }
    });
});

// ==========================================
// SECURE AI ROUTE (Calls gemini.js service)
// ==========================================

const { extractResumeInfo } = require('./gemini');
app.post('/api/ai/extract-resume', async (req, res) => {
    try { res.json(await extractResumeInfo(req.body.transcript, req.body.step)); } 
    catch (err) { res.status(500).json({ error: "AI Failed" }); }
});

// ==========================================
// SUPER ADMIN ROUTES
// ==========================================

app.get('/api/admin/users', async (req, res) => {
    try {
        const query = `SELECT u.user_id as id, u.username as name, u.email, u.role, u.status, p.company_name as company FROM users u LEFT JOIN profiles p ON u.user_id = p.user_id ORDER BY u.user_id DESC`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    try {
        await db.execute('UPDATE users SET username = ?, email = ?, role = ?, status = ? WHERE user_id = ?', [name, email, role, status, id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute('DELETE FROM profiles WHERE user_id = ?', [id]);
        await connection.execute('DELETE FROM applications WHERE user_id = ?', [id]);
        await connection.execute('DELETE FROM saved_jobs WHERE user_id = ?', [id]);
        await connection.execute('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [id, id]);
        await connection.execute('DELETE FROM jobs WHERE hr_id = ?', [id]); 
        await connection.execute('DELETE FROM users WHERE user_id = ?', [id]); 
        await connection.commit();
        res.json({ success: true, message: "User permanently erased." });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally { connection.release(); }
});

app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
        const [seekers] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role IN ('job_seeker', 'seeker')");
        const [employers] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'hr' AND status = 'Active'");
        const [pending] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'hr' AND status = 'Pending'");
        const [profiles] = await db.execute("SELECT COUNT(*) as count FROM profiles WHERE description IS NOT NULL AND description != ''");
        const [queue] = await db.execute(`SELECT u.user_id as id, p.company_name as company, 'Business Registration' as doc, u.status FROM users u JOIN profiles p ON u.user_id = p.user_id WHERE u.role = 'hr' AND u.status = 'Pending' ORDER BY u.user_id DESC LIMIT 4`);
        res.json({ stats: { seekers: seekers[0].count, employers: employers[0].count, pending: pending[0].count, voiceProfiles: profiles[0].count }, verificationQueue: queue });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/verifications', async (req, res) => {
    try {
        const query = `SELECT u.user_id as id, u.status, p.company_name as company, p.location as address, p.first_name, p.last_name FROM users u JOIN profiles p ON u.user_id = p.user_id WHERE u.role = 'hr' ORDER BY u.user_id DESC`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/users/:id/status', async (req, res) => {
    try {
        await db.execute('UPDATE users SET status = ? WHERE user_id = ?', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/jobs', async (req, res) => {
    try {
        const query = `SELECT j.*, p.company_name as profile_company FROM jobs j LEFT JOIN profiles p ON j.hr_id = p.user_id ORDER BY j.posted_at DESC`;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.put('/api/admin/jobs/:id/status', async (req, res) => {
    try {
        await db.execute('UPDATE jobs SET status = ? WHERE job_id = ?', [req.body.status, req.params.id]);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = app;