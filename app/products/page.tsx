//app/products/page.tsx
"use client";

export const dynamic = "force-dynamic";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/productCard";
import { products } from "@/data/products";
import AdUnit from "@/components/adUnit";
import Pagination from "@/components/pagination";

function ProductsInner() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [sort, setSort] = useState(searchParams.get("sort") || "");
    
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    const categories = ["All", "Laptops", "Keyboards", "Mouse", "Headsets", 
                        "Webcams", "Chairs", "Tables"];
    const productsPerPage = 20;

    const cleanPrice = (price: string | number | undefined): number => {
        if (!price) return 0;
        if (typeof price === "number") return price;
        return Number(price.replace(/[^\d.-]/g, "")) || 0;
    };

    const cleanRating = (rating: number | string | undefined): number => {
        if (!rating) return 0;
        return typeof rating === "number" ? rating : Number(rating) || 0;
    };

    const filteredProducts = products
        .filter((p) => category === "All" || p.category === category)
        .sort((a, b) => {
            if (sort === "priceLowHigh") {
                return cleanPrice(a.price) - cleanPrice(b.price);
            } else if (sort === "priceHighLow") {
                return cleanPrice(b.price) - cleanPrice(a.price);
            } else if (sort === "ratingHighLow") {
                return cleanRating(b.rating) - cleanRating(a.rating);
            }
            return a.name.localeCompare(b.name);
        });

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    // sync URL with state
    useEffect(() => {
        const params = new URLSearchParams();
        if (category !== "All") params.set("category", category);
        if (sort) params.set("sort", sort);
        if (currentPage > 1) params.set("page", String(currentPage));
        router.push(`/products?${params.toString()}`);
    }, [category, sort, currentPage, router]);

    // sync currentPage with URL query parameter
    useEffect(() => {
        const page = Number(searchParams.get("page")) || 1;
        setCurrentPage(page);
    }, [searchParams]);

    // mouse click outside to close dropdowns
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
        <Suspense fallback={<div>Loading products...</div>}>
        <section className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Our Top Picks</h1>

            {/* Filter + Sort Control Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">

                {/* Category Buttons */}
                <div ref={categoryRef} className="relative inline-block text-left">
                    <button
                        onClick={() => setCategoryOpen(!categoryOpen)}
                        className="px-4 py-2 w-44 rounded-lg text-sm text-left font-medium bg-white 
                                    text-gray-800 border shadow-sm hover:bg-gray-300 transition cursor-pointer"
                    >
                        {category} ▾
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
                            className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition cursor-pointer ${
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
                        className="px-4 py-2 w-44 rounded-lg text-sm text-right font-medium bg-white 
                                    text-gray-800 border shadow-sm hover:bg-gray-100 transition cursor-pointer"
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
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                        text-gray-800 cursor-pointer"
                        >
                            Sort by
                        </button>
                        <button
                            onClick={() => { setSort("priceLowHigh"); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                        text-gray-800 cursor-pointer"
                        >
                            Price: Low to High
                        </button>
                        <button
                            onClick={() => { setSort("priceHighLow"); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                        text-gray-800 cursor-pointer"
                        >
                            Price: High to Low
                        </button>
                        <button
                            onClick={() => { setSort("ratingHighLow"); setCurrentPage(1); setSortOpen(false); }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 
                                        text-gray-800 cursor-pointer"
                        >
                            Rating: High to Low
                        </button>
                    </div>
                    )}
                </div>
            </div>

            {/* Active Filters Section */}
            <div className="flex flex-wrap gap-2 mb-4">
                {(category !== "All" || sort) && (
                    <button
                        onClick={() => {
                            setCategory("All");
                            setSort("");
                            setCurrentPage(1);
                        }}
                        className="ml-2 text-sm text-blue-600 dark:text-gray-100 cursor-pointer hover:underline"
                    >
                        Clear All
                    </button>
                )}

                {category !== "All" && (
                <span className="flex items-center text-gray-700 bg-gray-200 px-3 py-2 
                                rounded-full text-sm">
                    Category: {category}
                    <button
                        onClick={() => setCategory("All")}
                        className="ml-2 text-gray-600 hover:text-red-600 cursor-pointer"
                    >
                        ✕
                    </button>
                </span>
                )}

                {sort && (
                <span className="flex items-center text-gray-700 bg-gray-200 px-3 py-2 
                                rounded-full text-sm">
                    Sort: {sort === "priceLowHigh" ? "Price ↑" : 
                            sort === "priceHighLow" ? "Price ↓" : "Rating ↓"}
                    <button
                        onClick={() => setSort("")}
                        className="ml-2 text-gray-600 hover:text-red-600 cursor-pointer"
                    >
                        ✕
                    </button>
                </span>
                )}
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                basePath="/product" 
                onPageChange={setCurrentPage}
            />

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

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductsInner />
    </Suspense>
  );
}



