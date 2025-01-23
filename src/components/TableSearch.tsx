"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Handle input change to update the search term and URL immediately
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Update URL with the search term immediately
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set("search", value); // Set the search term in the URL
    } else {
      params.delete("search"); // Remove search param if input is empty
    }
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="sm:flex sm:items-center justify-between">
      <div className="flex gap-4 flex-grow">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search"
          className="w-full sm:w-72 px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default TableSearch;
