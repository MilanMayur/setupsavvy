//app/blog/page.tsx
import blogs from "@/data/blogs.json";
import AdUnit from "@/components/adUnit";
import Pagination from "@/components/pagination";
import BlogPostCard from "@/components/blogPostCard";

export const metadata = {
    title: "SetupSavvy.in Blog - Reviews, Guides & Top Picks",
    description: "Read our expert reviews, buying guides, and curated lists of the best laptops, headsets, chairs, and accessories in India.",
};

type SearchParamsType = {
    page?: string;
};

const BLOGS_PER_PAGE = 12;

export default async function BlogIndex({ searchParams }: { searchParams: Promise<SearchParamsType> }) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const availableBlogs = blogs
        .filter(post => {
            const [year, month, day] = post.date.split("-").map(Number);
            const blogDate = new Date(year, month - 1, day); // normalized midnight
            return blogDate.getTime() <= today.getTime();
        })
        .sort((a, b) => {
            const [aYear, aMonth, aDay] = a.date.split("-").map(Number);
            const [bYear, bMonth, bDay] = b.date.split("-").map(Number);
            const aDate = new Date(aYear, aMonth - 1, aDay);
            const bDate = new Date(bYear, bMonth - 1, bDay);
            return bDate.getTime() - aDate.getTime(); // newest first
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
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

