//app/products/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/productCard";
import { products } from "@/data/products";
import AdUnit from "@/components/adUnit";

export default function ProductsPage() {
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("");
    
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const categories = ["All", "Laptops", "Keyboards", "Mouse", "Headsets", "Chairs", "Tables"];
    const productsPerPage = 12;

    const filteredProducts = products.filter((p) => {
        const matchCategory = category === "All" || p.category === category;
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchSearch;
    }).sort((a, b) => {
        if (sort === "priceLowHigh") {
            return Number(a.price) - Number(b.price);
        } else if (sort === "priceHighLow") {
            return Number(b.price) - Number(a.price);
        } else if (sort === "ratingHighLow") {
            return Number(b.rating) - Number(a.rating);
        }
        return 0;
    });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                categoryRef.current &&
                !categoryRef.current.contains(event.target as Node)
            ) {
                setCategoryOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setSortOpen(false);
            }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <section>
            <h1 className="text-3xl font-bold mb-6 text-center">Our Top Picks</h1>

            {/* Search Input */}
            <div className="flex justify-center mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setCurrentPage(1);
                    }}
                    className="w-full max-w-md px-4 py-2 bg-white text-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filter + Sort Control Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

                {/* Category Buttons */}
                <div ref={categoryRef} className="relative inline-block text-left">
                    <button
                        onClick={() => setCategoryOpen((prev) => !prev)}
                        className="px-4 py-2 w-44 rounded-lg text-sm text-left font-medium bg-white text-gray-800 border shadow-sm hover:bg-gray-300 transition"
                    >
                        Category ▾
                    </button>
                    {categoryOpen && (
                    <div className="absolute mt-2 w-44 bg-white border rounded-lg shadow-sm z-10">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => {
                                setCategory(c);
                                setCurrentPage(1);
                                setCategoryOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition ${
                                category === c
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100 text-gray-800"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                    </div>
                    )}
                </div>

                {/* Sorting Dropdown */}
                <div ref={sortRef} className="relative inline-block">
                    <button
                        onClick={() => setSortOpen((prev) => !prev)}
                        className="px-4 py-2 w-44 rounded-lg text-sm text-right font-medium bg-white text-gray-800 border shadow-sm hover:bg-gray-100 transition"
                    >
                        {sort ? (
                            sort === "priceLowHigh" ? "Price: Low to High"
                                : sort === "priceHighLow" ? "Price: High to Low"
                                : "Rating: High to Low"
                        ) : "Sort by"} ▾
                    </button>

                    {sortOpen && (
                    <div className="absolute mt-2 w-44 bg-white border rounded-lg shadow-lg z-10">
                        <button
                            onClick={() => { setSort(""); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        >
                            Sort by
                        </button>
                        <button
                            onClick={() => { setSort("priceLowHigh"); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        >
                            Price: Low to High
                        </button>
                        <button
                            onClick={() => { setSort("priceHighLow"); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        >
                            Price: High to Low
                        </button>
                        <button
                            onClick={() => { setSort("ratingHighLow"); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
                        >
                            Rating: High to Low
                        </button>
                    </div>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            {...p}
                            price={p.price}
                        />
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No products found.
                    </p>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 text-black rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    >
                        Prev
                    </button>
                    <span className="font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 text-black rounded-lg disabled:opacity-50 hover:bg-gray-300"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

            {/* Amazon Banner */}
            <div className="mt-12 flex justify-center">
                <a
                    href="https://www.amazon.in/tryprime?tag=setupsavvy01-21"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="IN-PRIME-1068x260.jpg"
                        alt="Amazon Prime Banner"
                        className="w-full max-w-4xl rounded-lg shadow-lg"
                    />
                </a>
            </div>
        </section>
    );
}
