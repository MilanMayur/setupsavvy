//app/privacy-policy/page.tsx
import AdUnit from "@/components/adUnit";
import { ShieldCheck, Shield, Info, Globe, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 rounded-2xl">
            <div className="max-w-7xl mx-auto bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-7 h-7 text-blue-600" />
                    Privacy Policy
                </h1>

                <p className="text-sm text-gray-500 mb-6">
                    Last updated: {new Date().toLocaleDateString()}
                </p>

                <p className="text-gray-600 mb-6">
                    At <strong>SetupSavvy</strong>, accessible from{" "}
                    <a href="https://setupsavvy.in"
                        className="text-blue-600 hover:underline"
                    >
                        https://setupsavvy.in
                    </a>
                    , we respect your privacy. This Privacy Policy explains how we
                    collect, use, and safeguard your information.
                </p>

                {/* Section: Information We Collect */}
                <div className="mb-8">
                    <h2 className="flex items-center text-2xl font-semibold text-gray-800 mb-3">
                        <Info className="w-6 h-6 mr-2 text-blue-500" /> Information We Collect
                    </h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Log data (IP address, browser type, pages visited).</li>
                        <li>Cookies to improve user experience.</li>
                        <li>Information you provide through forms (like your name or email).</li>
                    </ul>
                </div>

                {/* Section: Use of Information */}
                <div className="mb-8">
                    <h2 className="flex items-center text-2xl font-semibold text-gray-800 mb-3">
                        <Shield className="w-6 h-6 mr-2 text-green-500" /> Use of Information
                    </h2>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Improve website content and services.</li>
                        <li>Display personalized ads through Google AdSense.</li>
                        <li>Respond to inquiries.</li>
                    </ul>
                </div>

                {/* Section: Google AdSense */}
                <div className="mb-8">
                    <h2 className="flex items-center text-2xl font-semibold text-gray-800 mb-3">
                        <Globe className="w-6 h-6 mr-2 text-yellow-500" /> Google AdSense
                    </h2>
                    <p className="text-gray-600">
                        Third-party vendors, including Google, use cookies to serve ads.
                        Google’s use of advertising cookies enables it and its partners to
                        serve ads based on your visit to our site and/or other sites on the
                        Internet. You may opt out of personalized advertising by visiting{" "}
                        <a href="https://www.google.com/settings/ads"
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            Google Ads Settings
                        </a>
                        .
                    </p>
                </div>

                {/* Section: Consent */}
                <div className="mb-8">
                    <h2 className="flex items-center text-2xl font-semibold text-gray-800 mb-3">
                        <UserCheck className="w-6 h-6 mr-2 text-purple-500" /> Your Consent
                    </h2>
                    <p className="text-gray-600">
                        By using our site, you consent to our Privacy Policy. For questions,
                        please contact us at{" "}
                        <a href="mailto:setupsavvy.in@gmail.com"
                            className="text-blue-600 hover:underline"
                        >
                            setupsavvy.in@gmail.com
                        </a>
                        .
                    </p>
                </div>   

                {/* AdSense Ad Unit */}
                <AdUnit slot="1234567890" />
            </div>
        </div>
    );
}

