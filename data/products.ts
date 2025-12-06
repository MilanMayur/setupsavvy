//data/products.ts
import featured from "./featured.json"
import laptops from "./laptop/laptop.json"
import webcams from "./webcam/webcam.json"
import headphones from "./headphone/headphone.json"
import keyboards from "./keyboard/keyboard.json"
import mouse from "./mouse/mouse.json"
import chairs from "./chair/chair.json"
import tables from "./table/table.json"
import processors from "./processor/processor.json"
import rams from "./ram/ram.json"
import ssds from "./ssd/ssd.json"
import monitors from "./monitor/monitor.json"

import curatedPicks from "./curated-picks.json"

export type Product = {
    id: string;
    name: string;
    price: string;
    url?: string;
    image: string;
    pros?: string[] | string;
    cons?: string[] | string;
    category: string;
    rating?: number;
    details?: Record<string, string | undefined> | string[];
};

export const categoryMap: Record<string, Product[]> = {
    laptop: laptops,
    webcam: webcams,
    headphone: headphones,
    keyboard: keyboards,
    mouse: mouse,
    chair: chairs,
    table: tables,
    processor: processors,
    ram: rams,
    ssd: ssds,
    monitor: monitors
};

export const products: Product[] = [
    ...laptops,
    ...webcams,
    ...headphones,
    ...keyboards,
    ...mouse,
    ...chairs,
    ...tables,
    ...processors,
    ...rams,
    ...ssds,
    ...monitors,
];

function normalizeDetails(details: unknown): Record<string, string> | string[] {
    if (!details) return {};
  
    if (Array.isArray(details)) return details as string[];
    if (typeof details === "object") {
      return Object.fromEntries(
        Object.entries(details).map(([k, v]) => [k, v ?? ""])
      ) as Record<string, string>;
    }
    return [String(details)];
}

export function getProductsByIds(ids: string[], category: keyof typeof categoryMap): Product[] {
    const items = categoryMap[category] || [];
    return items.filter((p) => ids.includes(p.id)).map((p) => ({
        ...p,
        details: normalizeDetails(p.details),
        pros: Array.isArray(p.pros) ? p.pros : p.pros ? [p.pros] : [],
        cons: Array.isArray(p.cons) ? p.cons : p.cons ? [p.cons] : [],
      }));
}

export function getCuratedProductsBySlug(slug: string): Product[] {
    const pick = curatedPicks.find((c) => c.title === slug);
    if (!pick) return [];
    return getProductsByIds(pick.ids, pick.category as keyof typeof categoryMap);
}

export const featuredProducts: Product[] = products.filter(
    (p) => featured.featured.includes(p.id)).map((p) => ({...p})
);

export const productsById: Record<string, Product> = Object.fromEntries(
    products.map(p => [p.id, p])
);

export function getFilteredProducts({ category = "All", sort = "", page = 1, productsPerPage = 20 }) {
    function cleanPrice(price: string) {
      if (!price) return 0;
      if (typeof price === "number") return price;
      return Number(String(price).replace(/[^\d.-]/g, "")) || 0;
    }
    function cleanRating(rating: number | undefined) {
      if (!rating) return 0;
      return typeof rating === "number" ? rating : Number(rating) || 0;
    }

    let filtered = products;
    if (category !== "All") filtered = filtered.filter(p => p.category === category);
  
    filtered = filtered.sort((a, b) => {
      if (sort === "priceLowHigh") {
        return cleanPrice(a.price) - cleanPrice(b.price);
      } else if (sort === "priceHighLow") {
        return cleanPrice(b.price) - cleanPrice(a.price);
      } else if (sort === "ratingHighLow") {
        return cleanRating(b.rating) - cleanRating(a.rating);
      }
      return a.name.localeCompare(b.name);
    });
  
    const totalPages = Math.ceil(filtered.length / productsPerPage);
    const startIndex = (page - 1) * productsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + productsPerPage);
    return { products: paginated, totalPages };
}
