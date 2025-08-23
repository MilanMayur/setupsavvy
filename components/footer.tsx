//components/footer.tsx
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
            </div>
        </footer>
    );
}
