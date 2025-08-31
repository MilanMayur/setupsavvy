//data/products.ts
import featured from "./featured.json";
import laptops from "./laptops/laptops.json";
import webcams from "./webcams/webcams.json";
import headsets from "./headsets/headsets.json";
import keyboards from "./keyboards/keyboards.json";
import mouse from "./mouse/mouse.json";
//import chairs from "./chairs/chairs.json";
//import tables from "./tables/tables.json";

import laptopUnder60000 from "./laptops/under-60000.json";
import webcamUnder10000 from "./webcams/under-10000.json";
import headsetUnder5000 from "./headsets/under-5000.json";
import keyboardUnder4000 from "./keyboards/under-4000.json";
import mouseUnder4000 from "./mouse/under-4000.json";

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
    //tables,
};

export const products: Product[] = [
    ...laptops,
    ...webcams,
    ...headsets,
    ...keyboards,
    ...mouse,
    //...chairs,
    //...tables,
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

export const laptop5Under60000 = getProductsByIds(laptopUnder60000.ids, "laptops");
export const webcam10Under10000 = getProductsByIds(webcamUnder10000.ids, "webcams");
export const headset10Under5000 = getProductsByIds(headsetUnder5000.ids, "headsets");
export const keyboard10Under4000 = getProductsByIds(keyboardUnder4000.ids, "keyboards");
export const mouse10Under4000 = getProductsByIds(mouseUnder4000.ids, "mouse");

export const featuredProducts: Product[] = products.filter(
    (p) => featured.featured.includes(p.id)).map((p) => ({...p})
);
