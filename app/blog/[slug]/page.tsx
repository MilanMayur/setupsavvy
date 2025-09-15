//app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import BlogCard from "@/components/blogCard";
import AdUnit from "@/components/adUnit";
import FaqSection from "@/components/faqSection";
import blogs from "@/data/blogs.json";
import { getCuratedProductsBySlug } from "@/data/products";

type Props = {
    params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
    const { slug } = params;
    const post = blogs.find((b) => b.slug === slug);

    if (!post) {
        return { 
            title: "Blog Not Found | SetupSavvy.in",
            description: "The blog you are looking for does not exist.", 
        };
    }

    return {
        title: `${post.title} | SetupSavvy.in`,
        description: post.description || "Read this blog on SetupSavvy",
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
            siteName: "SetupSavvy",
            type: "article",
        },
    };
}

export default async function BlogPost({ params }: { params: any }) {
    const { slug } = params; 
    const post = blogs.find((b) => b.slug === slug);

    if (!post) return notFound();

    const selectedProducts = getCuratedProductsBySlug(slug);

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
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                <p className="text-sm mt-5 italic bg-yellow-100 text-gray-700 border-l-4 
                                border-yellow-500 pl-2">
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



