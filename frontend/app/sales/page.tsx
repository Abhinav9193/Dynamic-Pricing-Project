"use client";
import { useEffect, useState } from 'react';
import { TrendingUp, Calendar, Download, ShoppingCart, IndianRupee } from 'lucide-react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const SalesAnalytics = () => {
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [salesRes, productsRes] = await Promise.all([
                    api.get('/products/all-monthly-sales'),
                    api.get('/products')
                ]);
                setMonthlyData(salesRes.data || []);
                setProducts(productsRes.data || []);
            } catch (err) {
                console.error("Error fetching sales", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalRevenue = monthlyData.reduce((sum, m) => sum + (m.revenue || 0), 0);
    const totalUnits = monthlyData.reduce((sum, m) => sum + (m.units || 0), 0);
    const avgOrderValue = totalUnits > 0 ? totalRevenue / totalUnits : 0;

    // Sort products by inventory (most sold = lowest stock)
    const topSellers = [...products]
        .sort((a, b) => a.inventoryLevel - b.inventoryLevel)
        .slice(0, 5);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Analytics</h1>
                    <p className="text-slate-500 mt-1">Monthly revenue and unit sales data for your shoe shop</p>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><IndianRupee size={18} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{formatINR(totalRevenue)}</p>
                </div>
                <div className="glass-card p-6 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><ShoppingCart size={18} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Total Pairs Sold</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{totalUnits.toLocaleString()}</p>
                </div>
                <div className="glass-card p-6 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp size={18} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Avg. Price per Pair</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{formatINR(avgOrderValue)}</p>
                </div>
                <div className="glass-card p-6 bg-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Calendar size={18} /></div>
                        <span className="text-xs font-bold text-slate-400 uppercase">Models in Shop</span>
                    </div>
                    <p className="text-2xl font-black text-slate-900">{products.length}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass-card p-8 bg-white">
                    <h3 className="text-xl font-black text-slate-900 mb-1">Monthly Revenue</h3>
                    <p className="text-sm text-slate-500 mb-6">Revenue from all shoe sales by month</p>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    formatter={(val: number) => [formatINR(val), 'Revenue']}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Units Sold Chart + Top Sellers */}
                <div className="space-y-6">
                    <div className="glass-card p-6 bg-white">
                        <h3 className="font-black text-slate-900 mb-4">Units Sold by Month</h3>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                    <Bar dataKey="units" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pairs" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-6 bg-white">
                        <h3 className="font-black text-slate-900 mb-4">Top Sellers (Fastest Moving)</h3>
                        <div className="space-y-3">
                            {topSellers.map((p, i) => (
                                <div key={p.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-black text-slate-300">#{i + 1}</span>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                            <p className="text-[10px] font-bold text-blue-600 uppercase">{p.brand}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-500">{p.inventoryLevel} left</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
