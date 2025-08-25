//app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";

export const metadata = {
    title: "SetupSavvy - Best Product Deals",
    description: "Find the best laptops, chairs, tables, and accessories with reviews and affiliate links.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                {/* Google AdSense meta tag */}
                <meta
                    name="google-adsense-account"
                    content="ca-pub-1041356533581191"
                />
            </head>
            <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-6">
                    {children}
                </main>
                <Footer />

                {/* Google Analytics */}
                <Script
                    strategy="afterInteractive"
                    src="https://www.googletagmanager.com/gtag/js?id=G-CZDHW1SCMD"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-CZDHW1SCMD');
                    `}
                </Script>

                {/* Google AdSense */}
                <Script
                    id="adsbygoogle-init"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1041356533581191"
                    crossOrigin="anonymous"
                />

            </body>
        </html>
    );
}
