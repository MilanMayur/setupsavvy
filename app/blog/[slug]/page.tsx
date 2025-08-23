//app/blog/[slug]/page.tsx
import blogs from "@/data/blogs.json";
import headsets from "@/data/headsets-10-5000.json";
import laptops from "@/data/laptops-5-60000.json";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blogCard";

type Props = {
    params: Promise<{ slug: string }>;
};

type Product = {
    id: string;
    name: string;
    price: number;
    image: string;
    url?: string;
    category?: string;
    rating?: number;
    pros?: string[];
    cons?: string[];
    [key: string]: string | number | string[] | undefined;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = blogs.find((b) => b.slug === slug);
    if (!post) return { title: "Blog Not Found" };

    return {
        title: `${post.title} | SetupSavvy`,
        description: post.description,
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params; 
    const post = blogs.find((b) => b.slug === slug);

    if (!post) return notFound();

    let products: Product[] = [];
    if (slug === "best-10-headsets-under-5000") {
        products = headsets;
    } else if (slug === "best-5-laptops-under-60000") {
        products = laptops;
    }

    return (
        <article className="max-w-3xl mx-auto py-10 px-4">
            {/* Title + Date */}
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <p className="text-gray-500 text-sm mb-6">
                {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </p>
            {/* Blog description */}
            <p className="text-lg text-gray-300 mb-8">{post.description}</p>
            {/* Buying Guide */}
            {post.buyingGuide && (
            <>
                <h2 className="text-2xl font-semibold mt-10 mb-4">
                    {post.buyingGuide.title}
                </h2>
                <ul className="list-disc pl-6">
                    {post.buyingGuide.points.map((point, idx) => (
                    <li key={idx} className="mb-2">
                        <strong>{point.label}</strong> → {point.detail}
                    </li>
                    ))}
                </ul>
            </>
            )}
            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {products.map((product) => (
                    <BlogCard
                        key={product.id}
                        {...product}
                        price={product.price.toString()}
                        url={product.url ?? ""}
                        pros={product.pros ?? []}
                        cons={product.cons ?? []}
                        rating={product.rating ?? 0}
                    />
                ))}
            </div>
            <p className="text-gray-300 text-sm">
                Note: Prices are approximate and may vary across online and offline
                stores. We recommend checking multiple retailers for the best deal.
            </p>
            {/* Final Thoughts */}
            {post.finalThoughts && (
            <>
                <h2 className="text-2xl font-semibold mt-10 mb-4">Final Thoughts 💭</h2>
                <p>{post.finalThoughts}</p>
            </>
            )}
        </article>
    );
}

