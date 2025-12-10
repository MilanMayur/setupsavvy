//components/productFilters.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ProductFiltersProps = {
    category: string;
    sort: string;
    categories: string[];
};

export default function ProductFilters({ category, sort, categories }: ProductFiltersProps) {
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);
    const [internalOpen, setInternalOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Internal components subcategories
    const internalComponents = ["Motherboard", "Processor", "RAM", "SSD", 
                                "GPU", "PSU", "CPU Cooler", "Cooling Fan"];
    
    // Check if there's an active search query
    const searchQuery = searchParams.get("q");

    // Close dropdown on clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setCategoryOpen(false);
                setInternalOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function selectCategory(c: string) {
        setCategoryOpen(false);
        setInternalOpen(false);
        if (c !== category) {
            const ids = searchParams.get("ids");
            const q = searchParams.get("q");
            const parts = [] as string[];
            if (c && c !== "All") parts.push(`category=${encodeURIComponent(c)}`);
            if (sort) parts.push(`sort=${encodeURIComponent(sort)}`);
            parts.push(`page=1`);
            if (ids) parts.push(`ids=${encodeURIComponent(ids)}`);
            if (q) parts.push(`q=${encodeURIComponent(q)}`);
            router.push(`/products?${parts.join("&")}`);
        }
    }

    function selectSort(s: string) {
        setSortOpen(false);
        if (s !== sort) {
            const ids = searchParams.get("ids");
            const q = searchParams.get("q");
            const parts = [] as string[];
            if (category && category !== "All") parts.push(`category=${encodeURIComponent(category)}`);
            if (s) parts.push(`sort=${encodeURIComponent(s)}`);
            parts.push(`page=1`);
            if (ids) parts.push(`ids=${encodeURIComponent(ids)}`);
            if (q) parts.push(`q=${encodeURIComponent(q)}`);
            router.push(`/products?${parts.join("&")}`);
        }
    }

    function clearFilters() {
        setCategoryOpen(false);
        setSortOpen(false);
        router.push(`/products`);
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            {/* Category dropdown */}
            <div ref={categoryRef} className="relative inline-block text-left">
                <button
                    onClick={() => {
                        setCategoryOpen((prev) => !prev);
                        setInternalOpen(false);
                    }}
                    className="px-4 py-2 w-44 rounded-lg text-sm text-left font-medium bg-white 
                    text-gray-800 border shadow-sm hover:bg-gray-300 transition cursor-pointer"
                >
                    {category} ▾
                </button>
                {categoryOpen && (
                <div className="absolute mt-2 w-44 bg-white border rounded-lg shadow-sm z-10">
                    {categories.map((c) => (
                        c === "Internal Components" ? (
                            <div
                                key={c}
                                className="relative group"
                                onMouseLeave={() => setInternalOpen(false)}
                            >
                                <button
                                    onClick={() => setInternalOpen(!internalOpen)}
                                    onMouseEnter={() => setInternalOpen(true)}
                                    className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition
                                        cursor-pointer hover:bg-gray-100 text-gray-800`}
                                >
                                    {c}~
                                </button>
                                {internalOpen && (
                                    <div 
                                        className="absolute left-full top-0 ml-1 w-44 bg-white border rounded-lg shadow-lg z-20"
                                        onMouseEnter={() => setInternalOpen(true)}
                                    >
                                        {internalComponents.map((ic) => (
                                            <button
                                                key={ic}
                                                onClick={() => selectCategory(ic)}
                                                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition
                                                    cursor-pointer ${
                                                    category === ic ? "bg-blue-600 text-white" 
                                                                   : "hover:bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {ic}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                key={c}
                                onClick={() => selectCategory(c)}
                                onMouseEnter={() => setInternalOpen(false)}
                                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition
                                            cursor-pointer ${
                                    category === c ? "bg-blue-600 text-white" 
                                                   : "hover:bg-gray-100 text-gray-800"
                                }`}
                            >
                                {c}
                            </button>
                        )
                    ))}
                </div>
                )}
            </div>

            {/* Sort dropdown */}
            <div ref={sortRef} className="relative inline-block">
                <button
                    onClick={() => setSortOpen((prev) => !prev)}
                    className="px-4 py-2 w-44 rounded-lg text-sm text-left font-medium bg-white 
                    text-gray-800 border shadow-sm hover:bg-gray-100 transition cursor-pointer"
                >
                    {sort
                        ? sort === "priceLowHigh"
                            ? "Price: Low to High"
                            : sort === "priceHighLow"
                            ? "Price: High to Low"
                            : "Rating: High to Low"
                            : "Sort by"}{" "}
                        ▾
                </button>
                {sortOpen && (
                <div className="absolute mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                    <button
                        onClick={() => selectSort("")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                    text-gray-800 cursor-pointer"
                    >
                        Sort by
                    </button>
                    <button
                        onClick={() => selectSort("priceLowHigh")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                    text-gray-800 cursor-pointer"
                    >
                        Price: Low to High
                    </button>
                    <button
                        onClick={() => selectSort("priceHighLow")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                    text-gray-800 cursor-pointer"
                    >
                        Price: High to Low
                    </button>
                    <button
                        onClick={() => selectSort("ratingHighLow")}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                    text-gray-800 cursor-pointer"
                    >
                        Rating: High to Low
                    </button>
                </div>
                )}
            </div>

            {/* Clear All button */}
            {(category !== "All" || sort || searchQuery) && (
            <button
                onClick={clearFilters}
                className="ml-2 text-sm text-blue-600 dark:text-gray-100 cursor-pointer hover:underline"
            >
                Clear All
            </button>
            )}
        </div>
    );
}
 
