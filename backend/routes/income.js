const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Get all income entries
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('income')
            .select('*, categories(id, name, color)')
            .eq('user_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create income entry
router.post('/', authenticateToken, async (req, res) => {
    const { category_id, amount, description, date } = req.body;

    if (!amount) {
        return res.status(400).json({ error: 'Amount required' });
    }

    try {
        const { data, error } = await supabase
            .from('income')
            .insert([{
                user_id: req.user.id,
                category_id,
                amount,
                description,
                date: date || new Date().toISOString().split('T')[0]
            }])
            .select('*, categories(id, name, color)')
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update income entry
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { category_id, amount, description, date } = req.body;

    try {
        const { data, error } = await supabase
            .from('income')
            .update({ category_id, amount, description, date })
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select('*, categories(id, name, color)')
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete income entry
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('income')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ message: 'Income entry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
