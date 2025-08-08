const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Create new user request
router.post('/user', async (req, res) => {
  try {
    const { category, username, quantity, image_url } = req.body;

    if (!category || !username) {
      return res.status(400).json({ error: 'Category and username are required' });
    }

    const { data, error } = await supabase
      .from('requests')
      .insert([{
        category,
        username,
        quantity: quantity || 1,
        image_url: image_url || null,
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Error creating request:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      request: data[0],
      message: 'Request created successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new NGO request
router.post('/ngo', async (req, res) => {
  try {
    const { ngo_id, category, quantity, description } = req.body;

    if (!ngo_id || !category || !quantity) {
      return res.status(400).json({ error: 'NGO ID, category, and quantity are required' });
    }

    const { data, error } = await supabase
      .from('ngo-requests')
      .insert([{
        ngo_id,
        category,
        quantity,
        description: description || '',
        status: 'pending'
      }])
      .select();

    if (error) {
      console.error('Error creating NGO request:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      request: data[0],
      message: 'NGO request created successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get requests by NGO ID
router.get('/ngo/:ngoId', async (req, res) => {
  try {
    const { ngoId } = req.params;

    const { data, error } = await supabase
      .from('ngo-requests')
      .select('*')
      .eq('ngo_id', ngoId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching NGO requests:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      requests: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update NGO request status
router.put('/ngo/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, received } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (received !== undefined) updateData.received = received;

    const { data, error } = await supabase
      .from('ngo-requests')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating NGO request:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      request: data[0],
      message: 'NGO request updated successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all user requests
router.get('/user', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching user requests:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      requests: data
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


