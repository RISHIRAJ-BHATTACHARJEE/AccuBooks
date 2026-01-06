'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';
import type { Purchase, Category } from '@/types';

interface PurchaseModalProps {
    purchase?: Purchase | null;
    onClose: () => void;
}

export default function PurchaseModal({ purchase, onClose }: PurchaseModalProps) {
    const { session } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (purchase) {
            setName(purchase.name);
            setDescription(purchase.description || '');
            setCategoryId(purchase.category_id || '');
            setAmount(purchase.amount.toString());
            setDate(purchase.date);
        }
    }, [purchase]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setCategories(data.filter((c: Category) => c.type === 'purchase'));
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const url = purchase
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/purchases/${purchase.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/purchases`;

            const method = purchase ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    name,
                    description,
                    category_id: categoryId || null,
                    amount: parseFloat(amount),
                    date
                })
            });

            if (!res.ok) throw new Error('Failed to save purchase');

            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save purchase');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{purchase ? 'Edit Purchase' : 'Add Purchase'}</h2>
                    <button onClick={onClose} className="btn btn-ghost btn-icon">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body space-y-4">
                        {error && (
                            <div className="p-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)' }}>
                                <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label">Name *</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Groceries, Gas, Dinner"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input"
                                rows={3}
                                placeholder="Optional description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount *</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-input"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Uncategorized</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date *</label>
                            <input
                                type="date"
                                className="form-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="spinner"></span>
                                    Saving...
                                </span>
                            ) : (
                                purchase ? 'Update' : 'Add Purchase'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
