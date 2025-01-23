"use client";
import { FC, useState } from "react";

interface FilterComponentProps {
  onFilterChange?: (
    filterType: string,
    selectedValue: string,
    year: string
  ) => void;
}

const FilterComponent: FC<FilterComponentProps> = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const handleFilterChange = () => {
    onFilterChange?.(filterType, selectedValue, selectedYear);
  };

  const getFilterOptions = () => {
    if (filterType === "month") {
      return [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
    } else if (filterType === "quarter") {
      return ["1st Quarter", "2nd Quarter", "3rd Quarter", "4th Quarter"];
    }
    return [];
  };

  return (
    <div className="flex items-center gap-4 border p-4 rounded-md shadow-md">
      {/* Filter Type Dropdown */}
      <select
        value={filterType}
        onChange={(e) => {
          setFilterType(e.target.value);
          setSelectedValue(""); // Reset selected value when filter type changes
        }}
        className="p-2 rounded-md bg-white border focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Filter</option>
        <option value="quarter">Quarter</option>
        <option value="month">Month</option>
        <option value="year">Year</option>
      </select>

      {/* Dynamic Value Dropdown */}
      {filterType && filterType !== "year" && (
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="p-2 rounded-md bg-white border focus:outline-none focus:border-blue-500"
        >
          <option value="">
            Select {filterType === "month" ? "Month" : "Quarter"}
          </option>
          {getFilterOptions().map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}

      {/* Year Dropdown */}
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="p-2 rounded-md bg-white border focus:outline-none focus:border-blue-500"
      >
        <option value="">Select Year</option>
        {Array.from({ length: 5 }, (_, i) => (
          <option key={i} value={new Date().getFullYear() - i}>
            {new Date().getFullYear() - i}
          </option>
        ))}
      </select>

      {/* Apply Button */}
      <button
        onClick={handleFilterChange}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none focus:border-none"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default FilterComponent;
