//app/about/page.tsx
import AdUnit from "@/components/adUnit";
import { Lightbulb, Rocket, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="max-w-3xl mt-10 mx-auto bg-white shadow-md rounded-2xl p-8">
            <h1 className="text-4xl text-gray-800 font-extrabold mb-6 text-center">
                About <span className="text-blue-600">SetupSavvy</span>
            </h1>
            
            <p className="text-lg text-gray-700 mb-8 text-center">
                We make tech simple, practical, and beginner-friendly.  
                No jargon, no fluff—just clear guides, smart tips, and honest reviews.  
            </p>

            {/* Mission, What We Do, Vision Sections */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="p-6 rounded-2xl shadow bg-white">
                    <Lightbulb className="w-10 h-10 text-blue-600 mb-4" />
                    <h2 className="text-xl text-gray-800 font-semibold mb-2">Our Mission</h2>
                    <p className="text-gray-600">
                        Help students, creators, and professionals spend less time 
                        figuring things out—and more time doing what they love.
                    </p>
                </div>

                <div className="p-6 rounded-2xl shadow bg-white">
                    <Users className="w-10 h-10 text-blue-600 mb-4" />
                    <h2 className="text-xl text-gray-800 font-semibold mb-2">What We Do</h2>
                    <p className="text-gray-600">
                        Step-by-step tutorials, setup guides, and reviews that actually 
                        make sense—even if you’re not “techy.”
                    </p>
                </div>

                <div className="p-6 rounded-2xl shadow bg-white">
                    <Rocket className="w-10 h-10 text-blue-600 mb-4" />
                    <h2 className="text-xl text-gray-800 font-semibold mb-2">Our Vision</h2>
                    <p className="text-gray-600">
                        Build a community where anyone can learn, share, and level up 
                        their digital life with confidence.
                    </p>
                </div>
            </div>

            <p className="text-center text-gray-800">
                Got feedback, ideas, or just want to say hi?  
                Reach out anytime via our{" "}
                <a href="/contact" className="text-blue-600 hover:underline font-medium">
                    Contact Page
                </a>.
            </p>

            {/* AdSense Ad Unit */}
            <AdUnit slot="1234567890" />
        </div>
    );
}
