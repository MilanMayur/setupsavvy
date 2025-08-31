//app/products/[id]/page.tsx
import AdUnit from "@/components/adUnit";
import { products, type Product } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product: Product | undefined = products.find(p => p.id === id);
  
    if (!product) {
        return {
            title: "Product Not Found | SetupSavvy.in",
            description: "The product you are looking for does not exist.",
        };
    }
  
    return {
        title: `${product.name} | SetupSavvy.in`,
        description: product.details
            ?  "Check full specifications, pros & cons, and price."
            : `Buy ${product.name} at the best price.`,
        openGraph: {
            title: product.name,
            description: "Check full specifications, pros & cons, and price.",
            url: `https://setupsavvy.in/products/${product.id}`,
            images: [
                {
                    url: product.image,
                    alt: product.name,
                },
            ],
        },
    };
}

export default async function ProductDetail({ params }: Props) {
    const { id } = await params;
    const product: Product | undefined = products.find(p => p.id === id);

    if (!product) {
        return <p className="text-center mt-20">Product not found.</p>;
    }

    return (
        <section className="max-w-3xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="text-gray-400 h-80 object-cover mx-auto"
                />
                <div className="p-6">
                    <h1 className="text-3xl text-black font-bold mb-4">{product.name}</h1>
                    <p className="text-xl text-blue-600 mb-4">₹ {product.price}</p>

                    {/* Product Details */}
                    {product.details && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h2>

                        {/* Case 1: Object (key-value) */}
                        {typeof product.details === "object" && !Array.isArray(product.details) ? (
                        <div className="border rounded-lg overflow-hidden">
                            {Object.entries(product.details).map(([key, value], index) => (
                            <div
                                key={key}
                                className={`grid grid-cols-2 gap-4 px-4 py-2 border-b last:border-b-0 ${
                                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                }`}
                            >
                                <span className="font-medium text-gray-800">{key}</span>
                                <span className="text-gray-600">{value}</span>
                            </div>
                            ))}
                        </div>
                        ) : Array.isArray(product.details) ? (

                        /* Case 2: Array of strings */
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                        {product.details.map((item, idx) => {
                            const [title, desc] = item.split("–", 2);
                            return (
                                <p key={idx} className="text-gray-700">
                                    <span className="block font-medium text-gray-900">{title?.trim()}:</span>
                                    <span className="block text-gray-600 pl-7">{desc?.trim()}</span>
                                </p>
                            );
                        })}
                        </ul>
                        ) : (

                        /* Case 3: Plain string */
                        <p className="text-gray-600">{product.details}</p>
                        )}
                    </div>
                    )}
 
                    {/* AdSense Ad Unit */}
                    <AdUnit slot="1234567890" />

                    {/* Pros & Cons */}
                    {("pros" in product || "cons" in product) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Pros */}
                        {product.pros && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <h3 className="text-green-700 font-semibold mb-2">✅ Pros</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {Array.isArray(product.pros)
                                    ? product.pros.map((pro: string, index: number) => (
                                        <li key={index}>{pro}</li>
                                    ))
                                    : <li>{product.pros}</li>
                                }
                                </ul>
                            </div>
                        )}

                        {/* Cons */}
                        {product.cons && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <h3 className="text-red-700 font-semibold mb-2">❌ Cons</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {Array.isArray(product.cons)
                                    ? product.cons.map((con: string, index: number) => (
                                        <li key={index}>{con}</li>
                                    ))
                                    : <li>{product.cons}</li>
                                }
                                </ul>
                            </div>
                        )}
                    </div>
                    )}

                    {/* Buy on Amazon Button */}
                    <div className="text-center">
                        <p className="text-gray-600 mb-6">
                            Click below to check details on Amazon.
                        </p>
                        <Link
                            href={product.url ?? "www.amazon.in"}
                            target="_blank"
                            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg 
                                font-medium hover:bg-blue-700 transition"
                        >
                            Buy on Amazon
                        </Link>
                    </div>
                </div>

                {/* AdSense Ad Unit */}
                <AdUnit slot="1234567890" />
            </div>
        </section>
    );
}
