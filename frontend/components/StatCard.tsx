"use client";
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color: string;
}

const colorMap: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
};

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => {
    const colors = colorMap[color] || colorMap.blue;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="glass-card p-6 bg-white"
        >
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colors.bg} ${colors.text}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </motion.div>
    );
};

export default StatCard;
