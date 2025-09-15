//components/AdUnitClient.tsx
"use client";
import dynamic from "next/dynamic";
import React from "react";
import type { AdUnitProps } from "./adUnit";

const AdUnit = dynamic(() => import("./adUnit"), { ssr: false });

export default function AdUnitClient(props: AdUnitProps) {
    return <AdUnit {...props} />;
}

