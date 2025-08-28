//app/blog/page.tsx
import blogs from "@/data/blogs.json";
import Link from "next/link";
import Image from "next/image";
import AdUnit from "@/components/adUnit";
import Pagination from "@/components/pagination";

export const metadata = {
    title: "SetupSavvy Blog - Reviews, Guides & Top Picks",
    description: "Read our expert reviews, buying guides, and curated lists of the best laptops, headsets, chairs, and accessories in India.",
};

const BLOGS_PER_PAGE = 10;

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;

    const paginatedBlogs = blogs.slice(startIndex, endIndex);
    const totalPages = Math.ceil(blogs.length / BLOGS_PER_PAGE);

    return (
        <section className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
            <p className="mb-8">
                Expert articles on productivity, ergonomic setups, and best gear for remote workers.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
                {paginatedBlogs.map((post) => (
                <div
                    key={post.slug}
                    className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
                >

                    {/* AdSense Ad Unit */}
                    <AdUnit slot="1234567890" />

                    {/* Blog Posts */}
                    <Link href={`/blog/${post.slug}`}>
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={400}
                            height={400}
                            className="text-gray-400 h-48 object-cover mx-auto"
                        />
                        <div className="p-4">
                            <h2 className="text-xl text-black font-semibold">{post.title}</h2>
                            <p className="text-gray-600 text-sm mt-2">{post.description}</p>
                            <p className="text-xs text-gray-400 mt-2">
                                {new Date(post.date).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <span className="text-blue-600 font-medium mt-2 block">
                                Read More →
                            </span>
                        </div>
                    </Link>

                    {/* AdSense Ad Unit */}
                    <AdUnit slot="1234567890" />
                </div>
                ))}
            </div>

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                basePath="/blog" 
            />
        </section>
    );
}

