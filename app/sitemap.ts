//app/sitemap.ts
import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import blogs from "@/data/blogs.json"; 

interface BlogPost {
    slug: string;
    date?: string;
}

interface Product {
    id: string;
    updatedAt: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const categories = ["headsets", "keyboards", "laptops", "mouse", "webcams"];
    const products: Product[] = [];

    for (const category of categories) {
        const filePath = path.join(process.cwd(), "data", `${category}.json`);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const items: Product[] = JSON.parse(fileContent);
        products.push(...items);
    }

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
        ...products.map((product) => ({
            url: `https://www.setupsavvy.in/products/${product.id}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        })),
    ];
}
