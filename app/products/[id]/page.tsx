//app/products/[id]/page.tsx
import { products } from "@/data/products";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetail({ params }: { params: { id: string } }) {
    const product = products.find((p) => p.id === params.id);

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
                    <p className="text-gray-600 mb-6">
                        This is one of our recommended products for productivity & comfort.
                        Click below to check details on Amazon.
                    </p>
                    <Link
                        href={product.url}
                        target="_blank"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Buy on Amazon
                    </Link>
                </div>
            </div>
        </section>
    );
}
