const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

const router = Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Get all purchases
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .select('*, categories(id, name, color)')
            .eq('user_id', req.user.id)
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create purchase
router.post('/', authenticateToken, async (req, res) => {
    const { name, description, category_id, amount, date } = req.body;

    if (!name || !amount) {
        return res.status(400).json({ error: 'Name and amount required' });
    }

    try {
        const { data, error } = await supabase
            .from('purchases')
            .insert([{
                user_id: req.user.id,
                name,
                description,
                category_id,
                amount,
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

// Update purchase
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, description, category_id, amount, date } = req.body;

    try {
        const { data, error } = await supabase
            .from('purchases')
            .update({ name, description, category_id, amount, date })
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

// Delete purchase
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('purchases')
            .delete()
            .eq('id', id)
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json({ message: 'Purchase deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
