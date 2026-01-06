'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import CategoryModal from '@/components/CategoryModal';
import ConfirmModal from '@/components/ConfirmModal';
import type { Category } from '@/types';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
    const { session } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (session) {
            fetchCategories();
        }
    }, [session]);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
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
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${deleteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            await fetchCategories();
            toast.success('Category deleted successfully');
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Failed to delete category');
        } finally {
            setDeleteLoading(false);
            setDeleteId(null);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
    };

    const incomeCategories = categories.filter(c => c.type === 'income');
    const purchaseCategories = categories.filter(c => c.type === 'purchase');

    return (
        <div className="page-content">
            {/* Page header */}
            <div className="page-header flex items-center justify-between">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="page-description">Organize your income and purchases</p>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn btn-primary hide-text-mobile">
                    <Plus size={18} />
                    <span>New Category</span>
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="space-y-20">
                    {/* Income categories */}
                    <div className="animate-in">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Tag size={20} style={{ color: 'var(--success)' }} />
                            Income Categories
                        </h2>
                        {incomeCategories.length === 0 ? (
                            <div className="empty-state">
                                <p className="text-secondary">No income categories yet. Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {incomeCategories.map((category) => (
                                    <div key={category.id} className="card">
                                        <div className="card-body">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{ background: `${category.color}20`, color: category.color }}
                                                    >
                                                        <Tag size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{category.name}</h3>
                                                        <p className="text-xs text-muted">Income</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(category)} className="btn btn-sm btn-ghost flex-1">
                                                    <Edit2 size={14} />
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-ghost text-danger">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Purchase categories */}
                    <div className="animate-in delay-1">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Tag size={20} style={{ color: 'var(--danger)' }} />
                            Purchase Categories
                        </h2>
                        {purchaseCategories.length === 0 ? (
                            <div className="empty-state">
                                <p className="text-secondary">No purchase categories yet. Create one to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {purchaseCategories.map((category) => (
                                    <div key={category.id} className="card">
                                        <div className="card-body">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{ background: `${category.color}20`, color: category.color }}
                                                    >
                                                        <Tag size={20} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{category.name}</h3>
                                                        <p className="text-xs text-muted">Purchase</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(category)} className="btn btn-sm btn-ghost flex-1">
                                                    <Edit2 size={14} />
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-ghost text-danger">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Category modal */}
            {modalOpen && (
                <CategoryModal
                    category={editingCategory}
                    onClose={handleModalClose}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <ConfirmModal
                    title="Delete Category"
                    message="Are you sure you want to delete this category? Items assigned to this category may lose their classification."
                    onClose={() => setDeleteId(null)}
                    onConfirm={confirmDelete}
                    isLoading={deleteLoading}
                />
            )}
        </div>
    );
}
