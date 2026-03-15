"use client";
import { useEffect, useState } from 'react';
import { BarChart3, Package, TrendingUp, AlertCircle, ShoppingBag, IndianRupee } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, salesRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/products/all-monthly-sales')
                ]);
                setStats(statsRes.data);
                setChartData(salesRes.data || []);
            } catch (err: any) {
                console.error("Dashboard fetch error:", err);
                setStats({ totalRevenue: 0, totalSales: 0, productCount: 0, competitorCount: 0, inventoryValue: 0, lowStockCount: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header className="flex justify-between items-end">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shop Dashboard</h1>
                    <p className="text-slate-500 mt-1">Your shoe shop performance at a glance</p>
                </motion.div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={formatINR(stats?.totalRevenue || 0)} icon={IndianRupee} trend="+18.4%" color="blue" />
                <StatCard title="Pairs Sold" value={String(stats?.totalSales || 0)} icon={ShoppingBag} trend="+12.2%" color="emerald" />
                <StatCard title="Shoe Models" value={String(stats?.productCount || 0)} icon={Package} color="indigo" />
                <StatCard title="Low Stock Items" value={String(stats?.lowStockCount || 0)} icon={AlertCircle} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 glass-card p-8 bg-white"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Monthly Revenue</h3>
                            <p className="text-sm text-slate-500">Sales revenue across all shoe models (₹)</p>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    formatter={(val: number) => [formatINR(val), 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="glass-card p-6 bg-white">
                        <h3 className="font-black text-slate-900 mb-4">Shop Summary</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                                <span className="text-sm font-bold text-blue-800">Inventory Value</span>
                                <span className="text-sm font-black text-blue-600">{formatINR(stats?.inventoryValue || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                                <span className="text-sm font-bold text-emerald-800">Total Pairs Sold</span>
                                <span className="text-sm font-black text-emerald-600">{stats?.totalSales || 0}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                                <span className="text-sm font-bold text-amber-800">Competitor Prices Tracked</span>
                                <span className="text-sm font-black text-amber-600">{stats?.competitorCount || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-white">
                        <h3 className="font-black text-slate-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <a href="/products" className="block w-full py-3 text-center border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                View All Shoes
                            </a>
                            <a href="/recommendations" className="block w-full py-3 text-center bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                                Get Price Predictions
                            </a>
                            <a href="/competitors" className="block w-full py-3 text-center border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                                Compare Market Prices
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
