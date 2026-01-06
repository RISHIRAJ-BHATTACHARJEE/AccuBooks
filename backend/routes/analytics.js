const { Router } = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth.js');

const router = Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Get financial summary
router.get('/summary', authenticateToken, async (req, res) => {
    try {
        // Get total income
        const { data: incomeData, error: incomeError } = await supabase
            .from('income')
            .select('amount')
            .eq('user_id', req.user.id);

        if (incomeError) throw incomeError;

        // Get total purchases
        const { data: purchasesData, error: purchasesError } = await supabase
            .from('purchases')
            .select('amount')
            .eq('user_id', req.user.id);

        if (purchasesError) throw purchasesError;

        const totalIncome = incomeData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const totalExpenses = purchasesData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        const netBalance = totalIncome - totalExpenses;

        res.json({ totalIncome, totalExpenses, netBalance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get spending/income by category
router.get('/by-category', authenticateToken, async (req, res) => {
    try {
        // Income by category
        const { data: incomeByCategory, error: incomeError } = await supabase
            .from('income')
            .select('amount, categories(id, name, color)')
            .eq('user_id', req.user.id);

        if (incomeError) throw incomeError;

        // Purchases by category
        const { data: purchasesByCategory, error: purchasesError } = await supabase
            .from('purchases')
            .select('amount, categories(id, name, color)')
            .eq('user_id', req.user.id);

        if (purchasesError) throw purchasesError;

        // Aggregate income by category
        const incomeAgg = {};
        incomeByCategory.forEach(item => {
            const catName = item.categories?.name || 'Uncategorized';
            const catColor = item.categories?.color || '#10b981';
            if (!incomeAgg[catName]) {
                incomeAgg[catName] = { name: catName, total: 0, color: catColor };
            }
            incomeAgg[catName].total += parseFloat(item.amount);
        });

        // Aggregate purchases by category
        const purchasesAgg = {};
        purchasesByCategory.forEach(item => {
            const catName = item.categories?.name || 'Uncategorized';
            const catColor = item.categories?.color || '#ef4444';
            if (!purchasesAgg[catName]) {
                purchasesAgg[catName] = { name: catName, total: 0, color: catColor };
            }
            purchasesAgg[catName].total += parseFloat(item.amount);
        });

        res.json({
            incomeByCategory: Object.values(incomeAgg),
            purchasesByCategory: Object.values(purchasesAgg)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get monthly trends
router.get('/trends', authenticateToken, async (req, res) => {
    try {
        // Get income with dates
        const { data: incomeData, error: incomeError } = await supabase
            .from('income')
            .select('amount, date')
            .eq('user_id', req.user.id)
            .order('date', { ascending: true });

        if (incomeError) throw incomeError;

        // Get purchases with dates
        const { data: purchasesData, error: purchasesError } = await supabase
            .from('purchases')
            .select('amount, date')
            .eq('user_id', req.user.id)
            .order('date', { ascending: true });

        if (purchasesError) throw purchasesError;

        // Aggregate by month
        const monthlyData = {};

        incomeData.forEach(item => {
            const month = item.date.substring(0, 7); // YYYY-MM
            if (!monthlyData[month]) {
                monthlyData[month] = { month, income: 0, expenses: 0 };
            }
            monthlyData[month].income += parseFloat(item.amount);
        });

        purchasesData.forEach(item => {
            const month = item.date.substring(0, 7);
            if (!monthlyData[month]) {
                monthlyData[month] = { month, income: 0, expenses: 0 };
            }
            monthlyData[month].expenses += parseFloat(item.amount);
        });

        const trends = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));

        res.json(trends);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
