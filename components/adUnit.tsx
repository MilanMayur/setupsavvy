//components/adUnit.tsx
"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

interface AdUnitProps {
    slot: string; 
    format?: string;
    responsive?: boolean;
}

export default function AdUnit({ slot, format = "auto", responsive = true }: AdUnitProps) {
    useEffect(() => {
        try {
           (window.adsbygoogle = window.adsbygoogle || []) as { 
                push: (params?: unknown) => void 
            }[];
            window.adsbygoogle.push({});
        } catch (e) {
            console.error("AdSense error:", e);
        }
    }, []);

    return (
        <ins
            className="adsbygoogle block my-4"
            style={{ display: "block" }}
            data-ad-client="ca-pub-1041356533581191"
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive ? "true" : "false"}
        ></ins>
    );
}
