//components/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="flex">
                    <Image  src="/setupsavvy-logo.png" alt="Logo" width={45} height={45} />
                    <span className="text-3xl pt-1 font-bold text-blue-600">SetupSavvy.in</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6">
                    <Link href="/" className="text-black hover:text-blue-600">Home</Link>
                    <Link href="/products" className="text-black hover:text-blue-600">Products</Link>
                    <Link href="/blog" className="text-black hover:text-blue-600">Guides</Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {open && (
            <div className="md:hidden bg-white shadow-lg px-4 py-2 space-y-2">
                <Link href="/" className="text-black block hover:text-blue-600">Home</Link>
                <Link href="/products" className="text-black block hover:text-blue-600">Products</Link>
                <Link href="/blog" className="text-black block hover:text-blue-600">Guides</Link>
            </div>
            )}
        </nav>
    );
}

