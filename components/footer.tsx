//components/footer.tsx
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} SetupSavvy. All rights reserved.
                </p>
                <p className="text-xs mt-2">
                    Disclaimer: This site contains affiliate links. We may earn a commission when you buy through them.
                </p>

                {/* Footer Links */}
                <div className="flex justify-center gap-6 mt-4 text-sm">
                    <Link href="/about" className="hover:text-white">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-white">
                        Contact
                    </Link>
                    <Link href="/privacy-policy" className="hover:text-white">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-white">
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}
