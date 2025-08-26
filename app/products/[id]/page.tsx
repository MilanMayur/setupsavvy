//app/products/[id]/page.tsx
import AdUnit from "@/components/adUnit";
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";

type Props = {
    params: Promise<{ id: string }>;
};

type Product = {
    id: string;
    name: string;
    price: number | string;
    url: string;
    image: string;
    pros?: string[];
    cons?: string[];
    category: string;
    rating: number;
    details?: Record<string, string>;
};

export default async function ProductDetail({ params }: Props) {
    const { id } = await params;
    const product = products.find(p => p.id === id);

    if (!product) {
        return <p className="text-center mt-20">Product not found.</p>;
    }

    return (
        <section className="max-w-3xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={400}
                    className="text-gray-400 w-full h-80 object-cover"
                />
                <div className="p-6">
                    <h1 className="text-3xl text-black font-bold mb-4">{product.name}</h1>
                    <p className="text-xl text-blue-600 mb-4">₹ {product.price}</p>

                    {/* Product Details */}
                    {product.details && Object.keys(product.details).length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Specifications</h2>
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
                    </div>
                    )}

                    {/* AdSense Ad Unit */}
                    <AdUnit slot="1234567890" />

                    {/* Pros & Cons */}
                    { "pros" in product && product.pros?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {product.pros && Array.isArray(product.pros) && product.pros.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <h3 className="text-green-700 font-semibold mb-2">✅ Pros</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {product.pros.map((pro, index) => (
                                        <li key={index}>{pro}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.cons && Array.isArray(product.cons) && product.cons.length > 0 && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <h3 className="text-red-700 font-semibold mb-2">❌ Cons</h3>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {product.cons.map((con, index) => (
                                        <li key={index}>{con}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    )}

                    <p className="text-gray-600 mb-6">
                        This is one of our recommended products for productivity & comfort.
                        Click below to check details on Amazon.
                    </p>
                    <Link
                        href={product.url}
                        target="_blank"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg 
                            font-medium hover:bg-blue-700 transition"
                    >
                        Buy on Amazon
                    </Link>
                </div>

                {/* AdSense Ad Unit */}
                <AdUnit slot="1234567890" />
            </div>
        </section>
    );
}
