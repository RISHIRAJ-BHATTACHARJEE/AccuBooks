'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryModalProps {
    category?: Category | null;
    onClose: () => void;
}

const PRESET_COLORS = [
    '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export default function CategoryModal({ category, onClose }: CategoryModalProps) {
    const { session } = useAuth();
    const [name, setName] = useState('');
    const [type, setType] = useState<'income' | 'purchase'>('income');
    const [color, setColor] = useState('#10b981');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (category) {
            setName(category.name);
            setType(category.type);
            setColor(category.color);
        }
    }, [category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const url = category
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${category.id}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;

            const method = category ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ name, type, color })
            });

            if (!res.ok) throw new Error('Failed to save category');

            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{category ? 'Edit Category' : 'New Category'}</h2>
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
                            <label className="form-label">Category Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Work, Groceries, Entertainment"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 flex-1 p-3 rounded-lg border cursor-pointer transition-all"
                                    style={{
                                        borderColor: type === 'income' ? 'var(--accent-500)' : 'var(--border-default)',
                                        background: type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="type"
                                        value="income"
                                        checked={type === 'income'}
                                        onChange={(e) => setType(e.target.value as 'income')}
                                        className="hidden"
                                    />
                                    <span className="font-medium">Income</span>
                                </label>
                                <label className="flex items-center gap-2 flex-1 p-3 rounded-lg border cursor-pointer transition-all"
                                    style={{
                                        borderColor: type === 'purchase' ? 'var(--accent-500)' : 'var(--border-default)',
                                        background: type === 'purchase' ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="type"
                                        value="purchase"
                                        checked={type === 'purchase'}
                                        onChange={(e) => setType(e.target.value as 'purchase')}
                                        className="hidden"
                                    />
                                    <span className="font-medium">Purchase</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <div className="grid grid-cols-5 gap-2">
                                {PRESET_COLORS.map((presetColor) => (
                                    <button
                                        key={presetColor}
                                        type="button"
                                        onClick={() => setColor(presetColor)}
                                        className="w-full aspect-square rounded-lg transition-all"
                                        style={{
                                            background: presetColor,
                                            border: color === presetColor ? '3px solid var(--accent-400)' : '2px solid var(--border-subtle)',
                                            transform: color === presetColor ? 'scale(1.1)' : 'scale(1)'
                                        }}
                                    />
                                ))}
                            </div>
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
                                category ? 'Update' : 'Create'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
