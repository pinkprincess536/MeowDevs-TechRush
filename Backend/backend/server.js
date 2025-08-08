const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load env from project root if present
const rootEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath });
} else {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from project root Frontend/ and Backend/
app.use(express.static(path.join(__dirname, '..', 'Backend')));
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

// Routes
const authRoutes = require('./routes/auth');
const ngoRoutes = require('./routes/ngo');
const requestRoutes = require('./routes/requests');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/ngo', ngoRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// HTML entry points
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Backend', 'admin', 'adminpage.html'));
});

app.get('/ngo-dashboard', (req, res) => {
  // Note: file in repo is "ngo_dashboardfinal.html"
  res.sendFile(path.join(__dirname, '..', 'ngo_dashboardfinal.html'));
});

app.get('/ngo-login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'ngo_login_final.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


