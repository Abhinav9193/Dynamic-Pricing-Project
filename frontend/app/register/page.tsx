"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Lock, Mail, Building2, User, Fingerprint, MapPin, Briefcase } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        registrationNumber: '',
        industry: 'Footwear',
        headquarters: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/signup', formData);
            alert("Registration successful! Please login with your new credentials.");
            router.push('/login');
        } catch (err: any) {
            console.error(err);
            alert("Registration failed. Please check your details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="p-4 bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200">
                        <BrainCircuit size={48} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900">Register Your Company</h1>
                    <p className="text-slate-500 mt-2">Join the future of Dynamic Pricing Intelligence</p>
                </div>

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Section */}
                    <div className="space-y-6 md:border-r md:pr-6 border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Admin Account Details
                        </h2>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="Abhinav Kumar"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="admin@yourcorp.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Secure Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Section */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Building2 size={20} className="text-blue-600" />
                            Company Identity
                        </h2>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Company Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="companyName"
                                    type="text"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="Your Footwear Brand"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">GST or Reg. Number</label>
                            <div className="relative">
                                <Fingerprint className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="registrationNumber"
                                    type="text"
                                    value={formData.registrationNumber}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="GSTIN/12345/IN"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Industry</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                                <select
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none"
                                >
                                    <option value="Footwear">Footwear & Apparel</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="FMCG">FMCG</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-600">Headquarters</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    name="headquarters"
                                    type="text"
                                    value={formData.headquarters}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="Mumbai, India"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-50"
                        >
                            {loading ? 'Processing Registration...' : 'Apply for Access'}
                        </button>
                        <p className="text-center text-sm text-slate-500 mt-6">
                            Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
