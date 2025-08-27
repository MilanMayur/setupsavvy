//components/blogCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ProductProps {
    id: string;
    name: string;
    price: string;
    url: string;
    image: string;
    pros: string[];
    cons: string[];
    rating: number;
}

export default function BlogCard({ id, name, price, url, image, pros, cons, rating }: ProductProps) {
    return (
        <div className="bg-white border shadow-md hover:shadow-2xl rounded-2xl p-4 max-w-sm">
            <Link href={`/products/${id}`}>
                <div className="min-h-[170px] items-center justify-center">
                    <Image
                        src={image}
                        alt={name}
                        width={400}
                        height={400}
                        className="text-gray-400 rounded-lg object-contain max-h-full"
                    />
                </div>

                <h2 className="text-lg text-black font-bold mt-3 line-clamp-2">{name}</h2>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-green-600 font-semibold">₹ {price}</p>
                    <p className="text-orange-600 font-semibold">☆ {rating}</p>
                </div>
            </Link>

            <Link
                href={url}
                target="_blank"
                className="block bg-blue-600 text-white text-center px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
                Buy on Amazon
            </Link>

            <div className="mt-3">
                <p className="font-semibold text-gray-700">✅ Pros:</p>
                <ul className="list-disc ml-5 text-sm text-gray-600">
                {pros.map((pro, index) => (
                    <li key={index}>{pro}</li>
                ))}
                </ul>
            </div>

            <div className="mt-2">
                <p className="font-semibold text-gray-700">❌ Cons:</p>
                <ul className="list-disc ml-5 text-sm text-gray-600">
                {cons.map((con, index) => (
                    <li key={index}>{con}</li>
                ))}
                </ul>
            </div>
        </div>
    );
}
