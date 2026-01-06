require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.js');
const categoriesRoutes = require('./routes/categories.js');
const incomeRoutes = require('./routes/income.js');
const purchasesRoutes = require('./routes/purchases.js');
const analyticsRoutes = require('./routes/analytics.js');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://accu-books-vn4i.vercel.app/',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

app.listen(PORT, () => {
    console.log(`AccuBooks server running on port ${PORT}`);
});
