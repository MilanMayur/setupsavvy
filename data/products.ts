//data/products.ts
import featured from "./featured.json";
import laptops from "./laptops/laptops.json";
import webcams from "./webcams/webcams.json";
import headsets from "./headsets/headsets.json";
import keyboards from "./keyboards/keyboards.json";
import mouse from "./mouse/mouse.json";
//import chairs from "./chairs/chairs.json";
import tables from "./tables/tables.json";

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
    laptops,
    webcams,
    headsets,
    keyboards,
    mouse,
    //chairs,
    tables,
};

export const products: Product[] = [
    ...laptops,
    ...webcams,
    ...headsets,
    ...keyboards,
    ...mouse,
    //...chairs,
    ...tables,
];

export function getProductsByIds(ids: string[], category: keyof typeof categoryMap): Product[] {
    const items = categoryMap[category] || [];
    return items.filter((p) => ids.includes(p.id)).map((p) => ({
        ...p,
        details: normalizeDetails(p.details),
        pros: Array.isArray(p.pros) ? p.pros : p.pros ? [p.pros] : [],
        cons: Array.isArray(p.cons) ? p.cons : p.cons ? [p.cons] : [],
      }));
}

function normalizeDetails(details: any): Record<string, string> | string[] {
    if (!details) return {};
  
    if (Array.isArray(details)) return details as string[];
    if (typeof details === "object") {
      return Object.fromEntries(
        Object.entries(details).map(([k, v]) => [k, v ?? ""])
      ) as Record<string, string>;
    }
    return [String(details)];
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

