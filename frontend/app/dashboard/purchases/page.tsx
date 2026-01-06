'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import PurchaseModal from '@/components/PurchaseModal';
import ConfirmModal from '@/components/ConfirmModal';
import type { Purchase } from '@/types';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

export default function PurchasesPage() {
    const { session } = useAuth();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchPurchases();
        }
    }, [session]);

    const fetchPurchases = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setPurchases(data);
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
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
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/purchases/${deleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            await fetchPurchases();
            toast.success('Purchase deleted successfully');
        } catch (error) {
            console.error('Failed to delete purchase:', error);
            toast.error('Failed to delete purchase2');
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    };

    const handleEdit = (purchase: Purchase) => {
        setEditingPurchase(purchase);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingPurchase(null);
        fetchPurchases();
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const totalExpenses = purchases.reduce((sum, purchase) => sum + Number(purchase.amount), 0);

    return (
        <div className="page-content">
            {/* Page header */}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Purchases</h1>
                    <p className="page-description">Track all your expenses and purchases</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn btn-primary hide-text-mobile">
                    <Plus size={18} />
                    <span>Add Purchase</span>
                </button>
            </div>

            {/* Total card */}
            <div className="stat-card mb-6 animate-in">
                <div className="stat-card-title">Total Expenses</div>
                <div className="stat-card-value mono currency-negative">
                    {formatCurrency(totalExpenses)}
                </div>
            </div>

            {/* Purchases table */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : purchases.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🛒</div>
                    <h3 className="empty-state-title">No purchases yet</h3>
                    <p className="empty-state-description">
                        Start tracking your expenses by adding your first purchase
                    </p>
                    <button onClick={() => setModalOpen(true)} className="btn btn-primary">
                        <Plus size={18} />
                        Add Purchase
                    </button>
                </div>
            ) : (
                <div className="table-container animate-in delay-1">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th className="hide-on-mobile">Description</th>
                                <th className="text-right">Amount</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchases.map((purchase) => (
                                <tr key={purchase.id}>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-muted" />
                                            {format(new Date(purchase.date), 'MMM dd, yyyy')}
                                        </div>
                                    </td>
                                    <td className="font-medium">{purchase.name}</td>
                                    <td>
                                        {purchase.categories ? (
                                            <span
                                                className="status-badge"
                                                style={{ background: `${purchase.categories.color}20`, color: purchase.categories.color }}
                                            >
                                                {purchase.categories.name}
                                            </span>
                                        ) : (
                                            <span className="text-muted">Uncategorized</span>
                                        )}
                                    </td>
                                    <td className="text-secondary hide-on-mobile">{purchase.description || '-'}</td>
                                    <td className="text-right mono currency-negative font-semibold">
                                        {formatCurrency(Number(purchase.amount))}
                                    </td>
                                    <td>
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(purchase)} className="btn btn-sm btn-ghost">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(purchase.id)} className="btn btn-sm btn-ghost text-danger">
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

            {/* Purchase modal */}
            {modalOpen && (
                <PurchaseModal
                    purchase={editingPurchase}
                    onClose={handleModalClose}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Purchase"
                    message="Are you sure you want to delete this purchase? This action cannot be undone."
                    onClose={() => setDeleteId(null)}
                    onConfirm={confirmDelete}
                    isLoading={deleteLoading}
                />
            )}
        </div>
    );
}
