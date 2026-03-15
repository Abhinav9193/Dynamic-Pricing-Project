"use client";
import { useEffect, useState } from 'react';
import { Package, Search, ArrowRight, AlertTriangle, ChevronRight, CheckCircle2, Save, Minus, Plus } from 'lucide-react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products');
                setProducts(res.data || []);
            } catch (err) {
                console.error("Error fetching inventory", err);
            }
        };
        fetchProducts();
    }, []);

    const [editMode, setEditMode] = useState(false);
    const [editStock, setEditStock] = useState(0);
    const [editInfoMode, setEditInfoMode] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    const handleSelectProduct = (p: any) => {
        setSelectedProduct(p);
        setEditStock(p.inventoryLevel);
        setEditMode(false);
    };

    const handleSaveStock = async () => {
        if (!selectedProduct) return;
        try {
            const updatedProduct = { ...selectedProduct, inventoryLevel: editStock };
            await api.put(`/products/${selectedProduct.id}`, updatedProduct);
            
            // update local state
            setProducts(products.map(p => p.id === selectedProduct.id ? updatedProduct : p));
            setSelectedProduct(updatedProduct);
            setEditMode(false);
        } catch (err) {
            console.error("Failed to update stock", err);
            alert("Error updating stock");
        }
    };

    const handleSaveInfo = async () => {
        try {
            await api.put(`/products/${editForm.id}`, editForm);
            setProducts(products.map(p => p.id === editForm.id ? editForm : p));
            setSelectedProduct(editForm);
            setEditInfoMode(false);
        } catch (err) {
            console.error("Error saving edits", err);
            alert("Failed to save changes.");
        }
    };

    const filteredInventory = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPairs = products.reduce((sum, p) => sum + (p.inventoryLevel || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + (p.currentPrice * p.inventoryLevel || 0), 0);
    const lowStockItems = products.filter(p => p.inventoryLevel < 30);

    const getStockStatus = (level: number) => {
        if (level < 15) return { label: 'Critical', color: 'bg-red-100 text-red-700', bar: 'bg-red-500' };
        if (level < 30) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', bar: 'bg-amber-500' };
        if (level < 60) return { label: 'Normal', color: 'bg-blue-100 text-blue-700', bar: 'bg-blue-500' };
        return { label: 'Well Stocked', color: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-500' };
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Stock Inventory</h1>
                <p className="text-slate-500 mt-1">Track how many pairs of each shoe you have in your shop</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 bg-white flex items-center gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Pairs in Shop</p>
                        <p className="text-2xl font-black text-slate-900">{totalPairs}</p>
                    </div>
                </div>
                <div className="glass-card p-6 bg-white flex items-center gap-4">
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Total Stock Value</p>
                        <p className="text-2xl font-black text-slate-900">{formatINR(totalValue)}</p>
                    </div>
                </div>
                <div className="glass-card p-6 bg-white flex items-center gap-4">
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase">Low Stock Alert</p>
                        <p className="text-2xl font-black text-red-600">{lowStockItems.length} shoes</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="glass-card bg-white">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium"
                            placeholder="Search shoes..."
                        />
                    </div>
                </div>

                {/* Stock Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[11px] uppercase text-slate-400 font-bold tracking-wider border-b border-slate-100 bg-slate-50/50">
                                <th className="px-6 py-4">Shoe</th>
                                <th className="px-6 py-4">Stock Level</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Unit Price</th>
                                <th className="px-6 py-4">Stock Value</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInventory.map((p) => {
                                const status = getStockStatus(p.inventoryLevel);
                                return (
                                    <tr
                                        key={p.id}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                        onClick={() => handleSelectProduct(p)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-lg flex-shrink-0 p-1.5">
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                                                    <div className="text-xs text-slate-400">{p.brand} • {p.size} • {p.color}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5 w-36">
                                                <span className="text-sm font-bold text-slate-900">{p.inventoryLevel} pairs</span>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${status.bar}`}
                                                        style={{ width: `${Math.min((p.inventoryLevel / 150) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                            {formatINR(p.currentPrice)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-black text-slate-900">
                                            {formatINR(p.currentPrice * p.inventoryLevel)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-600 transition-all" />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="mb-4 p-2 bg-white rounded-lg shadow-sm text-slate-400 hover:text-slate-900"
                                >
                                    <ArrowRight className="rotate-180" size={20} />
                                </button>
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-20 bg-white rounded-2xl p-3 shadow-sm border">
                                        <img src={selectedProduct.imageUrl} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-blue-600 uppercase">{selectedProduct.brand}</p>
                                        <h2 className="text-2xl font-black text-slate-900">{selectedProduct.name}</h2>
                                        <p className="text-xs text-slate-400 mt-1">{selectedProduct.size} • {selectedProduct.color}</p>
                                    </div>
                                    <button 
                                        onClick={() => { setEditForm(selectedProduct); setEditInfoMode(true); }}
                                        className="ml-auto p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs"
                                    >
                                        EDIT INFO
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Adjust Current Inventory</p>
                                            <Package size={18} className="text-blue-400" />
                                        </div>
                                        
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex items-center gap-4 bg-white/10 p-2 rounded-2xl">
                                                <button 
                                                    onClick={() => setEditStock(Math.max(0, editStock - 1))}
                                                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                                                >
                                                    <Minus size={20} />
                                                </button>
                                                <input 
                                                    type="number" 
                                                    value={editStock} 
                                                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                                    className="w-20 bg-transparent text-center text-3xl font-black text-white outline-none border-none"
                                                />
                                                <button 
                                                    onClick={() => setEditStock(editStock + 1)}
                                                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
                                                >
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                            
                                            <button 
                                                onClick={handleSaveStock}
                                                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                                            >
                                                <Save size={18} /> SAVE CHANGES
                                            </button>
                                        </div>
                                        
                                        <p className="mt-4 text-[10px] text-slate-500 font-bold uppercase text-center italic">
                                            Last reported stock: {selectedProduct.inventoryLevel} pairs
                                        </p>
                                    </div>

                                    <div className="p-4 bg-emerald-50 rounded-2xl">
                                        <p className="text-[10px] font-bold text-emerald-500 uppercase">Current Adjusting Value</p>
                                        <p className="text-xl font-black text-emerald-900">{formatINR(selectedProduct.currentPrice * editStock)}</p>
                                        <p className="text-xs text-emerald-600">at current selling price</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="font-bold text-slate-900">Pricing</h3>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm text-slate-600">Cost Price</span>
                                        <span className="font-bold text-slate-900">{formatINR(selectedProduct.basePrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                        <span className="text-sm text-slate-600">Selling Price</span>
                                        <span className="font-bold text-slate-900">{formatINR(selectedProduct.currentPrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                                        <span className="text-sm text-emerald-700">Profit per Pair</span>
                                        <span className="font-bold text-emerald-700">{formatINR(selectedProduct.currentPrice - selectedProduct.basePrice)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                                        <span className="text-sm text-emerald-700">Margin</span>
                                        <span className="font-bold text-emerald-700">
                                            {((selectedProduct.currentPrice - selectedProduct.basePrice) / selectedProduct.currentPrice * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-500 leading-relaxed">{selectedProduct.description}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Product Info Modal */}
            <AnimatePresence>
                {editInfoMode && editForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setEditInfoMode(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative p-8 max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setEditInfoMode(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900">
                                <Plus className="rotate-45" size={20} />
                            </button>
                            <h2 className="text-2xl font-black text-slate-900 mb-6">Edit Product Parameters</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-600 block mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-600 block mb-1">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none min-h-[80px]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Sell Price ₹</label>
                                        <input
                                            type="number"
                                            value={editForm.currentPrice || ''}
                                            onChange={(e) => setEditForm({ ...editForm, currentPrice: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Cost Price ₹</label>
                                        <input
                                            type="number"
                                            value={editForm.basePrice || ''}
                                            onChange={(e) => setEditForm({ ...editForm, basePrice: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleSaveInfo}
                                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all mt-4 flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Inventory;
