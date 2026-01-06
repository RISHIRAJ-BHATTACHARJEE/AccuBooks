'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import IncomeModal from '@/components/IncomeModal';
import ConfirmModal from '@/components/ConfirmModal';
import type { Income } from '@/types';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import API_BASE from '@/app/lib/api';

export default function IncomePage() {
    const { session } = useAuth();
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchIncomes();
        }
    }, [session]);

    const fetchIncomes = async () => {
        try {
            const res = await fetch(`${API_BASE}/income`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setIncomes(data);
        } catch (error) {
            console.error('Failed to fetch incomes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);

        try {
            await fetch(`${API_BASE}/income/${deleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            await fetchIncomes();
            toast.success('Income entry deleted successfully');
        } catch (error) {
            console.error('Failed to delete income:', error);
            toast.error('Failed to delete income entry');
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    };

    const handleEdit = (income: Income) => {
        setEditingIncome(income);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingIncome(null);
        fetchIncomes();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0);

    return (
        <div className="page-content">
            {/* Page header */}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Income</h1>
                    <p className="page-description">Track all your income sources</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn btn-primary hide-text-mobile">
                    <Plus size={18} />
                    <span>Add Income</span>
                </button>
            </div>

            {/* Total card */}
            <div className="stat-card mb-6 animate-in">
                <div className="stat-card-title">Total Income</div>
                <div className="stat-card-value mono currency-positive">
                    {formatCurrency(totalIncome)}
                </div>
            </div>

            {/* Income table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : incomes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">💰</div>
                    <h3 className="empty-state-title">No income entries yet</h3>
                    <p className="empty-state-description">
                        Start tracking your income by adding your first entry
                    </p>
                    <button onClick={() => setModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} />
                        Add Income
                    </button>
                </div>
            ) : (
                <div className="table-container animate-in delay-1">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th className="text-right">Amount</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomes.map((income) => (
                                <tr key={income.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-muted" />
                                            {format(new Date(income.date), 'MMM dd, yyyy')}
                                        </div>
                                    </td>
                                    <td>
                                        {income.categories ? (
                                            <span
                                                className="status-badge"
                                                style={{ background: `${income.categories.color}20`, color: income.categories.color }}
                                            >
                                                {income.categories.name}
                                            </span>
                                        ) : (
                                            <span className="text-muted">Uncategorized</span>
                                        )}
                                    </td>
                                    <td className="text-secondary">{income.description || '-'}</td>
                                    <td className="text-right mono currency-positive font-semibold">
                                        {formatCurrency(Number(income.amount))}
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(income)} className="btn btn-sm btn-ghost">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(income.id)} className="btn btn-sm btn-ghost text-danger">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Income modal */}
            {modalOpen && (
                <IncomeModal
                    income={editingIncome}
                    onClose={handleModalClose}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Income"
                    message="Are you sure you want to delete this income entry? This action cannot be undone."
                    onClose={() => setDeleteId(null)}
                    onConfirm={confirmDelete}
                    isLoading={deleteLoading}
                />
            )}
        </div>
    );
}
