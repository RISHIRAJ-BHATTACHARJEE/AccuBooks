const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Signup with email/password
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) throw error;

        res.json({ user: data.user, session: data.session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login with email/password
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;

        res.json({ user: data.user, session: data.session });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Google OAuth (returns OAuth URL)
router.get('/oauth/google', async (req, res) => {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
            }
        });

        if (error) throw error;

        res.json({ url: data.url });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Logout
router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
