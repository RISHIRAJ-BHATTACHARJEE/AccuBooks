'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      {/* Background gradient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-accent-600 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-accent-500 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-in">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Accu<span style={{ color: 'var(--accent-400)' }}>Books</span>
          </h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Professional accounting software for modern businesses. Track income, manage expenses, and visualize your financial health.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="stat-card text-left">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Visual Analytics</h3>
            <p className="text-sm text-secondary">Beautiful charts and graphs to understand your spending patterns</p>
          </div>
          <div className="stat-card text-left">
            <div className="text-3xl mb-3">🏷️</div>
            <h3 className="text-lg font-semibold mb-2">Smart Categories</h3>
            <p className="text-sm text-secondary">Organize income and purchases with custom categories</p>
          </div>
          <div className="stat-card text-left">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-secondary">Your financial data is encrypted and protected</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/signup" className="btn btn-primary btn-lg">
            Get Started Free
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </main>
    </div>
  );
}
