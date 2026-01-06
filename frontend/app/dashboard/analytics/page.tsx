'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import API_BASE from '@/app/lib/api';

interface CategoryData {
    name: string;
    total: number;
    color: string;
}

interface TrendData {
    month: string;
    income: number;
    expenses: number;
}

export default function AnalyticsPage() {
    const { session } = useAuth();
    const [incomeByCategory, setIncomeByCategory] = useState<CategoryData[]>([]);
    const [purchasesByCategory, setPurchasesByCategory] = useState<CategoryData[]>([]);
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchAnalytics();
        }
    }, [session]);

    const fetchAnalytics = async () => {
        try {
            // Fetch category breakdown
            const categoryRes = await fetch(`${API_BASE}/analytics/by-category`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const categoryData = await categoryRes.json();
            setIncomeByCategory(categoryData.incomeByCategory || []);
            setPurchasesByCategory(categoryData.purchasesByCategory || []);

            // Fetch trends
            const trendsRes = await fetch(`${API_BASE}/analytics/trends`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const trendsData = await trendsRes.json();
            setTrends(trendsData || []);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return `$${value.toFixed(0)}`;
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            {/* Page header */}
            <div className="page-header">
                <h1 className="page-title">Analytics</h1>
                <p className="page-description">Visual insights into your finances</p>
            </div>

            {/* Charts grid */}
            <div className="space-y-8">
                {/* Pie charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income by category */}
                    <div className="card animate-in">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold">Income by Category</h2>
                        </div>
                        <div className="card-body">
                            {incomeByCategory.length === 0 ? (
                                <div className="text-center py-12 text-secondary">
                                    No income data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={incomeByCategory}
                                            dataKey="total"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={(entry) => `${entry.name}: ${formatCurrency(entry.total)}`}
                                        >
                                            {incomeByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Purchases by category */}
                    <div className="card animate-in delay-1">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold">Expenses by Category</h2>
                        </div>
                        <div className="card-body">
                            {purchasesByCategory.length === 0 ? (
                                <div className="text-center py-12 text-secondary">
                                    No expense data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={purchasesByCategory}
                                            dataKey="total"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label={(entry) => `${entry.name}: ${formatCurrency(entry.total)}`}
                                        >
                                            {purchasesByCategory.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    {/* Income vs Expenses bar chart */}
                    <div className="card animate-in delay-2">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold">Income vs Expenses</h2>
                        </div>
                        <div className="card-body">
                            {trends.length === 0 ? (
                                <div className="text-center py-12 text-secondary">
                                    No trend data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={trends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                                        <XAxis dataKey="month" stroke="var(--text-secondary)" />
                                        <YAxis stroke="var(--text-secondary)" tickFormatter={formatCurrency} />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Bar dataKey="income" fill="#10b981" name="Income" />
                                        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Monthly trends line chart */}
                    <div className="card animate-in delay-3">
                        <div className="card-header">
                            <h2 className="text-lg font-semibold">Monthly Trends</h2>
                        </div>
                        <div className="card-body">
                            {trends.length === 0 ? (
                                <div className="text-center py-12 text-secondary">
                                    No trend data available
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={trends}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                                        <XAxis dataKey="month" stroke="var(--text-secondary)" />
                                        <YAxis stroke="var(--text-secondary)" tickFormatter={formatCurrency} />
                                        <Tooltip
                                            formatter={(value: number) => formatCurrency(value)}
                                            contentStyle={{
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid var(--border-subtle)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                                        <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
