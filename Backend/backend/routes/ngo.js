const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Register new NGO
router.post('/register', async (req, res) => {
  try {
    const { ngo_name, address, password } = req.body;

    if (!ngo_name || !address || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const { data, error } = await supabase
      .from('RegisterNGO')
      .insert([{ ngo_name, address, password }])
      .select();

    if (error) {
      console.error('Error registering NGO:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      ngo: data[0],
      message: 'NGO registered successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get NGO by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('RegisterNGO')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching NGO:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    res.json({
      success: true,
      ngo: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update NGO profile
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo_name, address, password } = req.body;

    const updateData = {};
    if (ngo_name) updateData.ngo_name = ngo_name;
    if (address) updateData.address = address;
    if (password) updateData.password = password;

    const { data, error } = await supabase
      .from('RegisterNGO')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating NGO:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      ngo: data[0],
      message: 'NGO updated successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all NGOs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('RegisterNGO')
      .select('*');

    if (error) {
      console.error('Error fetching NGOs:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      ngos: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


