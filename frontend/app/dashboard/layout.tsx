'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="app-layout">
            <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
            <main className="main-content" style={{ background: 'var(--bg-primary)' }}>
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b sticky top-0 z-30 backdrop-blur-md bg-opacity-90"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Accu<span style={{ color: 'var(--accent-400)' }}>Books</span>
                    </h2>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="btn btn-ghost btn-icon"
                        aria-label="Open menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}
