//app/products/page.tsx
import { getFilteredProducts } from "@/data/products";
import ProductCard from "@/components/productCard";
import Pagination from "@/components/pagination";
import AdUnitClient from "@/components/adUnitClient";
import ProductFilters from "@/components/productFilters";

type SearchParamsType = {
    page?: string;
    category?: string;
    sort?: string;
};

const categories = ["All", "Laptops", "Keyboards", "Mouse", "Headsets", "Webcams", "Chairs", "Tables"];
const productsPerPage = 20;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParamsType }) {
    // Accept searchParams directly from Next.js App Router
    const page = Number(searchParams?.page) || 1;
    const category = searchParams?.category || "All";
    const sort = searchParams?.sort || "";

    // Fetch only the filtered, sorted, and paginated products from server utility
    const { products, totalPages } = getFilteredProducts({ category, sort, page, productsPerPage });

    return (
        <section className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Our Top Picks</h1>

            {/* Filter & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <ProductFilters
                    category={category}
                    sort={sort}
                    categories={categories}
                />
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                <img
                    src="/IN-PRIME-1068x260.jpg"
                    alt="Amazon Prime Banner"
                    className="w-full max-w-4xl rounded-lg shadow-lg"
                />
                </a>
            </div>
        </section>
    );
}


