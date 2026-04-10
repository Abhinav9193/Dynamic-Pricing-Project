"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Lock, Mail } from 'lucide-react';
import api from '@/lib/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/signin', { email, password });
            localStorage.setItem('token', res.data.token);
            router.push('/dashboard');
        } catch (err: any) {
            if (err.response?.status === 401) {
                setError('Invalid email or password.');
            } else if (err.code === 'ERR_NETWORK') {
                setError('Backend server is not running. Start Spring Boot on port 8080.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mb-4">
                        <BrainCircuit size={40} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Shoe Shop Manager</h1>
                    <p className="text-slate-500 text-sm mt-1">Dynamic Pricing & Inventory Platform</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6" suppressHydrationWarning>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                placeholder="admin@shop.com"
                                required
                                suppressHydrationWarning
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                placeholder="••••••••"
                                required
                                suppressHydrationWarning
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔑</span>
                        <p className="font-bold text-amber-800">Demo Credentials for Recruiters</p>
                    </div>
                    <div className="space-y-1 font-mono text-xs bg-white/60 rounded-md p-2.5 border border-amber-100">
                        <p><span className="text-amber-600 font-semibold">Email:</span> demo@shop.com</p>
                        <p><span className="text-amber-600 font-semibold">Password:</span> demo1234</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => { setEmail('demo@shop.com'); setPassword('demo1234'); }}
                        className="mt-3 w-full py-2 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors cursor-pointer"
                    >
                        ⚡ Use Demo Credentials
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-slate-500">
                    New here? <a href="/register" className="text-blue-600 font-bold hover:underline">Register your Shop</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
