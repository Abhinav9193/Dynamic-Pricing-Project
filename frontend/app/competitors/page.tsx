"use client";
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Globe, ExternalLink, AlertCircle, Zap } from 'lucide-react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { motion } from 'framer-motion';

const CompetitorTracker = () => {
    const [competitorData, setCompetitorData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/products/all-competitors');
                setCompetitorData(res.data || []);
            } catch (err) {
                console.error("Error fetching competitor data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const cheaperCount = competitorData.reduce((count, item) => {
        const cheaper = (item.competitors || []).filter((c: any) => c.price < item.ourPrice);
        return count + cheaper.length;
    }, 0);

    const pricierCount = competitorData.reduce((count, item) => {
        const pricier = (item.competitors || []).filter((c: any) => c.price > item.ourPrice);
        return count + pricier.length;
    }, 0);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Market Price Comparison</h1>
                <p className="text-slate-500 mt-1">Compare your shop prices with Nike Store, Myntra, Ajio, Amazon & Flipkart</p>
            </header>

            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Cheaper Elsewhere</p>
                        <p className="text-2xl font-black text-red-600">{cheaperCount} cases</p>
                        <p className="text-xs text-slate-400">Competitors are undercutting you</p>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">You Are Cheaper</p>
                        <p className="text-2xl font-black text-emerald-600">{pricierCount} cases</p>
                        <p className="text-xs text-slate-400">Room to increase your price</p>
                    </div>
                </div>
                <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Insight</span>
                    </div>
                    <p className="font-bold">
                        {cheaperCount > pricierCount
                            ? "Several competitors are cheaper. Consider adjusting prices or running promotions."
                            : "Your pricing is competitive! You have room to increase margins on some models."}
                    </p>
                </div>
            </div>

            {/* Product-wise comparison */}
            <div className="space-y-4">
                {competitorData.map((item, idx) => (
                    <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card bg-white p-6"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* Product Info */}
                            <div className="flex items-center gap-4 lg:w-1/4">
                                <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 flex-shrink-0">
                                    <img src={item.imageUrl} className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-blue-600 uppercase">{item.brand}</p>
                                    <h3 className="text-lg font-bold text-slate-900">{item.productName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm font-black text-slate-900">{formatINR(item.ourPrice)}</span>
                                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded text-[10px] font-bold">YOUR PRICE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Competitor Grid */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {(item.competitors || []).map((comp: any, cidx: number) => {
                                    const diff = ((comp.price - item.ourPrice) / item.ourPrice * 100);
                                    const isHigher = comp.price > item.ourPrice;
                                    return (
                                        <div key={cidx} className="p-4 rounded-xl bg-slate-50 border-2 border-transparent hover:border-blue-100 transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="text-xs font-bold text-slate-500">{comp.name}</p>
                                                <ExternalLink size={12} className="text-slate-300" />
                                            </div>
                                            <p className="text-xl font-black text-slate-800">{formatINR(comp.price)}</p>
                                            <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${isHigher ? 'text-emerald-500' : 'text-red-500'}`}>
                                                {isHigher ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                <span>{isHigher ? '+' : ''}{diff.toFixed(1)}% vs you</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {(item.competitors || []).length === 0 && (
                                    <p className="text-sm text-slate-400 col-span-3">No competitor data available</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default CompetitorTracker;
