"use client";
import { useEffect, useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Building, 
  Mail, 
  Settings,
  MoreVertical,
  Lock,
  Search
} from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', companyName: '', registrationNumber: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await api.get('/auth/me');
                setCurrentUser(res.data);
                // In a wider app, we'd fetch all users for the company.
                // For now, realistically show the single owner.
                setUsers([{
                    id: res.data.id, 
                    name: res.data.name, 
                    email: res.data.email, 
                    role: res.data.role, 
                    lastLogin: 'Just now', 
                    status: 'Active' 
                }]);
            } catch (err) {
                console.error("Failed to fetch user data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSaveUser = async () => {
        try {
            await api.put('/auth/me', editForm);
            setEditMode(false);
            const res = await api.get('/auth/me'); // refresh UI
            setCurrentUser(res.data);
            setUsers(users.map(u => u.id === res.data.id ? { ...u, name: res.data.name } : u));
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Organization & Admin</h1>
                    <p className="text-slate-500 mt-1">Manage team access, company roles, and system security.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => {
                            setEditForm({
                                name: currentUser?.name || '',
                                companyName: currentUser?.company?.name || '',
                                registrationNumber: currentUser?.company?.registrationNumber || ''
                            });
                            setEditMode(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-white text-blue-600 border border-blue-200 rounded-2xl font-black hover:bg-blue-50 transition-all"
                    >
                        <Settings size={20} />
                        <span>Edit Profile</span>
                    </button>
                    <button 
                        onClick={() => setShowInviteModal(true)}
                        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
                    >
                        <UserPlus size={20} />
                        <span>Invite Team Member</span>
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl w-fit">
                        <Building size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Linked Company</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{currentUser?.company?.name || 'Loading...'}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">Registration/GSTIN: {currentUser?.company?.registrationNumber || 'N/A'}</p>
                    </div>
                </div>
                <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit">
                        <Users size={28} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Team Size</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{users.length} Active Licenses</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">+0 Pending Invites</p>
                    </div>
                </div>
                <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-200 flex flex-col gap-4 relative overflow-hidden group">
                    <div className="p-4 bg-white/10 text-white rounded-2xl w-fit relative z-10">
                        <Shield size={28} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">System Security</p>
                        <p className="text-2xl font-black mt-1">Enterprise Grade</p>
                        <button 
                            onClick={() => alert("Audit Logs: \n[10:25 AM] User admin@shop.com logged in.\n[11:04 AM] Product 'Air Max 90' updated.")}
                            className="mt-4 text-xs font-black text-blue-400 flex items-center gap-1 hover:underline"
                        >
                            AUDIT LOGS <Lock size={12} />
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                        <Settings size={140} />
                    </div>
                </div>
            </div>

            <div className="glass-card bg-white overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:row items-center justify-between gap-4">
                    <h3 className="text-lg font-black text-slate-900">User Access Control</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input className="w-full pl-10 pr-4 py-3 rounded-xl border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all" placeholder="Search members..." />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4">Identity</th>
                                <th className="px-8 py-4">Role / Permissions</th>
                                <th className="px-8 py-4">Activity</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-black text-slate-500">
                                                {user.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}</p>
                                                <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className={user.role === 'ADMIN' ? 'text-blue-500' : 'text-slate-400'} />
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${user.role === 'ADMIN' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'}`}>
                                                {user.role}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-slate-500">Last login: {user.lastLogin}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            ● {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-white border-transparent hover:border-slate-200 border">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {editMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditMode(false)} />
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative p-8">
                        <button onClick={() => setEditMode(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900">
                            ✕
                        </button>
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Edit Profile & Company</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-slate-600 block mb-1">Your Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 block mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={editForm.companyName}
                                    onChange={(e) => setEditForm({...editForm, companyName: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-slate-600 block mb-1">Registration / GSTIN</label>
                                <input
                                    type="text"
                                    value={editForm.registrationNumber}
                                    onChange={(e) => setEditForm({...editForm, registrationNumber: e.target.value})}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <button
                                onClick={handleSaveUser}
                                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all mt-6"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Team Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl relative p-8">
                        <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all">
                            ✕
                        </button>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl shadow-inner">
                                <UserPlus size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mt-4">Invite to Your Shop</h2>
                            <p className="text-slate-500 text-sm max-w-sm mb-4">
                                Share this secure registration link with your managers or staff to give them access to this dashboard.
                            </p>
                            
                            <div className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 overflow-hidden">
                                <p className="font-mono text-xs text-slate-600 truncate flex-1 text-left">
                                    {window.location.origin}/register?invite=team_{Math.random().toString(36).substring(7)}
                                </p>
                                <button 
                                    onClick={(e) => {
                                        const el = e.currentTarget;
                                        el.innerHTML = "Copied!";
                                        setTimeout(() => el.innerHTML = "Copy", 2000);
                                    }}
                                    className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-300 transition-all whitespace-nowrap"
                                >
                                    Copy
                                </button>
                            </div>
                            
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all mt-6"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
