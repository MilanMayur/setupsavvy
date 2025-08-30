//app/sitemap.ts
import { MetadataRoute } from "next";
import blogs from "@/data/blogs.json"; 

export default function sitemap(): MetadataRoute.Sitemap {

    return [
        {
            url: "https://www.setupsavvy.in/",
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 1.0,
        },
        ...blogs.map((post: any) => ({
            url: `https://www.setupsavvy.com/blog/${post.slug}`,
            lastModified: post.date ? new Date(post.date) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        })),
    ];
}
