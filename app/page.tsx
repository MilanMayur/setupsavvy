//app/page.tsx
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/productCard";

export default function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-lg mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Find the Best Work-from-Home Gear
                </h1>
                <p className="text-lg max-w-2xl mx-auto mb-6">
                    Boost productivity and comfort with our curated selection of laptops, chairs, and accessories.
                </p>
                <Link
                    href="/products"
                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                    Browse Products
                </Link>
            </section>

            {/* Featured Products */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-center">Featured Picks</h2>
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                    {products.slice(0, 3).map((p) => (
                        <ProductCard key={p.id} {...p} price={String(p.price)} />
                    ))}
                </div>
                <div className="text-center mt-8">
                    <Link
                        href="/products"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                      View All Products
                  </Link>
                </div>
            </ section>

            {/* Call to Action */}
            <section className="bg-gray-100 rounded-2xl py-12 text-center shadow-md">
                <h2 className="text-2xl text-black font-bold mb-4">Need Help Choosing?</h2>
                <p className="mb-6 text-gray-700">
                    Read our expert guides and find the right gear for your home office.
                </p>
                <Link
                    href="/blog"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                    Read Guides
                </Link>
            </section>
        </div>
    );
}

