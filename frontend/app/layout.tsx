import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
    title: 'Dynamic Pricing | AI Pricing Intelligence',
    description: 'AI Powered Dynamic Pricing and Business Intelligence Platform',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body suppressHydrationWarning>
                <ClientLayout>
                    {children}
                </ClientLayout>
            </body>
        </html>
    );
}
