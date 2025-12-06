//app/products/page.tsx
import { getFilteredProducts, productsById, Product } from "@/data/products";
import runSearch from "@/lib/search";
import ProductCard from "@/components/productCard";
import AISearch from "@/components/aiSearch";
import Pagination from "@/components/pagination";
import AdUnitClient from "@/components/adUnitClient";
import ProductFilters from "@/components/productFilters";
import Image from "next/image";

type SearchParamsType = {
    page?: string;
    category?: string;
    sort?: string;
};

const categories = ["All", "Laptop", "Monitor", "Keyboard", "Mouse", "Headphone", "Webcam", 
                    "Processor", "RAM", "SSD", "Chair", "Table"];
const productsPerPage = 24;

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParamsType & { ids?: string; q?: string; noResults?: string }> }) {
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const category = params.category || "All";
    const sort = params.sort || "";
    const idsParam = params.ids || null;
    // Normalize `q` param: some clients may send spaces as '+' (form-style) or as '%20'.
    const rawQ = params.q || null;
    const queryText = rawQ ? decodeURIComponent(String(rawQ)).replace(/\+/g, " ") : null;
    const noResultsParam = params.noResults || null;
    
    // Use standard products per page for all searches
    const currentProductsPerPage = productsPerPage;

    let products: Product[] = [];
    let totalPages = 1;
    let noResults = false;

    if (queryText && !idsParam) {
        // Use shared server-side search helper when `q` is provided.
        const res = await runSearch(String(queryText));
        const ids = (res?.ids || []) as string[];
        const matched = ids.map((id) => productsById[id]).filter(Boolean);

        // sorting for search results (default: by name)
        function cleanPrice(price: string | number | undefined) {
            if (!price) return 0;
            if (typeof price === "number") return price;
            return Number(String(price).replace(/[^\d.-]/g, "")) || 0;
        }
        function cleanRating(r: number | undefined) { return r ? Number(r) : 0; }

        let sorted = matched;
        if (sort === "priceLowHigh") {
            sorted = sorted.sort((a, b) => cleanPrice(a.price) - cleanPrice(b.price));
        } else if (sort === "priceHighLow") {
            sorted = sorted.sort((a, b) => cleanPrice(b.price) - cleanPrice(a.price));
        } else if (sort === "ratingHighLow") {
            sorted = sorted.sort((a, b) => cleanRating(b.rating) - cleanRating(a.rating));
        } else {
            sorted = sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }

        totalPages = Math.max(1, Math.ceil(sorted.length / currentProductsPerPage));
        const startIndex = (page - 1) * currentProductsPerPage;
        products = sorted.slice(startIndex, startIndex + currentProductsPerPage);
        if (sorted.length === 0) {
            noResults = true;
            const fallback = getFilteredProducts({ category: "All", sort: "", page, productsPerPage: currentProductsPerPage });
            products = fallback.products;
            totalPages = fallback.totalPages;
        }
    } else if (idsParam) {
        const ids = String(idsParam).split(",").filter(Boolean);
        // map ids to product objects
        let matched = ids.map((id) => productsById[id]).filter(Boolean);

        // sorting for search results (default: by name)
        function cleanPrice(price: string | number | undefined) {
            if (!price) return 0;
            if (typeof price === "number") return price;
            return Number(String(price).replace(/[^\d.-]/g, "")) || 0;
        }
        function cleanRating(r: number | undefined) { return r ? Number(r) : 0; }

        if (sort === "priceLowHigh") {
            matched = matched.sort((a, b) => cleanPrice(a.price) - cleanPrice(b.price));
        } else if (sort === "priceHighLow") {
            matched = matched.sort((a, b) => cleanPrice(b.price) - cleanPrice(a.price));
        } else if (sort === "ratingHighLow") {
            matched = matched.sort((a, b) => cleanRating(b.rating) - cleanRating(a.rating));
        } else {
            matched = matched.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        }

        totalPages = Math.max(1, Math.ceil(matched.length / currentProductsPerPage));
        const startIndex = (page - 1) * currentProductsPerPage;
        products = matched.slice(startIndex, startIndex + currentProductsPerPage);
        // If search returned no matches, fall back to default product list but mark no-results
        if (matched.length === 0) {
            noResults = true;
            const fallback = getFilteredProducts({ category: "All", sort: "", page, productsPerPage: currentProductsPerPage });
            products = fallback.products;
            totalPages = fallback.totalPages;
        }
    } else {
        // Fetch only the filtered, sorted, and paginated products from server utility
        const result = getFilteredProducts({ category, sort, page, productsPerPage: currentProductsPerPage });
        products = result.products;
        totalPages = result.totalPages;
    }

    // If the client indicated no results (API returned zero ids), set noResults flag
    if (!noResults && noResultsParam) {
        noResults = true;
    }

    // No external debug/extraction payloads — search is local-only
    return (
        <section className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
                {(queryText || idsParam) ? `Search results${queryText ? ` for "${queryText}"` : ""}` : "Our Top Picks"}
            </h1>

            {/* AI Search placed below the 'Our Top Picks' heading */}
            <div className="mb-6 flex justify-center">
                <AISearch />
            </div>

            {/* Filter & Sort (visible for search results too) */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <ProductFilters
                    category={category}
                    sort={sort}
                    categories={categories}
                />
            </div>

            {/* No results notice when AI search returned nothing */}
            {noResults && (
                <p className="text-sm text-center text-gray-600 mb-4">no results found...</p>
            )}

            {/* Debugging removed: search and scoring operate on local DB only */}

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {products.length > 0 ? (
                products.map((p) => (
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
                currentPage={page}
                totalPages={totalPages}
                basePath="/products"
                queryParams={{
                    ...(category !== "All" ? { category } : {}),
                    ...(sort ? { sort } : {}),
                    ...(queryText ? { q: String(queryText) } : {}),
                    ...(!queryText && idsParam ? { ids: String(idsParam) } : {}),
                }}
            />

            {/* AdSense Ad Unit */}
            <AdUnitClient  slot="1234567890" />

            {/* Amazon Banner */}
            <div className="mt-12 flex justify-center">
                <a
                    href="https://www.amazon.in/tryprime?tag=setupsavvy01-21"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                <Image
                    src="/IN-PRIME-1068x260.jpg"
                    alt="Amazon Prime Banner"
                    width={1068}
                    height={260}
                    className="w-full max-w-4xl rounded-lg shadow-lg"
                    priority={false}
                    loading="lazy"
                />
                </a>
            </div>
        </section>
    );
}

