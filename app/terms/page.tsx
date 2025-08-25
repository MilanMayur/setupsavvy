//app/terms/page.tsx
import { Scale, Shield, Info } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
            <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
                    <Scale className="w-7 h-7 text-blue-600" />
                    Terms & Conditions
                </h1>
                <p className="text-sm text-gray-500 mb-6">Last updated: August 2025</p>

                <p className="mb-6 text-gray-700 leading-relaxed">
                    Welcome to <strong>SetupSavvy</strong>! By accessing our website (
                    <a href="https://setupsavvy.in" className="text-blue-600 hover:underline">
                        https://setupsavvy.in
                    </a>
                    ), you agree to comply with and be bound by the following terms.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mt-8 mb-3">
                    <Info className="w-6 h-6 text-green-600" />
                    Use of the Website
                </h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 marker:text-blue-500">
                    <li>Content is for informational and educational purposes only.</li>
                    <li>You agree not to misuse the website (spamming, hacking, illegal activity).</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mt-8 mb-3">
                    <Shield className="w-6 h-6 text-purple-600" />
                    Intellectual Property
                </h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed mb-6 marker:text-blue-500">
                    <li>The SetupSavvy logo, website design, and original written content are owned by SetupSavvy.</li>
                    <li>Product images, descriptions, and information sourced from Amazon remain the property of 
                        Amazon or the respective sellers/brands.</li>
                    <li>You may not copy, reproduce, or redistribute SetupSavvy’s original content or branding 
                        without permission.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mt-8 mb-3">
                    <Info className="w-6 h-6 text-red-600" />
                    Disclaimer
                </h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                    SetupSavvy participates in the Amazon Associates Program, an affiliate 
                    advertising program designed to provide a means for sites to earn fees by 
                    linking to Amazon.in and related sites. This means we may earn a commission 
                    when you purchase through our links, at no extra cost to you.
                </p>
                <p className="mb-4 text-gray-700 leading-relaxed">
                    While we strive to provide accurate product information (including price, 
                    availability, and features), details may change over time and we cannot 
                    guarantee 100% accuracy. Always check the latest information on Amazon before 
                    making a purchase.
                </p>
                <p className="mb-4 text-gray-700 leading-relaxed">
                    <span className="font-semibold text-red-600">
                        We are not liable for any loss/damage
                    </span>{" "}
                    , or issues that may arise from 
                    using products purchased through affiliate links or from the use of this 
                    website.
                </p>

                <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">Changes</h2>
                <p className="text-gray-700 leading-relaxed">
                    SetupSavvy may update these Terms at any time. Continued use of the site means you 
                    accept the updated Terms. For questions, contact us at{" "}
                    <a href="mailto:setupsavvy.in@gmail.com" 
                        className="text-blue-600 hover:underline">
                        setupsavvy.in@gmail.com
                    </a>.
                </p>
            </div>
        </div>
    );
}
