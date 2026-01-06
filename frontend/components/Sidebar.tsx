'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    TrendingUp,
    ShoppingCart,
    Tag,
    BarChart3,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    X
} from 'lucide-react';

interface SidebarProps {
    mobileOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    const { user, signOut } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: TrendingUp, label: 'Income', href: '/dashboard/income' },
        { icon: ShoppingCart, label: 'Purchases', href: '/dashboard/purchases' },
        { icon: Tag, label: 'Categories', href: '/dashboard/categories' },
        { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
                style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-subtle)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b relative" style={{ borderColor: 'var(--border-subtle)' }}>
                    {!collapsed && (
                        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                            Accu<span style={{ color: 'var(--accent-400)' }}>Books</span>
                        </h2>
                    )}

                    {/* Mobile close button - only on mobile */}
                    <button
                        onClick={onClose}
                        className="btn btn-ghost btn-icon lg:hidden! absolute right-5"
                    >
                        <X size={20} />
                    </button>

                    {/* Desktop collapse button - only on desktop */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="btn btn-ghost btn-icon hidden! lg:flex!"
                        style={{ marginLeft: collapsed ? 'auto' : '0' }}
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg transition-all"
                                style={{
                                    background: isActive ? 'var(--bg-hover)' : 'transparent',
                                    color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                                }}
                            >
                                <Icon size={20} />
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div
                        className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-lg"
                        style={{ background: 'var(--bg-tertiary)' }}
                    >
                        <div
                            className="flex items-center justify-center w-8 h-8 rounded-full"
                            style={{ background: 'var(--accent-600)' }}
                        >
                            <User size={16} color="white" />
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                                    {user?.email}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={signOut}
                        className="btn btn-ghost w-full justify-start"
                    >
                        <LogOut size={18} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
