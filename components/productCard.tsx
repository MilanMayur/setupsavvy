//components/productCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";

type ProductCardProps = Pick<Product, 
    "id" | "name" | "price" | "image" | "rating">;

export default function ProductCard({id, name, price, image, rating}: ProductCardProps) {
    return (
        <Link
            href={`/products/${id}`}
            className="block bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] 
                        transition overflow-hidden"
        >
            <div className="relative w-full max-w-xs mx-auto flex items-center justify-center" 
                style={{ aspectRatio: '1 / 1' }}>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="text-gray-400 object-contain"
                    style={{ borderRadius: '0.5rem' }}
                />
            </div>
            <div className="p-4">
                <h3 className="text-lg text-black font-semibold line-clamp-1">{name}</h3>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-blue-600 font-semibold">₹ {price}</p>
                    <p className="text-orange-600 font-semibold">☆ {rating}</p>
                </div>
            </div>
        </Link>
    );
}

