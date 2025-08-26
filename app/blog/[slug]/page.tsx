//app/blog/[slug]/page.tsx
import blogs from "@/data/blogs.json";
import headsets from "@/data/headsets-10-5000.json";
import laptops from "@/data/laptops-5-60000.json";
import { notFound } from "next/navigation";
import BlogCard from "@/components/blogCard";
import AdUnit from "@/components/adUnit";

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
    details?: Record<string, string>;
} & Record<string, string | number | string[] | Record<string, string> | undefined>;

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

    const normalizeDetails = (details: unknown): Record<string, string> | undefined => {
        if (typeof details === "string") return { info: details };
        if (Array.isArray(details)) return { info: details.join(" ") };
        if (details && typeof details === "object") {
            return Object.fromEntries(
                Object.entries(details).map(([k, v]) => [k, v === undefined ? "" : String(v)])
            );
        }
        return undefined;
    };

    let products: Product[] = [];
    if (slug === "best-10-headsets-under-5000") {
        products = headsets.map((p) => ({ ...p, details: normalizeDetails(p.details) }));
    } else if (slug === "best-5-laptops-under-60000") {
        products = laptops.map((p) => ({ ...p, details: normalizeDetails(p.details) }));
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
                        <strong>{point.label}</strong> → 
                        <p>{point.detail}</p>
                    </li>
                    ))}
                </ul>
            </>
            )}

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

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

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

            {/* Suggestions Section */}
            {post.suggestion && post.suggestion.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Suggestions 💡</h2>
                    {post.suggestion.map((s, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-gray-700 bg-gray-900 shadow-md mb-6">
                            <span> 
                                <h3 className="text-xl font-bold mb-2">{s.category} : {s.title}</h3>
                            </span>
                            <ul className="list-disc pl-6">
                                {(s.reasons ?? []).map((point, i) => (
                                    <li key={i} className="mb-1">{point}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

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
