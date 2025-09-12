//app/blog/page.tsx
import blogs from "@/data/blogs.json";
import AdUnit from "@/components/adUnit";
import Pagination from "@/components/pagination";
import BlogPostCard from "@/components/blogPostCard";

export const metadata = {
    title: "SetupSavvy.in Blog - Reviews, Guides & Top Picks",
    description: "Read our expert reviews, buying guides, and curated lists of the best laptops, headsets, chairs, and accessories in India.",
};

const BLOGS_PER_PAGE = 15;

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;

    const today = new Date();

    const availableBlogs = blogs
    .filter(post => {
        const blogDateParts = post.date.split("-"); // YYYY-MM-DD
        // parse YYYY-MM-DD
        const blogDate = new Date(Number(blogDateParts[0]), Number(blogDateParts[1]) - 1, Number(blogDateParts[2]));
        return blogDate.getTime() <= today.getTime();
    })
    .sort((a, b) => {
        // newest first
        const bParts = b.date.split("-");
        const aParts = a.date.split("-");
        const bDate = new Date(Number(bParts[0]), Number(bParts[1]) - 1, Number(bParts[2]));
        const aDate = new Date(Number(aParts[0]), Number(aParts[1]) - 1, Number(aParts[2]));
        return bDate.getTime() - aDate.getTime();
    });

    // Pagination
    const startIndex = (currentPage - 1) * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;

    const paginatedBlogs = availableBlogs.slice(startIndex, endIndex);
    const totalPages = Math.ceil(availableBlogs.length / BLOGS_PER_PAGE);

    return (
        <section className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Latest Blog Posts</h1>
            <p className="mb-8">
                Expert articles on productivity, ergonomic setups, and best gear for remote workers.
            </p>
            
            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

            {/* Blog Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {paginatedBlogs.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                ))}
            </div>

            {/* AdSense Ad Unit */}
                <AdUnit slot="1234567890" />

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                basePath="/blog" 
            />
        </section>
    );
}


