"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    BarChart3,
    TrendingUp,
    Globe,
    Settings,
    LogOut,
    Boxes,
    BrainCircuit,
    MessageSquare
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Shoes', href: '/products', icon: Package },
    { label: 'Stock Inventory', href: '/inventory', icon: Boxes },
    { label: 'Sales Analytics', href: '/sales', icon: BarChart3 },
    { label: 'Market Prices', href: '/competitors', icon: Globe },
    { label: 'Price Predictions', href: '/recommendations', icon: BrainCircuit },
    { label: 'AI Business Advisor', href: '/ai-assistant', icon: MessageSquare },
    { label: 'Admin & Team', href: '/admin', icon: Settings },
];

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-slate-200 flex flex-col z-40">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 text-white rounded-lg">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h1 className="font-black text-slate-900 text-lg leading-none">Dynamic Pricing</h1>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">AI Inventory Management</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
