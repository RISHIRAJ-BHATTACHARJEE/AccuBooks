'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    title,
    message,
    onClose,
    onConfirm,
    isLoading = false,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    type = 'danger'
}: ConfirmModalProps) {
    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 60 }}>
            <div className="modal max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header border-b-0 pb-0">
                    <button onClick={onClose} className="btn btn-ghost btn-icon absolute right-4 top-4">
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body text-center pt-2 pb-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4"
                        style={{ background: type === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)' }}>
                        <AlertTriangle className={`h-6 w-6 ${type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}
                            style={{ color: type === 'danger' ? 'var(--danger)' : 'var(--warning)' }} />
                    </div>

                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {message}
                    </p>
                </div>

                <div className="modal-footer justify-center gap-3 border-t-0 pt-0 pb-6 px-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary w-full"
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`btn w-full ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                        style={type === 'danger' ? { background: 'var(--danger)', borderColor: 'var(--danger)', color: 'white' } : {}}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="spinner w-4 h-4 border-2"></span>
                                Processing...
                            </span>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
