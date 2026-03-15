"use client";
import { useEffect, useState } from 'react';
import { BrainCircuit, Sparkles, ChevronRight, Zap, Target, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { formatINR } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Recommendations = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [monthlySales, setMonthlySales] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [targetMonth, setTargetMonth] = useState<number>(new Date().getMonth() + 1);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data || []);
                if (res.data?.length > 0) setSelectedProduct(res.data[0]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProducts();
    }, []);

    // Fetch monthly sales when product changes
    useEffect(() => {
        if (!selectedProduct) return;
        const fetchMonthlySales = async () => {
            try {
                const res = await api.get(`/products/${selectedProduct.id}/monthly-sales`);
                setMonthlySales(res.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchMonthlySales();
        setRecommendation(null);
    }, [selectedProduct?.id]);

    const fetchRecommendation = async () => {
        if (!selectedProduct) return;
        setLoading(true);
        try {
            const res = await api.post(`/products/${selectedProduct.id}/recommend?month=${targetMonth}`);
            setRecommendation(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to get recommendation. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    // Generate monthly price suggestions based on sales data
    const monthlyPriceSuggestions = monthlySales.map((m: any) => {
        const basePrice = selectedProduct?.currentPrice || 0;
        // Higher demand months = higher price, lower demand = discount
        const maxUnits = Math.max(...monthlySales.map((x: any) => x.units || 1));
        const demandRatio = (m.units || 0) / (maxUnits || 1);
        let suggestedPrice = basePrice;
        if (demandRatio > 0.7) suggestedPrice = basePrice * 1.08; // High demand: +8%
        else if (demandRatio > 0.4) suggestedPrice = basePrice * 1.0; // Normal
        else suggestedPrice = basePrice * 0.92; // Low demand: -8% discount
        return {
            ...m,
            suggestedPrice: Math.round(suggestedPrice),
            currentPrice: basePrice
        };
    });

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header className="max-w-6xl mx-auto w-full">
                <div className="flex items-center space-x-4 mb-2">
                    <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                        <Zap size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Price Predictions</h1>
                        <p className="text-slate-500 font-medium">AI suggests optimal prices for each month based on demand patterns</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
                {/* Product List */}
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Select a Shoe</h3>
                    <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-2">
                        {products.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setSelectedProduct(p)}
                                className={`w-full flex items-center p-3 rounded-xl border-2 transition-all ${selectedProduct?.id === p.id
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100'
                                    : 'bg-white border-slate-100 text-slate-700 hover:border-blue-200'
                                    }`}
                            >
                                <div className="w-10 h-10 rounded-lg bg-slate-100 p-1.5 mr-3 flex-shrink-0">
                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <div className={`text-[10px] font-bold uppercase ${selectedProduct?.id === p.id ? 'text-blue-200' : 'text-blue-600'}`}>{p.brand}</div>
                                    <div className="font-bold text-sm truncate">{p.name}</div>
                                    <div className={`text-xs ${selectedProduct?.id === p.id ? 'text-blue-200' : 'text-slate-400'}`}>{formatINR(p.currentPrice)}</div>
                                </div>
                                <ChevronRight size={16} className="flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Analysis Area */}
                <div className="lg:col-span-8 space-y-6">
                    {selectedProduct && (
                        <>
                            {/* Product Header */}
                            <div className="glass-card p-6 bg-white">
                                <div className="flex gap-6 items-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-2xl p-3">
                                        <img src={selectedProduct.imageUrl} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-blue-600 uppercase">{selectedProduct.brand} • {selectedProduct.category}</p>
                                        <h2 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h2>
                                        <div className="flex gap-6 mt-2">
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Current Price</p>
                                                <p className="text-lg font-black text-slate-900">{formatINR(selectedProduct.currentPrice)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Cost</p>
                                                <p className="text-lg font-black text-slate-900">{formatINR(selectedProduct.basePrice)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 uppercase font-bold">Stock</p>
                                                <p className="text-lg font-black text-slate-900">{selectedProduct.inventoryLevel} pairs</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Monthly Sales Chart */}
                            <div className="glass-card p-6 bg-white shadow-sm border border-slate-100 rounded-3xl">
                                <h3 className="text-lg font-black text-slate-900 mb-1">Previous Sales History</h3>
                                <p className="text-sm text-slate-500 mb-4">Historical sales pattern over time</p>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={monthlySales}>
                                            <defs>
                                                <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgb(0 0 0 / 0.1)' }} />
                                            <Area type="monotone" dataKey="units" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorUnits)" name="Units Sold" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* AI Recommendation Button */}
                            {!recommendation ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                        <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Target Prediction Month:</label>
                                        <select 
                                            value={targetMonth} 
                                            onChange={(e) => setTargetMonth(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700 bg-slate-50"
                                        >
                                            <option value={1}>January</option>
                                            <option value={2}>February</option>
                                            <option value={3}>March</option>
                                            <option value={4}>April</option>
                                            <option value={5}>May</option>
                                            <option value={6}>June</option>
                                            <option value={7}>July</option>
                                            <option value={8}>August</option>
                                            <option value={9}>September</option>
                                            <option value={10}>October</option>
                                            <option value={11}>November</option>
                                            <option value={12}>December</option>
                                        </select>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={fetchRecommendation}
                                        disabled={loading}
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-black transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                <span>Analyzing market patterns...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <BrainCircuit size={24} />
                                                <span className="text-lg">Generate AI Price Recommendation</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-1 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-2xl shadow-blue-100"
                                    >
                                        <div className="bg-white rounded-xl p-8">
                                            <div className="flex items-center gap-2 text-blue-600 mb-6">
                                                <Sparkles size={20} />
                                                <span className="text-sm font-black uppercase tracking-widest">AI Recommendation</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Recommended Price</p>
                                                    <p className="text-4xl font-black text-blue-600">{formatINR(recommendation.recommendedPrice)}</p>
                                                    <p className={`text-sm font-bold mt-1 ${recommendation.recommendedPrice > selectedProduct.currentPrice ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                        {((recommendation.recommendedPrice - selectedProduct.currentPrice) / selectedProduct.currentPrice * 100).toFixed(1)}% adjustment
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Predicted Demand</p>
                                                    <p className="text-4xl font-black text-slate-900">{recommendation.predictedDemand}</p>
                                                    <p className="text-xs text-slate-400">pairs in next 30 days</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase font-bold">Expected Profit</p>
                                                    <p className="text-4xl font-black text-emerald-600">
                                                        {formatINR((recommendation.recommendedPrice - selectedProduct.basePrice) * recommendation.predictedDemand)}
                                                    </p>
                                                    <p className="text-xs text-slate-400">estimated for targeted month</p>
                                                </div>
                                            </div>

                                            {recommendation.aiAnalysis && (
                                                <div className="mt-8 p-6 bg-slate-50/80 rounded-2xl border border-slate-100">
                                                    <div className="flex items-center gap-2 mb-3 text-slate-800">
                                                        <BrainCircuit size={18} className="text-purple-500" />
                                                        <h4 className="font-bold">Strategic Insights</h4>
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed text-sm">
                                                        {recommendation.aiAnalysis}
                                                    </p>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setRecommendation(null)}
                                                className="mt-6 px-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommendations;
