const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all NGO requests - mirrors reqhis.js logic
router.get('/ngo-requests', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ngo-requests')
      .select('*')
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

// Get single user request by id
router.get('/requests/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching request:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, request: data });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all user requests
router.get('/user-requests', async (req, res) => {
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

// Update request status
router.put('/requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const { data, error } = await supabase
      .from('requests')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating request:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      success: true,
      request: data[0],
      message: 'Request status updated successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign NGO to request
router.put('/requests/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { ngo_assigned_to } = req.body;

    if (!ngo_assigned_to) {
      return res.status(400).json({ error: 'NGO assignment is required' });
    }

    const { data, error } = await supabase
      .from('requests')
      .update({ ngo_assigned_to })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error assigning NGO:', error);
      return res.status(500).json({ error: error.message });
    }

    // Also create a corresponding entry in ngo-requests like the frontend does
    const requestRow = data[0];
    const { data: ngoInsert, error: insertError } = await supabase
      .from('ngo-requests')
      .insert({
        ngo_id: ngo_assigned_to,
        category: requestRow.category,
        quantity: requestRow.quantity,
        description: requestRow.description || '',
        status: 'pending'
      })
      .select();

    if (insertError) {
      console.error('Error creating ngo-requests entry:', insertError);
    }

    res.json({
      success: true,
      request: requestRow,
      ngoRequest: ngoInsert?.[0] || null,
      message: 'NGO assigned successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all NGOs
router.get('/ngos', async (req, res) => {
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


