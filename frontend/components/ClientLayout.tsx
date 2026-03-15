"use client";
import Sidebar from '@/components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem('token');
        if (!token && !['/login', '/register'].includes(pathname)) {
            router.push('/login');
        }
    }, [pathname, router]);

    const isAuthPage = ['/login', '/register'].includes(pathname);

    // Prevent flash of unstyled content during hydration
    if (!mounted) {
        return <div className="bg-slate-50 min-h-screen"></div>;
    }

    return (
        <>
            {isAuthPage ? (
                <main className="min-h-screen">
                    {children}
                </main>
            ) : (
                <div className="flex bg-slate-50 min-h-screen">
                    <Sidebar />
                    <main className="flex-1 ml-64 min-h-screen">
                        {children}
                    </main>
                </div>
            )}
        </>
    );
}
