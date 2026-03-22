// --- UPDATED ONBOARDING ROUTE ---
app.post('/api/complete-onboarding', async (req, res) => {
  const { userId, role, profileData } = req.body;
  
  try {
    const query = `
      INSERT INTO profiles 
      (user_id, first_name, last_name, phone, dob, gender, location, education_level, 
       preferred_jobs, company_name, industry, company_size, corporate_email) 
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
      profileData.industry || null,
      profileData.companySize || null,
      profileData.corporateEmail || null
    ];

    // 1. Save the profile details
    await db.execute(query, values);

    // 2. CRITICAL FIX: Update both onboarding status AND the role
    // This changes 'job_seeker' to 'hr' if they chose the employer path
    await db.execute(
      'UPDATE users SET is_onboarded = 1, role = ? WHERE user_id = ?', 
      [role, userId]
    );

    res.json({ success: true, message: "Onboarding successful!" });
  } catch (err) {
    console.error("Onboarding Error:", err);
    res.status(500).json({ error: "Database failed to save profile." });
  }
});