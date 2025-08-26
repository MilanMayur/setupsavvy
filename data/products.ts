//data/products.ts
import headsets from "./headsets-10-5000.json";
import chairs from "./chairs.json";
import tables from "./tables.json";
import laptops from "./laptops-5-60000.json";
import keyboards from "./keyboards-10-4000.json";

export const products = [
    ...headsets,
    ...keyboards,
    ...chairs,
    ...tables,
    ...laptops,
];

