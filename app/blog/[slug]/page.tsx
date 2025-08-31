//app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BlogCard from "@/components/blogCard";
import AdUnit from "@/components/adUnit";
import FaqSection from "@/components/faqSection";
import blogs from "@/data/blogs.json";
import { getProductsByIds, type Product } from "@/data/products";

import laptopUnder60000 from "@/data/laptops/under-60000.json";
import webcamUnder10000 from "@/data/webcams/under-10000.json";
import headsetUnder5000 from "@/data/headsets/under-5000.json";
import keyboardUnder4000 from "@/data/keyboards/under-4000.json";
import mouseUnder4000 from "@/data/mouse/under-4000.json";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const post = blogs.find((b) => b.slug === slug);
    if (!post) return { title: "Blog Not Found" };

    return {
        title: `${post.title} | SetupSavvy`,
        description: post.description || "Read this blog on SetupSavvy",
        image: post.image,
        openGraph: {
            title: post.title,
            description: post.description || "Read this blog on SetupSavvy",
            url: `https://www.setupsavvy.in/blog/${post.slug}`,
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params; 
    const post = blogs.find((b) => b.slug === slug);

    if (!post) return notFound();

    const slugToCategory: Record<string,
        { category: "headsets" | "laptops" | "keyboards" | "mouse" | "webcams"; ids: string[] }
    > = {
        "best-10-headsets-under-5000": { category: "headsets", ids: headsetUnder5000.ids },
        "best-5-laptops-under-60000": { category: "laptops", ids: laptopUnder60000.ids },
        "best-10-keyboards-under-4000": { category: "keyboards", ids: keyboardUnder4000.ids },
        "best-10-mouse-under-4000": { category: "mouse", ids: mouseUnder4000.ids },
        "best-10-webcams-under-10000-india-2025": { category: "webcams", ids: webcamUnder10000.ids },
    };

    let selectedProducts: Product[] = [];
    const mapping = slugToCategory[slug];
    if (mapping) {
        selectedProducts = getProductsByIds(mapping.ids, mapping.category);
    }

    return (
        <article className="container mx-auto py-10 px-4">

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
            <p className="text-lg mb-8">{post.description}</p>

            {/* Image only on Text Blog*/}
            {!post.note && (
                <div className="relative w-full max-w-md mx-auto flex items-center justify-center"
                    style={{ aspectRatio: '3 / 2' }}>
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="text-gray-400 rounded-lg object-contain"
                        style={{ borderRadius: '0.5rem' }}
                    />
                </div>
            )}

            {/* Buying Guide */}
            {post.guide && (
            <>
                <h2 className="text-2xl font-semibold mt-10 mb-4">
                    {post.guide.title}
                </h2>
                <ul className="list-disc pl-6">
                    {post.guide.points.map((point, idx) => (
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
                {selectedProducts.map((product) => (
                    <BlogCard
                        key={product.id}
                        {...product}
                        price={product.price.toString()}
                        url={product.url ?? ""}
                        pros={Array.isArray(product.pros) ? product.pros : []}
                        cons={Array.isArray(product.cons) ? product.cons : []}
                        rating={product.rating ?? 0}
                    />
                ))}
            </div>

            {/* Note */}
            {post.note && (
                <p className="text-sm">
                    {post.note}
                </p>
            )}

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />

            {/* Suggestions Section */}
            {post.suggestion && post.suggestion.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-2xl font-semibold mb-4">Suggestions 💡</h2>
                    {post.suggestion.map((s, idx) => (
                        <div key={idx} 
                            className="p-4 rounded-2xl border dark:border-gray-700 dark:bg-gray-900 
                                        shadow-md mb-6">
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

            {/* FAQ Section */}
            {post.faqs && <FaqSection faqs={post.faqs} />}

            {/* Final Thoughts */}
            {post.finalThoughts && (
            <>
                <h2 className="text-2xl font-semibold mt-10 mb-4">Final Thoughts 💭</h2>
                <p>{post.finalThoughts}</p>
            </>
            )}

            {/* Next Blog */}
            {post.next && (
            <div className="mt-12 border-t pt-6">
                <h3 className="text-lg font-semibold dark:text-gray-200 mb-2">📖 Read Next:</h3>
                <Link
                    href={`/blog/${post.next.link}`}
                    className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                    {post.next.title} →
                </Link>
            </div>
            )}
        </article>
    );
}
