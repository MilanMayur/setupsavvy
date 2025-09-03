//app/head.tsx
export default function Head() {
    return (
        <>
            <title>SetupSavvy.in - Guide For Your Dream Setup</title>
            <meta
                name="description"
                content="Find the best work-from-home accessories with reviews and curated picks. 
                        Boost your productivity and comfort."
            />
            <meta
                name="google-adsense-account"
                content="ca-pub-1041356533581191"
            />

            {/* Favicons */}
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <meta name="theme-color" content="#2563eb" />
  
            {/* Open Graph */}
            <meta 
                property="og:title" 
                content="SetupSavvy - Guide For Your Dream Setup" 
            />
            <meta
                property="og:description"
                content="Find the best WFH accessories with reviews and curated picks."
            />
            <meta
                property="og:image"
                content="https://www.setupsavvy.in/setupsavvy-logo.png"
            />
            <meta 
                property="og:url" 
                content="https://www.setupsavvy.in" 
            />
            <meta 
                property="og:type" 
                content="website" 
            />
  
            {/* Twitter Card */}
            <meta 
                name="twitter:card" 
                content="summary_large_image" 
            />
            <meta 
                name="twitter:title" 
                content="SetupSavvy - Guide For Your Dream Setup" 
            />
            <meta
                name="twitter:description"
                content="Boost productivity & comfort with our top WFH picks."
            />
            <meta
                name="twitter:image"
                content="https://www.setupsavvy.in/setupsavvy-logo.png"
            />
  
            {/* Structured Data for Logo */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "url": "https://www.setupsavvy.in",
                        "name": "SetupSavvy",
                        "logo": "https://www.setupsavvy.in/setupsavvy-logo.png",
                    }),
                }}
            />
        </>
    );
}
  
