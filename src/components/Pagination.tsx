"use client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  // Helper function to generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const range = 2; // Number of pages to show before and after the current page

    // Show the first page if needed
    if (page > range + 1) {
      pageNumbers.push(1);
      if (page > range + 2) pageNumbers.push("...");
    }

    // Show pages around the current page without duplication
    for (
      let i = Math.max(1, page - range);
      i <= Math.min(totalPages, page + range);
      i++
    ) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    // Show the last page if needed
    if (page < totalPages - range) {
      if (!pageNumbers.includes("...") && page < totalPages - range - 1)
        pageNumbers.push("...");
      if (!pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="p-4 flex items-center justify-center gap-2 text-gray-500">
      {/* Prev Button */}
      <button
        disabled={!hasPrev}
        className="w-16 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 font-medium">
        {getPageNumbers().map((pageIndex, index) => {
          if (pageIndex === "...") {
            return (
              <span key={index} className="text-gray-500">
                ...
              </span>
            );
          }
          return (
            <button
              key={pageIndex}
              className={`w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 ${
                page === pageIndex
                  ? "bg-blue-500 text-white font-bold"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => changePage(pageIndex as number)}
            >
              {pageIndex}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        disabled={!hasNext}
        className="w-16 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
