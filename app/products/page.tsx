//app/products/page.tsx
"use client";

import { useState } from "react";
import ProductCard from "@/components/productCard";
import { products } from "@/data/products";

export default function ProductsPage() {
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const categories = ["All", "Laptops", "Chairs", "Tables", "Headsets"];
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
                    className="w-full max-w-md px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Filter + Sort Control Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                {/* Category Buttons */}
                <div className="flex gap-3 flex-wrap justify-center">
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => {
                                setCategory(c)
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                                category === c
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
                {/* Sorting Dropdown */}
                <select
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value)
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-gray-900 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Sort by</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="ratingHighLow">Rating: High to Low</option>
                </select>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                        <ProductCard
                            key={p.id}
                            {...p}
                            price={typeof p.price === "number" ? p.price.toString() : p.price}
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
