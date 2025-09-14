//components/AdUnitClient.tsx
"use client";
import dynamic from "next/dynamic";
import React from "react";

const AdUnit = dynamic(() => import("./adUnit"), { ssr: false });

type AdUnitProps = React.ComponentProps<typeof AdUnit>;

export default function AdUnitClient(props: any) {
    return <AdUnit {...props} />;
}
