"use client";
import { useEffect, useState } from 'react';
import { Package, Plus, Search, Eye, X, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { formatINR } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND_IMAGES: Record<string, string> = {
    "Nike": "/images/shoes/nike.png",
    "Adidas": "/images/shoes/adidas.png",
    "Puma": "/images/shoes/puma.png",
    "Jordan": "/images/shoes/jordan.png",
    "Reebok": "/images/shoes/reebok.png",
    "Skechers": "/images/shoes/skechers.png",
};

const Products = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '', brand: 'Nike', customBrand: '', category: 'Casual', description: '',
        customImageUrl: '', size: 'UK 9', color: '',
        basePrice: 0, currentPrice: 0, inventoryLevel: 0
    });
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data || []);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const finalBrand = newProduct.brand === 'Other' ? newProduct.customBrand : newProduct.brand;
            const productToSave = {
                ...newProduct,
                brand: finalBrand,
                imageUrl: newProduct.customImageUrl.trim() !== '' 
                    ? newProduct.customImageUrl 
                    : (BRAND_IMAGES[finalBrand] || '/images/shoes/nike.png')
            };
            await api.post('/products', productToSave);
            setShowAddForm(false);
            setNewProduct({
                name: '', brand: 'Nike', customBrand: '', category: 'Casual', description: '',
                customImageUrl: '', size: 'UK 9', color: '',
                basePrice: 0, currentPrice: 0, inventoryLevel: 0
            });
            fetchProducts();
        } catch (err) {
            console.error("Error adding product", err);
            alert("Failed to add product. Make sure backend is running.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Remove this shoe from inventory?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
            setSelectedProduct(null);
        } catch (err) {
            console.error("Error deleting", err);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (isEdit) {
                    setEditForm({ ...editForm, imageUrl: base64String });
                } else {
                    setNewProduct({ ...newProduct, customImageUrl: base64String });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveEdit = async () => {
        try {
            await api.put(`/products/${editForm.id}`, editForm);
            setEditMode(false);
            setSelectedProduct(editForm);
            fetchProducts();
        } catch (err) {
            console.error("Error saving edits", err);
            alert("Failed to save changes.");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Shoe Collection</h1>
                    <p className="text-slate-500 mt-1">{products.length} models in your shop inventory</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                    <Plus size={20} />
                    <span>Add New Shoe</span>
                </button>
            </header>

            {/* Search */}
            <div className="glass-card">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
                            placeholder="Search by model or brand..."
                        />
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredProducts.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-slate-400">
                            <Package size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="font-medium">No products found. Add your first shoe!</p>
                        </div>
                    )}
                    {filteredProducts.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                            onClick={() => setSelectedProduct(p)}
                        >
                            <div className="h-48 bg-slate-100 relative">
                                    <img
                                        src={p.imageUrl || '/images/shoes/nike.png'}
                                        alt={p.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                        onError={(e: any) => { e.target.src = '/images/shoes/nike.png'; }}
                                    />
                                    <div className="absolute top-3 right-3 px-2 py-1 bg-white/80 backdrop-blur rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                                    {p.category}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{p.brand}</p>
                                        <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-slate-900">{formatINR(p.currentPrice)}</p>
                                        <p className="text-xs text-slate-400">Cost: {formatINR(p.basePrice)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${p.inventoryLevel < 30 ? 'bg-red-50 text-red-600' : p.inventoryLevel < 50 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                                        Stock: {p.inventoryLevel} pairs
                                    </span>
                                    <span className="text-xs text-slate-400">{p.size} • {p.color}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Product Detail Modal */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
                        >
                            <div className="md:w-1/2 bg-slate-50 p-8 flex items-center justify-center">
                                <img src={selectedProduct.imageUrl || '/images/shoes/nike.png'} 
                                     className="max-h-80 object-contain" 
                                     onError={(e: any) => { e.target.src = '/images/shoes/nike.png'; }}
                                />
                            </div>
                            <div className="md:w-1/2 p-8 space-y-5">
                                <div>
                                    <p className="text-sm font-bold text-blue-600 uppercase">{selectedProduct.brand}</p>
                                    <h2 className="text-3xl font-black text-slate-900">{selectedProduct.name}</h2>
                                    <p className="text-slate-500 mt-2 leading-relaxed text-sm">{selectedProduct.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Size</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedProduct.size}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Color</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedProduct.color}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Cost Price</p>
                                        <p className="text-lg font-bold text-slate-900">{formatINR(selectedProduct.basePrice)}</p>
                                    </div>
                                    <div className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">In Stock</p>
                                        <p className="text-lg font-bold text-slate-900">{selectedProduct.inventoryLevel} pairs</p>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5">
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400 font-medium">Selling Price</p>
                                            <p className="text-4xl font-black text-slate-900">{formatINR(selectedProduct.currentPrice)}</p>
                                            <p className="text-xs text-emerald-600 font-bold mt-1">
                                                Margin: {((selectedProduct.currentPrice - selectedProduct.basePrice) / selectedProduct.currentPrice * 100).toFixed(1)}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => { setEditForm(selectedProduct); setEditMode(true); }}
                                        className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all text-center"
                                    >
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedProduct.id)}
                                        className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-slate-400 hover:text-slate-900 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Product Modal */}
            <AnimatePresence>
                {editMode && editForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setEditMode(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative p-8 max-h-[90vh] overflow-y-auto"
                        >
                            <button onClick={() => setEditMode(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-black text-slate-900 mb-6">Edit Shoe Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-600 block mb-1">Description</label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none min-h-[100px]"
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
                                <div>
                                    <label className="text-sm font-bold text-slate-600 block mb-1">Image Preview</label>
                                    <div className="w-full h-40 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex items-center justify-center overflow-hidden mb-3">
                                        {editForm.imageUrl ? (
                                            <img src={editForm.imageUrl} className="w-full h-full object-contain" alt="Preview" />
                                        ) : (
                                            <Package size={32} className="text-slate-300" />
                                        )}
                                    </div>
                                    <label className="text-sm font-bold text-slate-600 block mb-1">Upload New Image (Local)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, true)}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 text-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleSaveEdit}
                                    className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all mt-4"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setShowAddForm(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative p-8"
                        >
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900"
                            >
                                <X size={20} />
                            </button>

                            <h2 className="text-2xl font-black text-slate-900 mb-6">Add New Shoe</h2>

                            <form onSubmit={handleAddProduct} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Shoe Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.name}
                                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="e.g. Air Max 90"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Brand *</label>
                                        <select
                                            value={newProduct.brand}
                                            onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                        >
                                            <option>Nike</option>
                                            <option>Adidas</option>
                                            <option>Puma</option>
                                            <option>Jordan</option>
                                            <option>Reebok</option>
                                            <option>Skechers</option>
                                            <option>New Balance</option>
                                            <option>Woodland</option>
                                            <option>Bata</option>
                                            <option>Red Tape</option>
                                            <option>Campus</option>
                                            <option value="Other">Other (Specify Custom Brand)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {newProduct.brand === 'Other' && (
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Custom Brand Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newProduct.customBrand}
                                            onChange={(e) => setNewProduct({ ...newProduct, customBrand: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none bg-blue-50"
                                            placeholder="e.g. Asics"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Category</label>
                                        <select
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                        >
                                            <option>Casual</option>
                                            <option>Running</option>
                                            <option>Basketball</option>
                                            <option>Walking</option>
                                            <option>Formal</option>
                                            <option>Training</option>
                                            <option>Lifestyle</option>
                                            <option>Sports</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Color</label>
                                        <input
                                            type="text"
                                            value={newProduct.color}
                                            onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="e.g. Black/White"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={newProduct.description}
                                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="Short description of the shoe"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Image Preview</label>
                                        <div className="w-full h-32 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden">
                                            {newProduct.customImageUrl ? (
                                                <img src={newProduct.customImageUrl} className="w-full h-full object-contain" alt="Preview" />
                                            ) : (
                                                <Package size={24} className="text-slate-300" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Item Image URL (Optional)</label>
                                        <input
                                            type="text"
                                            value={newProduct.customImageUrl.length > 500 ? "DEVICE_IMAGE_SELECTED" : newProduct.customImageUrl}
                                            onChange={(e) => {
                                                if (e.target.value !== "DEVICE_IMAGE_SELECTED") {
                                                    setNewProduct({ ...newProduct, customImageUrl: e.target.value })
                                                }
                                            }}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="https://..."
                                        />
                                        <p className="text-[10px] text-slate-400 mt-1">Leave blank to use default brand logo</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-blue-600 block mb-1">CHOOSE IMAGE FROM YOUR DEVICE</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, false)}
                                            className="w-full px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4 mt-2">
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Size</label>
                                        <select
                                            value={newProduct.size}
                                            onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                        >
                                            {['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'].map(s => (
                                                <option key={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Cost Price ₹</label>
                                        <input
                                            type="number"
                                            required
                                            value={newProduct.basePrice || ''}
                                            onChange={(e) => setNewProduct({ ...newProduct, basePrice: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="5000"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Sell Price ₹</label>
                                        <input
                                            type="number"
                                            required
                                            value={newProduct.currentPrice || ''}
                                            onChange={(e) => setNewProduct({ ...newProduct, currentPrice: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="8000"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-600 block mb-1">Stock (pairs)</label>
                                        <input
                                            type="number"
                                            required
                                            value={newProduct.inventoryLevel || ''}
                                            onChange={(e) => setNewProduct({ ...newProduct, inventoryLevel: Number(e.target.value) })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 outline-none"
                                            placeholder="50"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4"
                                >
                                    Add Shoe to Inventory
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Products;
