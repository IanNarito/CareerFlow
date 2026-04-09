const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcryptjs');
const { spawn } = require('child_process');
const multer = require('multer'); // <--- ADD THIS
const path = require('path');     // <--- ADD THIS
require('dotenv').config();

const app = express();

// --- MULTER IMAGE UPLOAD SETUP ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Saves to your existing uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, 'job_' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

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
// --- 5. LIVE OTP FEATURES (SkySMS API) ---
app.post('/api/send-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    // Auto-format "09123456789" to "+639123456789"
    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.slice(1);
    }

    try {
        const response = await fetch('https://skysms.skyio.site/api/v1/otp/send', {
            method: 'POST',
            headers: {
                'X-API-Key': process.env.SKYSMS_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone_number: formattedPhone,
                message: "Your CareerFlow verification code is {{otp}}. Valid for 5 minutes.",
                expire: 300
            })
        });

        if (response.ok) {
            console.log(`>>> OTP sent successfully to ${formattedPhone} <<<`);
            res.json({ success: true });
        } else {
            const errData = await response.json();
            console.error("SkySMS Send Error:", errData);
            res.status(400).json({ error: "Failed to send SMS." });
        }
    } catch (err) {
        console.error("API Connection Error:", err);
        res.status(500).json({ error: "Server connection failed." });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    const { code, phoneNumber } = req.body;

    let formattedPhone = phoneNumber.trim();
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '+63' + formattedPhone.slice(1);
    }

    try {
        const cleanCode = String(code).trim();
        
        const verifyUrl = new URL('https://skysms.skyio.site/api/v1/otp/verify');
        // THE FIX: We renamed these to match exactly what the SkySMS server is asking for!
        verifyUrl.searchParams.append('code', cleanCode);
        verifyUrl.searchParams.append('phone_number', formattedPhone);

        const response = await fetch(verifyUrl.toString(), {
            method: 'GET',
            headers: {
                'X-API-Key': process.env.SKYSMS_API_KEY,
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' 
            }
        });

        const rawText = await response.text();
        
        let data;
        try {
            data = JSON.parse(rawText);
        } catch (parseError) {
            console.error(">>> SKY SMS RETURNED HTML: <<<", rawText);
            return res.status(500).json({ error: "SMS Provider returned HTML." });
        }

        console.log(">>> SkySMS Verify Response:", data, "<<<");

        // Check if there are ANY errors returned by their server
        if (response.ok && !data.error && !data.errors && data.status !== 'error') {
            res.json({ success: true, message: "OTP Verified" });
        } else {
            // Send the specific error message back to the frontend if the code is wrong
            res.status(400).json({ error: data.message || "Invalid or expired OTP code." });
        }
    } catch (err) {
        console.error("API Connection Error:", err);
        res.status(500).json({ error: "Server connection failed." });
    }
});

// --- NEW ROUTE: SAVE JOB TO DATABASE ---
// --- NEW ROUTE: SAVE JOB TO DATABASE (WITH IMAGE) ---
app.post('/api/jobs/create', upload.single('jobImage'), async (req, res) => {
    // Because we sent FormData, req.body variables might be strings.
    const hrId = req.body.hrId;
    const companyName = req.body.companyName;
    const jobData = JSON.parse(req.body.jobData); // Parse the JSON string back into an object

    // If an image was uploaded, create the URL. Otherwise, leave it null.
    const imageUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    try {
        const query = `
            INSERT INTO jobs 
            (hr_id, title, image_url, vacancies, location, employment_type, salary_min, salary_max, pay_period, education_level, required_skills, description, company_name, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `;

        const values = [
            hrId,
            jobData.title,
            imageUrl, // <--- New Image URL
            jobData.vacancies,
            jobData.location,
            jobData.employmentType,
            jobData.salaryMin || 0,
            jobData.salaryMax || 0,
            jobData.payPeriod,
            jobData.education,
            JSON.stringify(jobData.requirements),
            jobData.description,
            companyName
        ];

        await db.execute(query, values);

        console.log(`>>> Success: Job "${jobData.title}" posted with image! <<<`);
        res.json({ success: true, message: "Job published!" });

    } catch (err) {
        console.error("Job Post Error:", err);
        res.status(500).json({ error: "Failed to save job to database." });
    }
});

// --- NEW ROUTE: FETCH JOBS FOR SPECIFIC HR ---
// --- 1. FETCH JOBS FOR HR (UPDATED WITH APPLICANT COUNT) ---
app.get('/api/hr/jobs/:hrId', async (req, res) => {
    const { hrId } = req.params;
    
    if (!hrId || isNaN(hrId)) {
        return res.status(400).json({ error: "Invalid HR ID" });
    }

    try {
        // This query counts applications for each job automatically
        const query = `
            SELECT 
                j.*, 
                (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.job_id) as applicant_count
            FROM jobs j 
            WHERE j.hr_id = ? 
            ORDER BY j.posted_at DESC
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
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
    
    // We use a database connection to perform a "Transaction"
    // This ensures that if one step fails, it cancels everything safely.
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // 1. Delete all "Saved Jobs" references first
        await connection.execute('DELETE FROM saved_jobs WHERE job_id = ?', [jobId]);
        
        // 2. Delete any "Interviews" linked to applications for this job
        await connection.execute(
            'DELETE FROM interviews WHERE app_id IN (SELECT app_id FROM applications WHERE job_id = ?)', 
            [jobId]
        );
        
        // 3. Delete the actual applications attached to this job
        await connection.execute('DELETE FROM applications WHERE job_id = ?', [jobId]);
        
        // 4. Finally, it is now safe to delete the job posting itself!
        await connection.execute('DELETE FROM jobs WHERE job_id = ?', [jobId]);
        
        await connection.commit();
        res.json({ success: true, message: "Job and all related data deleted successfully." });
        
    } catch (err) {
        await connection.rollback(); // Undo everything if there is an error
        console.error("Delete Job Error:", err.message);
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// --- FETCH CANDIDATE & APPLICATION DETAILS ---
app.get('/api/hr/application-review/:appId', async (req, res) => {
    const { appId } = req.params;
    try {
        const query = `
            SELECT 
                a.app_id, a.status, a.match_score, a.applied_at,
                p.first_name, p.last_name, p.phone, p.location, 
                p.education_level, p.gender, p.skills, p.description,
                u.email,
                j.job_id, j.title as job_title
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

    // Safety check: Don't proceed if status is missing
    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    try {
        const query = 'UPDATE applications SET status = ? WHERE app_id = ?';
        const [result] = await db.execute(query, [status.toLowerCase(), appId]);

        // Check if a row was actually updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Application not found" });
        }

        console.log(`Status Updated: Application ${appId} is now ${status}`);
        
        res.json({ 
            success: true, 
            message: `Status successfully updated to ${status}` 
        });
    } catch (err) {
        console.error("Database Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- FETCH INTERVIEWS FOR HR ---
app.get('/api/hr/interviews/:hrId', async (req, res) => {
    const { hrId } = req.params;
    console.log("Fetching interviews for HR ID:", hrId); // Check your terminal for this!

    try {
        const query = `
            SELECT 
                i.interview_id, 
                i.interview_date, 
                i.location, 
                i.status,
                p.first_name, 
                p.last_name, 
                j.title as job_title,
                a.app_id
            FROM interviews i
            JOIN applications a ON i.app_id = a.app_id
            JOIN jobs j ON a.job_id = j.job_id
            JOIN profiles p ON a.user_id = p.user_id
            WHERE j.hr_id = ?
            ORDER BY i.interview_date ASC
        `;
        
        const [rows] = await db.execute(query, [hrId]);
        console.log(`Found ${rows.length} interviews for this HR.`);
        res.json(rows);
    } catch (err) {
        console.error("SQL Error in Interviews:", err);
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

// ==========================================
// HR COMPANY PROFILE UPDATE (WITH LOGO)
// ==========================================
app.put('/api/hr/profile/update/:hrId', upload.single('logo'), async (req, res) => {
    const { hrId } = req.params;
    
    // Because we added upload.single('logo') above, req.body will now work perfectly!
    const { company_name, location, description, phone, industry, company_size, website } = req.body;
    
    // Check if a new file was uploaded via multer
    const newLogoUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    try {
        if (newLogoUrl) {
            // Update everything INCLUDING the new logo
            await db.execute(
                `UPDATE profiles SET 
                company_name = ?, location = ?, description = ?, phone = ?, 
                industry = ?, company_size = ?, website = ?, logo_url = ? 
                WHERE user_id = ?`,
                [company_name, location, description, phone, industry, company_size, website, newLogoUrl, hrId]
            );
            res.json({ success: true, message: "Profile & Logo updated", logo_url: newLogoUrl });
        } else {
            // Update text fields only, keep existing logo safe
            await db.execute(
                `UPDATE profiles SET 
                company_name = ?, location = ?, description = ?, phone = ?, 
                industry = ?, company_size = ?, website = ? 
                WHERE user_id = ?`,
                [company_name, location, description, phone, industry, company_size, website, hrId]
            );
            res.json({ success: true, message: "Profile text updated" });
        }
    } catch (err) {
        console.error("Profile Update Error:", err);
        res.status(500).json({ error: "Database error during update." });
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

// --- SAVE A JOB ---
app.post('/api/saved-jobs', async (req, res) => {
    const { user_id, job_id } = req.body;
    try {
        // Prevent saving duplicates
        const [existing] = await db.execute('SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?', [user_id, job_id]);
        if (existing.length > 0) return res.json({ success: true, message: "Already saved" });
        
        await db.execute('INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)', [user_id, job_id]);
        res.json({ success: true, message: "Job saved!" });
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

// --- NEW: JOB SEEKER PROFILE PICTURE UPLOAD ---
app.post('/api/jobseeker/upload-photo/:userId', upload.single('photo'), async (req, res) => {
    const { userId } = req.params;
    
    // Create the URL for the uploaded file
    const newPhotoUrl = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    if (!newPhotoUrl) return res.status(400).json({ error: "No image provided" });

    try {
        // Save it to 'processed_image' so the HR CandidateReview.jsx can see it!
        await db.execute(
            'UPDATE profiles SET processed_image = ? WHERE user_id = ?',
            [newPhotoUrl, userId]
        );
        res.json({ success: true, imageUrl: newPhotoUrl });
    } catch (err) {
        console.error("Upload Photo Error:", err);
        res.status(500).json({ error: "Database error" });
    }
});

// ==========================================
// JOB SEEKER DASHBOARD DATA
// ==========================================
app.get('/api/jobseeker/dashboard/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Get Top Stats
        const [[{ activeCount }]] = await db.execute("SELECT COUNT(*) as activeCount FROM applications WHERE user_id = ?", [userId]);
        const [[{ interviewCount }]] = await db.execute("SELECT COUNT(*) as interviewCount FROM applications WHERE user_id = ? AND status LIKE '%Interview%'", [userId]);
        const [[{ savedCount }]] = await db.execute("SELECT COUNT(*) as savedCount FROM saved_jobs WHERE user_id = ?", [userId]);
        
        let unreadMessages = 0;
        try {
            const [[unread]] = await db.execute("SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0", [userId]);
            unreadMessages = unread.count;
        } catch (e) { /* Ignore if message table structure varies */ }

        // 2. Get Recent Applications
        const [recentApps] = await db.execute(`
            SELECT a.app_id as id, j.title as jobTitle, j.company_name as company, a.status, a.applied_at 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.job_id 
            WHERE a.user_id = ? 
            ORDER BY a.applied_at DESC LIMIT 5
        `, [userId]);

        // 3. Get Recommended Jobs
        const [recommendedJobs] = await db.execute("SELECT * FROM jobs WHERE status = 'active' ORDER BY posted_at DESC LIMIT 4");

        // 4. Send all data back to the frontend
        res.json({
            stats: { activeCount, interviewCount, unreadMessages, savedCount },
            recentApps,
            recentMessages: [], // Send empty array to prevent frontend map errors
            recommendedJobs
        });

    } catch (err) {
        console.error("Dashboard Route Error:", err);
        res.status(500).json({ error: "Failed to load dashboard data." });
    }
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


// ==========================================
// SECURE AI ROUTE (Calls gemini.js service)
// ==========================================
const { extractResumeInfo } = require('./gemini');

app.post('/api/ai/extract-resume', async (req, res) => {
    const { transcript, step } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
    }

    try {
        // Send the audio text to our secure Gemini service
        const structuredData = await extractResumeInfo(transcript, step);
        res.json(structuredData);
    } catch (err) {
        console.error("Gemini Route Error:", err);
        res.status(500).json({ error: "Failed to process transcript with AI." });
    }
});


// --- 1. GET SINGLE JOB DETAILS ---
app.get('/api/jobs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT j.*, p.company_name 
            FROM jobs j 
            JOIN profiles p ON j.hr_id = p.user_id 
            WHERE j.job_id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Job not found" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 2. SUBMIT APPLICATION ---
app.post('/api/applications/apply', async (req, res) => {
    const { job_id, user_id, match_score } = req.body;
    try {
        const query = `INSERT INTO applications (job_id, user_id, status, match_score) VALUES (?, ?, 'pending', ?)`;
        await db.execute(query, [job_id, user_id, match_score]);
        res.json({ success: true, message: "Application submitted!" });
    } catch (err) {
        // Handle duplicate application error (MySQL Error 1062)
        if (err.errno === 1062) return res.status(400).json({ error: "Already applied" });
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/jobs', async (req, res) => {
    try {
        const query = `
            SELECT j.*, p.company_name 
            FROM jobs j 
            JOIN profiles p ON j.hr_id = p.user_id 
            WHERE j.status = 'active' 
            ORDER BY j.posted_at DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- 1. GET ALL INTERVIEWS FOR HR ---
app.get('/api/hr/interviews/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT 
                i.interview_id, 
                i.interview_date, 
                i.location, 
                i.status,
                p.first_name, 
                p.last_name, 
                j.title as job_title,
                a.app_id
            FROM interviews i
            JOIN applications a ON i.app_id = a.app_id
            JOIN jobs j ON a.job_id = j.job_id
            JOIN profiles p ON a.user_id = p.user_id
            WHERE j.hr_id = ?
            ORDER BY i.interview_date ASC
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching interviews:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/interviews/schedule', async (req, res) => {
    const { app_id, interview_date, location } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Get the HR_ID for this application
        const [appData] = await connection.execute(
            'SELECT j.hr_id FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE a.app_id = ?',
            [app_id]
        );
        const hrId = appData[0]?.hr_id;

        // 2. 1-HOUR RADIUS COLLISION CHECK
        // This query looks for ANY interview belonging to this HR where the 
        // time difference is LESS than 60 minutes from the requested time.
        const checkQuery = `
            SELECT i.interview_id, i.interview_date 
            FROM interviews i
            JOIN applications a ON i.app_id = a.app_id
            JOIN jobs j ON a.job_id = j.job_id
            WHERE j.hr_id = ?
            AND i.status != 'Cancelled'
            AND ABS(TIMESTAMPDIFF(MINUTE, i.interview_date, ?)) < 60
        `;
        
        const [conflicts] = await connection.execute(checkQuery, [hrId, interview_date]);

        if (conflicts.length > 0) {
            await connection.rollback();
            // Fetch the conflicting time to show in the error message
            const conflictTime = new Date(conflicts[0].interview_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return res.status(409).json({ 
                success: false, 
                message: `Schedule Conflict: Each session lasts 1 hour. You already have an interview at ${conflictTime}.` 
            });
        }

        // 3. Insert Interview
        await connection.execute(
            "INSERT INTO interviews (app_id, interview_date, location, status) VALUES (?, ?, ?, 'Scheduled')",
            [app_id, interview_date, location || 'Online']
        );

        // 4. Update App Status
        await connection.execute(
            "UPDATE applications SET status = 'interview scheduled' WHERE app_id = ?",
            [app_id]
        );

        await connection.commit();
        res.json({ success: true, message: "Interview scheduled successfully!" });

    } catch (err) {
        await connection.rollback();
        console.error("Conflict Error:", err);
        res.status(500).json({ error: "Database error during scheduling." });
    } finally {
        connection.release();
    }
});

app.get('/api/hr/dashboard-stats/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        // 1. Count Active Candidates (Not rejected or hired)
        const [candidates] = await db.execute(
            "SELECT COUNT(*) as count FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND a.status NOT IN ('rejected', 'hired')",
            [hrId]
        );

        // 2. Count Upcoming Interviews (Future dates only)
        const [interviews] = await db.execute(
            "SELECT COUNT(*) as count FROM interviews i JOIN applications a ON i.app_id = a.app_id JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND i.interview_date > NOW() AND i.status = 'Scheduled'",
            [hrId]
        );

        // 3. Count Total Hired
        const [hired] = await db.execute(
            "SELECT COUNT(*) as count FROM applications a JOIN jobs j ON a.job_id = j.job_id WHERE j.hr_id = ? AND a.status = 'hired'",
            [hrId]
        );

        res.json({
            totalCandidates: candidates[0].count,
            upcomingInterviews: interviews[0].count,
            hiredTotal: hired[0].count
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/hr/rejected-candidates/:hrId', async (req, res) => {
    const { hrId } = req.params;
    try {
        const query = `
            SELECT a.app_id, p.first_name, p.last_name, j.title as job_title, a.status 
            FROM applications a
            JOIN profiles p ON a.user_id = p.user_id
            JOIN jobs j ON a.job_id = j.job_id
            WHERE j.hr_id = ? AND a.status = 'rejected'
            ORDER BY a.app_id DESC
            LIMIT 5
        `;
        const [rows] = await db.execute(query, [hrId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/interviews/complete/:interviewId', async (req, res) => {
    const { interviewId } = req.params;
    try {
        // Update the specific interview status
        const [result] = await db.execute(
            "UPDATE interviews SET status = 'Completed' WHERE interview_id = ?",
            [interviewId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Interview record not found." });
        }

        res.json({ success: true, message: "Interview marked as completed." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/interviews/cancel/:interviewId', async (req, res) => {
    const { interviewId } = req.params;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Get the app_id before updating
        const [row] = await connection.execute(
            "SELECT app_id FROM interviews WHERE interview_id = ?", 
            [interviewId]
        );
        
        if (row.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Interview not found" });
        }
        const appId = row[0].app_id;

        // 2. Update Interview Status to 'Cancelled'
        await connection.execute(
            "UPDATE interviews SET status = 'Cancelled' WHERE interview_id = ?",
            [interviewId]
        );

        // 3. Revert Application Status to 'under review' 
        // (So they aren't stuck in the 'Interviewing' column with no meeting)
        await connection.execute(
            "UPDATE applications SET status = 'under review' WHERE app_id = ?",
            [appId]
        );

        await connection.commit();
        res.json({ success: true, message: "Interview cancelled and candidate moved to review." });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

const handleToggleSave = () => {
  if (!user) {
    navigate('/login');
    return;
  }

  // 1. Get current saved jobs from local storage or start with empty array
  const savedKey = `saved_jobs_${user.id || user.user_id}`;
  const localSaved = JSON.parse(localStorage.getItem(savedKey) || '[]');

  if (isSaved) {
    // Remove: Filter out this job
    const updated = localSaved.filter(j => j.job_id.toString() !== id.toString());
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setIsSaved(false);
  } else {
    // Add: Push current job details into the array
    const newSave = {
      ...job,           // This spreads the title, company, etc.
      job_id: id,       // Ensure ID is set
      saved_at: new Date().toISOString()
    };
    const updated = [...localSaved, newSave];
    localStorage.setItem(savedKey, JSON.stringify(updated));
    setIsSaved(true);
  }
};

const handleSendMessage = async (e) => {
  e.preventDefault();

  const msgData = {
    sender_id: user.id,          // The Job Seeker
    receiver_id: job.employer_id, // THIS IS THE CONNECTION. It must be the HR's ID.
    message_text: messageInput,
    app_id: application.id       // Links it to the specific job application
  };

  // 1. Save to Database (Permanent)
  await fetch('http://localhost:5000/api/messages/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msgData)
  });

  // 2. Save to LocalStorage Bridge (Instant notification for demo)
  const bridgeMessages = JSON.parse(localStorage.getItem('careerflow_messages') || '[]');
  localStorage.setItem('careerflow_messages', JSON.stringify([...bridgeMessages, msgData]));
};

// --- 1. GET INBOX ---
// Gets a list of unique people the user (HR or Seeker) has chatted with
app.get('/api/messages/inbox/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT 
      u.id AS user_id, 
      u.username AS name, 
      u.first_name, 
      u.last_name,
      m.message_text AS lastMessage, 
      m.created_at AS time
    FROM messages m
    JOIN users u ON (u.id = m.sender_id OR u.id = m.receiver_id)
    WHERE (m.sender_id = ? OR m.receiver_id = ?) 
      AND u.id != ?
    GROUP BY u.id
    ORDER BY m.created_at DESC
  `;

  db.query(sql, [userId, userId, userId], (err, results) => {
    if (err) return res.status(500).json(err);
    console.log(`>>> DB found ${results.length} conversations for HR ID ${userId}`);
    res.json(results);
  });
});

// --- 2. GET HISTORY ---
// Gets all messages between two specific users
app.get('/api/messages/history/:userId/:otherId', (req, res) => {
    const { userId, otherId } = req.params;
    const sql = `
        SELECT * FROM messages 
        WHERE (sender_id = ? AND receiver_id = ?) 
           OR (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    `;

    db.query(sql, [userId, otherId, otherId, userId], (err, results) => {
        if (err) {
            console.error("SQL Error in History:", err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

//--- face recognition route ---
app.post('/api/process-face', async (req, res) => {
    const { image, userId } = req.body;

    if (!image || !userId) {
        return res.status(400).json({ error: "Missing image or user ID" });
    }

    // Spawn the Python process
    const pythonProcess = spawn('python', ['remove_bg.py', userId]);
    let imageUrl = '';

    // Send the base64 image data to the python script
    pythonProcess.stdin.write(image);
    pythonProcess.stdin.end();

    // Read the output (the URL) from Python
    pythonProcess.stdout.on('data', (data) => {
        imageUrl += data.toString().trim();
    });

    // When the Python script finishes creating the white background image...
    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Failed to process image" });
        }
        
        try {
            // Clean up the URL just in case there are hidden spaces
            const cleanUrl = imageUrl.split('\n')[0].trim();
            
            // SAVE THE NEW 2x2 PICTURE URL TO THE DATABASE!
            await db.execute(
                'UPDATE profiles SET processed_image = ? WHERE user_id = ?',
                [cleanUrl, userId]
            );
            
            console.log(`>>> Success: 2x2 Picture saved for User ${userId} <<<`);
            res.json({ success: true, imageUrl: cleanUrl });
            
        } catch (dbErr) {
            console.error("Database Error:", dbErr);
            res.status(500).json({ error: "Image processed, but failed to save to database." });
        }
    });
});

// --- 3. SEND MESSAGE ---
app.post('/api/messages/send', (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;
    
    if (!sender_id || !receiver_id || !message_text) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = "INSERT INTO messages (sender_id, receiver_id, message_text, created_at) VALUES (?, ?, ?, NOW())";

    db.query(sql, [sender_id, receiver_id, message_text], (err, result) => {
        if (err) {
            console.error("SQL Error in Send:", err);
            return res.status(500).json(err);
        }
        res.json({ success: true, message_id: result.insertId });
    });
});
// Important: Export the app so index.js can see it
// ==========================================
// 7. SUPER ADMIN ROUTES
// ==========================================

// --- GET ALL USERS ---
app.get('/api/admin/users', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id as id, 
                u.username as name, 
                u.email, 
                u.role, 
                u.status,
                p.company_name as company
            FROM users u
            LEFT JOIN profiles p ON u.user_id = p.user_id
            ORDER BY u.user_id DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        console.error("Admin Fetch Users Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE USER DETAILS ---
app.put('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    try {
        await db.execute(
            'UPDATE users SET username = ?, email = ?, role = ?, status = ? WHERE user_id = ?',
            [name, email, role, status, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- FORCE DELETE USER & ALL THEIR DATA ---
app.delete('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Erase their entire digital footprint from the platform
        await connection.execute('DELETE FROM profiles WHERE user_id = ?', [id]);
        await connection.execute('DELETE FROM applications WHERE user_id = ?', [id]);
        await connection.execute('DELETE FROM saved_jobs WHERE user_id = ?', [id]);
        await connection.execute('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [id, id]);
        await connection.execute('DELETE FROM jobs WHERE hr_id = ?', [id]); // Deletes jobs if they were an HR
        await connection.execute('DELETE FROM users WHERE user_id = ?', [id]); // Finally, delete the user
        
        await connection.commit();
        res.json({ success: true, message: "User permanently erased." });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        connection.release();
    }
});

// --- GET ADMIN DASHBOARD STATS ---
app.get('/api/admin/dashboard-stats', async (req, res) => {
    try {
        // 1. Count Job Seekers
        const [seekers] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role IN ('job_seeker', 'seeker')");
        
        // 2. Count Verified Employers
        const [employers] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'hr' AND status = 'Active'");
        
        // 3. Count Pending HR Verifications
        const [pending] = await db.execute("SELECT COUNT(*) as count FROM users WHERE role = 'hr' AND status = 'Pending'");
        
        // 4. Count Completed Voice Profiles
        const [profiles] = await db.execute("SELECT COUNT(*) as count FROM profiles WHERE description IS NOT NULL AND description != ''");

        // 5. Get the 4 most recent pending employer requests for the queue
        const [queue] = await db.execute(`
            SELECT u.user_id as id, p.company_name as company, 'Business Registration' as doc, u.status 
            FROM users u 
            JOIN profiles p ON u.user_id = p.user_id 
            WHERE u.role = 'hr' AND u.status = 'Pending' 
            ORDER BY u.user_id DESC LIMIT 4
        `);

        res.json({
            stats: {
                seekers: seekers[0].count,
                employers: employers[0].count,
                pending: pending[0].count,
                voiceProfiles: profiles[0].count
            },
            verificationQueue: queue
        });
    } catch (err) {
        console.error("Admin Dashboard Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- GET ALL HR VERIFICATIONS ---
app.get('/api/admin/verifications', async (req, res) => {
    try {
        const query = `
            SELECT 
                u.user_id as id, 
                u.status,
                p.company_name as company,
                p.location as address,
                p.first_name,
                p.last_name
            FROM users u
            JOIN profiles p ON u.user_id = p.user_id
            WHERE u.role = 'hr'
            ORDER BY u.user_id DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        console.error("Verification Fetch Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE USER STATUS ONLY (Quick Approve/Reject) ---
app.put('/api/admin/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE users SET status = ? WHERE user_id = ?', [status, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- GET ALL JOBS FOR MODERATION ---
app.get('/api/admin/jobs', async (req, res) => {
    try {
        const query = `
            SELECT 
                j.*, 
                p.company_name as profile_company 
            FROM jobs j 
            LEFT JOIN profiles p ON j.hr_id = p.user_id 
            ORDER BY j.posted_at DESC
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        console.error("Admin Fetch Jobs Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE JOB STATUS (MODERATION) ---
app.put('/api/admin/jobs/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.execute('UPDATE jobs SET status = ? WHERE job_id = ?', [status, id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- UPDATE HR PERSONAL SETTINGS ---
app.put('/api/hr/profile/personal/:hrId', async (req, res) => {
    const { hrId } = req.params;
    const { first_name, last_name, email, phone, job_title } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        // 1. Update the users table (for email)
        await connection.execute(
            'UPDATE users SET email = ? WHERE user_id = ?', 
            [email, hrId]
        );
        
        // 2. Update the profiles table (for personal details)
        await connection.execute(
            'UPDATE profiles SET first_name = ?, last_name = ?, phone = ?, job_title = ? WHERE user_id = ?', 
            [first_name, last_name, phone, job_title, hrId]
        );

        await connection.commit();
        res.json({ success: true, message: "Personal settings updated" });
    } catch (err) {
        await connection.rollback();
        console.error("Settings Update Error:", err);
        res.status(500).json({ error: "Failed to update settings" });
    } finally {
        connection.release();
    }
});

module.exports = app;