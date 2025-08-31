//components/blogPostCard.tsx
import Image from "next/image";
import Link from "next/link";

interface BlogPostProps {
    post: {
        slug: string;
        title: string;
        description?: string;
        image: string;
        date: string;
    };
    showDescription?: boolean;
}

export default function BlogPostCard({ post, showDescription = true }: BlogPostProps) {
    return (
        <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden
                        transform duration-300 hover:scale-[1.02]">
        <Link href={`/blog/${post.slug}`} 
            className="block group">
            <div
                className="relative max-w-5xl mx-auto flex items-center justify-center"
                style={{ aspectRatio: "3 / 2" }}
            >
                <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="rounded-lg object-cover"
                />
            </div>
  
            <div className="p-3">
                <h2 className="text-xl text-black font-semibold">{post.title}</h2>

                {showDescription && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-4">
                    {post.description}
                </p>
                )}
  
                <p className="text-xs text-gray-400 mt-2">
                {new Date(post.date).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
                </p>
  
                <span className="text-blue-600 font-medium mt-1 block">
                    Read More →
                </span>
            </div>
        </Link>
        </div>
    );
}
