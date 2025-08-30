//app/sitemap.ts
import { MetadataRoute } from "next";
import blogs from "@/data/blogs.json"; 
import { products } from "@/data/products"

interface BlogPost {
    slug: string;
    date?: string;
}

interface Product {
    id: string;
    updatedAt?: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://www.setupsavvy.in/",
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 1.0,
        },
        ...blogs.map((post: BlogPost) => ({
            url: `https://www.setupsavvy.com/blog/${post.slug}`,
            lastModified: post.date ? new Date(post.date) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })),
        {
          url: "https://www.setupsavvy.in/products",
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        },
        ...products.map((product: Product) => ({
            url: `https://www.setupsavvy.in/products/${product.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        })),
        {
            url: "https://www.setupsavvy.in/about",
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
        {
            url: "https://www.setupsavvy.in/contact",
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.5,
        },
        {
            url: "https://www.setupsavvy.in/privacy-policy",
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.3,
        },
        {
            url: "https://www.setupsavvy.in/terms-and-conditions",
            lastModified: new Date(),
            changeFrequency: "yearly" as const,
            priority: 0.3,
        },
    ];
}
