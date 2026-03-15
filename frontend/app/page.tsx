"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem("token");
        router.push("/login");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl mb-4"></div>
                <p className="text-slate-500 font-medium">Loading AI Intelligence...</p>
            </div>
        </div>
    );
}
