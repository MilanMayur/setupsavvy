//components/aiSearch.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

type Props = {
    className?: string;
    placeholder?: string;
};

export default function AISearch({ className = "", placeholder = "Search..." }: Props) {
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const queryParam = searchParams.get('q');
        setQ(queryParam || ''); 
    }, [searchParams]);



    async function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        if (!q.trim()) return;
        setLoading(true);
        setError(null);
        
        try {
            const params = new URLSearchParams();
            params.set("q", q.trim());
            
            setTimeout(() => setLoading(false), 1000);
            
            router.push(`/products?${params.toString()}`);
            
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(errorMessage);
            setLoading(false);
        }
    }    
    return (
        <div className={className}>
            <form onSubmit={handleSubmit} className="flex items-center">
                <input
                    aria-label="AI search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={placeholder}
                    className="bg-white border rounded-l-lg px-3 py-2 w-full max-w-xl placeholder-gray-500 text-gray-700"
                />
                <button
                    type="submit"
                    disabled={loading}
                    aria-label="Search"
                    className="bg-blue-600 text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 
                                disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center 
                                justify-center w-12 transition-colors"
                >
                    <Search size={18} />
                </button>
            </form>
            
            {/* Status messages below search bar */}
            {loading && (
                <div className="flex items-center justify-center gap-2 mt-3 text-blue-600">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-sm font-medium">Searching...</span>
                </div>
            )}
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        </div>
    );
}
