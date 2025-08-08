const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

// Admin login - mirrors the current admin.js logic
router.post('/admin/login', async (req, res) => {
  console.log('🔐 ADMIN LOGIN ATTEMPT:', {
    timestamp: new Date().toISOString(),
    email: req.body.email ? '***' + req.body.email.slice(-4) : 'undefined',
    hasPassword: !!req.body.password,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ ADMIN LOGIN FAILED: Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('🔍 Attempting Supabase authentication for admin...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ ADMIN LOGIN ERROR:', {
        error: error.message,
        code: error.status,
        email: email
      });
      return res.status(401).json({ error: error.message });
    }

    console.log('✅ ADMIN LOGIN SUCCESS:', {
      userId: data.user.id,
      email: data.user.email,
      timestamp: new Date().toISOString()
    });

    const token = jwt.sign(
      { userId: data.user.id, email: data.user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: data.user,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('💥 ADMIN LOGIN SERVER ERROR:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// NGO login
router.post('/ngo/login', async (req, res) => {
  console.log('🏢 NGO LOGIN ATTEMPT:', {
    timestamp: new Date().toISOString(),
    ngoName: req.body.ngo_name ? '***' + req.body.ngo_name.slice(-4) : 'undefined',
    hasPassword: !!req.body.Password,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  try {
    console.log('🔍 Received request body:', req.body);
    console.log('🔍 Request body type:', typeof req.body);
    console.log('🔍 Request headers:', req.headers);
    console.log('🔍 Content-Type header:', req.headers['content-type']);
    
    const { ngo_name, Password } = req.body;

    if (!ngo_name || !Password) {
      console.log('❌ NGO LOGIN FAILED: Missing credentials');
      console.log('🔍 ngo_name:', ngo_name);
      console.log('🔍 Password:', Password);
      return res.status(400).json({ error: 'NGO name and password are required' });
    }

    console.log('🔍 Querying NGO database...');
    // Try to find NGO by email first, then by ngo_name
    let { data, error } = await supabase
      .from('RegisterNGO')
      .select('*')
      .eq('email', ngo_name)
      .eq('Password', Password)
      .maybeSingle();

    // If not found by email, try by ngo_name
    if (error || !data) {
      console.log('🔍 Trying to find by NGO name...');
      const { data: dataByName, error: errorByName } = await supabase
        .from('RegisterNGO')
        .select('*')
        .eq('ngo_name', ngo_name)
        .eq('Password', Password)
        .maybeSingle();
      
      data = dataByName;
      error = errorByName;
    }

    if (error || !data) {
      console.error('❌ NGO LOGIN ERROR:', {
        error: error?.message || 'No data found',
        ngoName: ngo_name,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ NGO LOGIN SUCCESS:', {
      ngoId: data.id,
      ngoName: data.ngo_name,
      timestamp: new Date().toISOString()
    });

    const token = jwt.sign(
      { ngoId: data.id, ngoName: data.ngo_name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      ngo: data,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('💥 NGO LOGIN SERVER ERROR:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User registration
router.post('/user/register', async (req, res) => {
  try {
    const { email, phone, password, drop_off } = req.body;

    if (!email || !phone || !password || !drop_off) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('UserRegistration')
      .insert([{ email, phone, password, drop_off }])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      success: true,
      user: data[0],
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
router.post('/user/login', async (req, res) => {
  console.log('👤 USER LOGIN ATTEMPT:', {
    timestamp: new Date().toISOString(),
    email: req.body.email ? '***' + req.body.email.slice(-4) : 'undefined',
    hasPassword: !!req.body.password,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ USER LOGIN FAILED: Missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('🔍 Querying user database...');
    const { data: user, error } = await supabase
      .from('UserRegistration')
      .select('email, password, drop_off, phone')
      .eq('email', email)
      .maybeSingle();

    if (error || !user) {
      console.error('❌ USER LOGIN ERROR:', {
        error: error?.message || 'User not found',
        email: email,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.password !== password) {
      console.error('❌ USER LOGIN ERROR: Password mismatch', {
        email: email,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('✅ USER LOGIN SUCCESS:', {
      email: user.email,
      dropOff: user.drop_off,
      timestamp: new Date().toISOString()
    });

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('💥 USER LOGIN SERVER ERROR:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// NGO registration
router.post('/ngo/register', async (req, res) => {
  console.log('🏢 NGO REGISTRATION ATTEMPT:', {
    timestamp: new Date().toISOString(),
    ngoName: req.body.ngo_name ? '***' + req.body.ngo_name.slice(-4) : 'undefined',
    email: req.body.email ? '***' + req.body.email.slice(-4) : 'undefined',
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  try {
    const { 
      ngo_name, 
      email, 
      password, 
      licensenum, 
      address, 
      pancardnum, 
      phone_number 
    } = req.body;

    if (!ngo_name || !email || !password || !licensenum || !address || !pancardnum || !phone_number) {
      console.log('❌ NGO REGISTRATION FAILED: Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('🔍 Inserting NGO into database...');
    const { data, error } = await supabase
      .from('RegisterNGO')
      .insert([{
        ngo_name,
        email,
        Password: password,
        Licensenum: licensenum,
        Address: address,
        pancardnum: pancardnum.toString(), // Convert to string to match database schema
        phone_number: phone_number.toString() // Convert to string to match database schema
      }])
      .select();

    if (error) {
      console.error('❌ NGO REGISTRATION ERROR:', {
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({ error: error.message });
    }

    console.log('✅ NGO REGISTRATION SUCCESS:', {
      ngoId: data[0].id,
      ngoName: data[0].ngo_name,
      email: data[0].email,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      ngo: data[0],
      message: 'NGO registered successfully'
    });

  } catch (error) {
    console.error('💥 NGO REGISTRATION SERVER ERROR:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;