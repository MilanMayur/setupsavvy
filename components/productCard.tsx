//components/productCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
    id: string;
    name: string;
    price: string;
    image: string;
    url: string;
    category: string;
    rating: number;
}

export default function ProductCard({id, name, price, image, url, category, rating}: ProductProps) {
    return (
        <Link
            href={`/products/${id}`}
            className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
        >
            <Image
                src={image}
                alt={name}
                width={300}
                height={300}
                className="w-full h-56 object-cover text-gray-400"
            />
            <div className="p-4">
                <h3 className="text-lg text-black font-semibold">{name}</h3>
                <p className="text-blue-600 font-medium">₹ {price}</p>
                <p className="text-orange-600 font-semibold">☆ {rating}</p>
            </div>
        </Link>
    );
}
