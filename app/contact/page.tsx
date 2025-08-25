//app/contact/page.tsx
import { Mail, Globe, Instagram, Twitter, Linkedin } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">📬 Get in Touch</h1>
                <p className="text-center text-gray-600 mb-10">
                    Have a question, suggestion, or collaboration idea? 
                    We’d love to hear from you!
                </p>

                {/* Contact Cards */}
                <div className="grid gap-6 md:grid-cols-2 text-center mt-20">
                    <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
                        <Mail className="w-6 h-6 mb-2 text-blue-600" />
                        <h2 className="font-semibold text-gray-800">Email</h2>
                        <a href="mailto:setupsavvy.in@gmail.com" 
                            className="text-blue-600 hover:underline"
                        >
                            setupsavvy.in@gmail.com
                        </a>
                    </div>

                    <div className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition">
                        <Globe className="w-6 h-6 mb-2 text-green-600" />
                        <h2 className="font-semibold text-gray-800">Website</h2>
                        <a href="https://setupsavvy.in" 
                            target="_blank" 
                            className="text-green-600 hover:underline"
                        >
                            setupsavvy.in
                        </a>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-20 text-center">
                    <p className="text-gray-600 mb-4">Or connect with us on social media:</p>
                    <div className="flex justify-center gap-6 text-gray-700">
                        <a href="#" target="_blank"><Instagram className="w-6 h-6 hover:text-pink-500" /></a>
                        <a href="#" target="_blank"><Twitter className="w-6 h-6 hover:text-blue-400" /></a>
                        <a href="#" target="_blank"><Linkedin className="w-6 h-6 hover:text-blue-700" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}
