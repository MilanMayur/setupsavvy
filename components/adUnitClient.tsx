//components/AdUnitClient.tsx
"use client";
import dynamic from "next/dynamic";

const AdUnit = dynamic(() => import("./adUnit"), { ssr: false });

export default function AdUnitClient(props: any) {
    return <AdUnit {...props} />;
}
