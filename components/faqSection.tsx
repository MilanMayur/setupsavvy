//components/faqSection.tsx
"use client";
import { useState } from "react";

type Faq = {
    question: string;
    answer: string;
};

export default function FaqSection({ faqs }: { faqs: Faq[] }) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">FAQs</h2>
            <div className="space-y-3">
            {faqs.map((faq, index) => (
                <div key={index} className="border bg-gray-100 dark:text-black rounded-lg p-4 shadow-sm">
                    <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full text-left font-semibold flex justify-between cursor-pointer"
                    >
                        {faq.question}
                        <span>{openFaq === index ? "−" : "+"}</span>
                    </button>
                    {openFaq === index && (
                    <p className="mt-2 dark:text-black">{faq.answer}</p>
                    )}
                </div>
            ))}
            </div>
        </div>
    );
}
