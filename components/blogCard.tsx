//components/blogCard.tsx
import Image from "next/image";
import Link from "next/link";

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
        <div className="bg-white border shadow-md hover:shadow-xl hover:scale-[1.02] 
                        rounded-2xl p-4 max-w-sm transition overflow-hidden">
            <Link href={`/products/${id}`}>
                <div className="relative w-full max-w-xs mx-auto items-center justify-center"
                    style={{ aspectRatio: '1 / 1' }}>
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className="text-gray-400 rounded-lg object-contain"
                        style={{ borderRadius: '0.5rem' }}
                    />
                </div>

                <div className="h-[60px]">
                    <h2 className="text-lg text-black font-bold mt-3 line-clamp-2">{name}</h2>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-green-600 font-semibold">₹ {price}</p>
                    <p className="text-orange-600 font-semibold">☆ {rating}</p>
                </div>
            </Link>

            <Link
                href={url}
                target="_blank"
                className="block bg-blue-600 text-white text-center px-2 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
                Buy on Amazon
            </Link>

            {/*<div className="mt-3">
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
            </div>*/}
        </div>
    );
}
