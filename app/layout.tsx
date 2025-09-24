//app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="h-full">
            <body className="min-h-screen flex flex-col text-gray-900 dark:text-gray-100 
                            transition-colors duration-500">
                <Navbar />
                <main className="flex-1 px-4 py-6 transition-colors duration-500 
                                bg-gradient-to-tr from-indigo-400 via-white to-purple-400 
                                dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950 ">
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
                    strategy="afterInteractive"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1041356533581191"
                    crossOrigin="anonymous"
                />
            </body>
        </html>
    );
}
