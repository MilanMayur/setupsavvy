//components/pagination.tsx
"use client";
import Link from "next/link";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    basePath: string;
    onPageChange?: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, basePath, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            i === currentPage ||
            i === currentPage - 1 ||
            i === currentPage + 1
        ) {
            pageNumbers.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pageNumbers.push("...");
        }
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {/* Previous Button */}
            {onPageChange ? (
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border bg-white text-blue-600 border-gray-300 
                            hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
                ← Prev
            </button>
            ) : currentPage > 1 ? (
            <Link
                href={`${basePath}?page=${currentPage - 1}`}
                className="px-4 py-2 rounded-md border bg-white text-blue-600 border-gray-300 
                            hover:bg-gray-100"
            >
                ← Previous
            </Link>
            ) : (
                <span className="px-4 py-2 rounded-md border bg-gray-200 text-gray-400 
                                cursor-not-allowed">
                    ← Previous
                </span>
            )}

            {/* Page numbers */}
            {pageNumbers.map((num, idx) =>
                num === "..." ? (
                    <span key={idx} className="px-2">...</span>
                ) : onPageChange ? (
            <button
                key={idx}
                onClick={() => onPageChange(num as number)}
                className={`px-3 py-1 rounded-md border cursor-pointer ${
                    currentPage === num
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
            >
                {num}
            </button>
            ) : (
            <Link
                key={idx}
                href={`${basePath}?page=${num}`}
                className={`px-3 py-1 rounded-md border ${
                    currentPage === num
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-gray-100"
                }`}
            >
                {num}
            </Link>
            )
            )}

            {/* Next Button */}
            {onPageChange ? (
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border bg-white text-blue-600 border-gray-300 
                            hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
            >
                Next →
            </button>
            ) : currentPage < totalPages ? (
            <Link
                href={`${basePath}?page=${currentPage + 1}`}
                className="px-4 py-2 rounded-md border bg-white text-blue-600 border-gray-300 
                            hover:bg-gray-100"
            >
                Next →
            </Link>
            ) : (
                <span className="px-4 py-2 rounded-md border bg-gray-200 text-gray-400 
                                cursor-not-allowed">
                    Next →
                </span>
            )}
        </div>
    );
}
