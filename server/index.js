const app = require('./app'); // Imports all the logic from app.js
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is officially running on port ${PORT}`);
    console.log(`🔗 Test Profile Link: http://localhost:${PORT}/api/hr/profile/1`);
});