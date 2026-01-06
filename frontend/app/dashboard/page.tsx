'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';
import API_BASE from '../lib/api';

interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netBalance: number;
}

export default function DashboardPage() {
    const { session } = useAuth();
    const [summary, setSummary] = useState<FinancialSummary>({ totalIncome: 0, totalExpenses: 0, netBalance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchSummary();
        }
    }, [session]);

    const fetchSummary = async () => {
        try {
            const res = await fetch(`${API_BASE}/analytics/summary`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setSummary(data);
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="page-content">
            {/* Page header */}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-description">Overview of your financial health</p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card animate-in">
                    <div className="flex items-center justify-between mb-3">
                        <span className="stat-card-title">Total Income</span>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                            <TrendingUp size={20} style={{ color: 'var(--success)' }} />
                        </div>
                    </div>
                    <div className="stat-card-value mono" style={{ color: 'var(--success)' }}>
                        {loading ? '...' : formatCurrency(summary.totalIncome)}
                    </div>
                </div>

                <div className="stat-card animate-in delay-1">
                    <div className="flex items-center justify-between mb-3">
                        <span className="stat-card-title">Total Expenses</span>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
                            <TrendingDown size={20} style={{ color: 'var(--danger)' }} />
                        </div>
                    </div>
                    <div className="stat-card-value mono" style={{ color: 'var(--danger)' }}>
                        {loading ? '...' : formatCurrency(summary.totalExpenses)}
                    </div>
                </div>

                <div className="stat-card animate-in delay-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="stat-card-title">Net Balance</span>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                            <DollarSign size={20} style={{ color: 'var(--accent-400)' }} />
                        </div>
                    </div>
                    <div
                        className="stat-card-value mono"
                        style={{ color: summary.netBalance >= 0 ? 'var(--success)' : 'var(--danger)' }}
                    >
                        {loading ? '...' : formatCurrency(summary.netBalance)}
                    </div>
                </div>
            </div>

            {/* Quick actions */}
            <div className="card animate-in delay-3">
                <div className="card-header">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                </div>
                <div className="card-body">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/dashboard/income" className="btn btn-primary">
                            <Plus size={18} />
                            Add Income
                        </Link>
                        <Link href="/dashboard/purchases" className="btn btn-primary">
                            <Plus size={18} />
                            Add Purchase
                        </Link>
                        <Link href="/dashboard/categories" className="btn btn-secondary">
                            <Plus size={18} />
                            New Category
                        </Link>
                        <Link href="/dashboard/analytics" className="btn btn-secondary">
                            View Analytics
                        </Link>
                    </div>
                </div>
            </div>

            {/* Welcome message */}
            <div className="mt-8 text-center">
                <p className="text-secondary">
                    Start tracking your finances by adding income and purchases, or create categories to organize your transactions.
                </p>
            </div>
        </div>
    );
}
