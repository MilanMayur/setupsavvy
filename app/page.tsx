//app/page.tsx
"use client";
import Link from "next/link";
import { featuredProducts } from "@/data/products";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/productCard";
import blogData from "@/data/blogs.json";
import BlogPostCard from "@/components/blogPostCard";
import AdUnit from "@/components/adUnit";

export default function HomePage() {
    const [visibleCount, setVisibleCount] = useState(2);

    const latestBlogs = blogData.slice(0, 3);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth >= 1024) {
                setVisibleCount(6);
            } else if (window.innerWidth >= 768) {
                setVisibleCount(4);
            } else if (window.innerWidth >= 640) {
                setVisibleCount(3);
            } else {
                setVisibleCount(2);
            }
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);

        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    return (
        <div className="container mx-auto">
            {/* Hero Section */}
            <section className="text-center text-white py-20 rounded-2xl shadow-xl mb-16 relative
                                bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-6xl font-extrabold mb-6"
                > 
                    Find the Best Work-from-Home Gear
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-90"
                >
                    Boost productivity and comfort with our curated selection of laptops, chairs, and accessories.
                </motion.p>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                >
                    <Link
                        href="/products"
                        className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold 
                                  hover:bg-gray-100 shadow-md transition"
                    >
                        Browse Products
                    </Link>
                </motion.div>

                {/* Decorative Gradient Circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500 rounded-full 
                                mix-blend-multiply filter blur-3xl opacity-30 animate-pulse">
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400 rounded-full 
                                mix-blend-multiply filter blur-3xl opacity-30 animate-pulse">
                </div>
            </section>

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

            {/* Featured Products */}
            <section className="mb-20">
                <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-gray-100">
                    ⭐ Featured Picks
                </h2>
                <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {featuredProducts.slice(0, visibleCount).map((p, i) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                    >
                    <ProductCard {...p} price={String(p.price)} />
                    </motion.div>
                ))}
                </div>
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl 
                                  font-semibold hover:bg-blue-700 transition shadow-md"
                    >
                        View All Products
                    </Link>
                </div>
            </section>

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

            {/* Why Choose Us Section */}
            <section className="bg-gradient-to-r from-blue-200 to-indigo-400 
                                dark:bg-gradient-to-r dark:from-indigo-50 dark:to-blue-50 
                                rounded-2xl py-10 px-4 mb-15 text-center shadow-inner">
                <h2 className="text-3xl text-gray-900 font-bold mb-8">Why Shop With Us?</h2>
                <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
                        <h3 className="text-xl dark:text-gray-900 font-bold mb-2">
                          🎯
                        </h3>
                        <h3 className="text-xl dark:text-gray-900 font-bold mb-2">
                          Expert Picks
                        </h3>
                        <p className="text-gray-600">
                          Curated from in-depth research, reviews, and specs — 
                          so you get the right gear without the hassle.
                        </p>
                    </div>
                    <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
                        <h3 className="text-xl dark:text-gray-900 font-bold mb-2">
                          ⚡
                        </h3>
                        <h3 className="text-xl dark:text-gray-900 font-bold mb-2">
                          Fast Comparisons
                        </h3>
                        <p className="text-gray-600">
                          No need to dig through endless reviews — 
                          our guides highlight the key differences that matter.
                        </p>
                    </div>
                    <div className="p-6 bg-white shadow rounded-xl hover:shadow-lg transition">
                        <h3 className="text-xl dark:text-gray-900 font-bold mb-2">
                          💰
                        </h3>
                        <h3 className="text-xl dark:text-gray-900 font-bold mb-2">
                          Best Value
                        </h3>
                        <p className="text-gray-600">
                          We focus on products that balance performance, reliability, and price — 
                          so your money goes further.
                        </p>
                    </div>
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section className="bg-gradient-to-r from-blue-200 to-indigo-400
                                dark:bg-gradient-to-r dark:from-indigo-50 dark:to-blue-50 
                                text-white rounded-2xl py-10 px-4 text-center shadow-lg">
                <h2 className="text-3xl text-gray-900 font-bold mb-2">Latest from Our Blog</h2>
                <p className="mb-8 text-gray-900 dark:text-gray-600 max-w-xl mx-auto">
                    Read our expert guides and find the right gear for your dream setup.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                {latestBlogs.map((blog) => (
                    <BlogPostCard key={blog.slug} post={blog} showDescription={false} />
                ))}
                </div>
                <Link
                    href="/blog"
                    className="bg-blue-600 text-white px-8 py-4 mt-10 rounded-xl font-bold 
                                hover:bg-blue-700 transition"
                >
                    Read Guides
                </Link>
            </section>

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />
        </div>
    );
}


