//components/adUnit.tsx
"use client";

import { useEffect, useRef } from "react";

declare global {
    interface Window {
        adsbygoogle: unknown[];
    }
}

export interface AdUnitProps {
    slot: string; 
    format?: string;
    responsive?: boolean;
}

export default function AdUnit({ slot, format = "auto", responsive = true }: AdUnitProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const adRef = useRef<HTMLModElement>(null);
    const initializedRef = useRef(false);

    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;

        let frameId: number | undefined;

        const initializeAd = () => {
            const container = containerRef.current;
            const ad = adRef.current;

            if (
                !container ||
                !ad ||
                initializedRef.current ||
                container.getBoundingClientRect().width <= 0
            ) {
                return;
            }

            try {
                initializedRef.current = true;
                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
            } catch (error) {
                initializedRef.current = false;
                console.error("AdSense error:", error);
            }
        };

        const scheduleInitialization = () => {
            if (frameId !== undefined) window.cancelAnimationFrame(frameId);
            frameId = window.requestAnimationFrame(initializeAd);
        };

        scheduleInitialization();

        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.some((entry) => entry.contentRect.width > 0)) {
                scheduleInitialization();
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (frameId !== undefined) window.cancelAnimationFrame(frameId);
            resizeObserver.disconnect();
        };
    }, []);

    if (process.env.NODE_ENV !== "production") {
        return null;
    }

    return (
        <div ref={containerRef} className="w-full min-w-0">
            <ins
                ref={adRef}
                className="adsbygoogle block w-full"
                style={{ display: "block", width: "100%" }}
                data-ad-client="ca-pub-1041356533581191"
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? "true" : "false"}
            />
        </div>
    );
}
