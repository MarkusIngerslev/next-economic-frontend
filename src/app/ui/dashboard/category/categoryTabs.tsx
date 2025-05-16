"use client";

import { useState } from "react";
import { Category } from "@/services/api/category";
import CategoryTable from "./categoryTable"; // Korrekt sti hvis i samme mappe

interface CategoryTabsProps {
  categories: Category[];
}

type TabType = "income" | "expense";

export default function CategoryTabs({ categories }: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("income");

  const filteredCategories = categories.filter(
    (category) => category.type === activeTab
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const tabBaseStyle =
    "py-2 px-6 font-medium text-sm rounded-md focus:outline-none transition-colors duration-150 ease-in-out";
  // Styling baseret på billedet: Aktiv tab er lysere.
  const activeTabStyle = "bg-gray-600 text-white";
  const inactiveTabStyle =
    "bg-gray-700 text-gray-300 hover:bg-gray-650 hover:text-gray-100";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6 flex justify-center space-x-1 p-1 bg-gray-900 rounded-lg shadow-md">
        <button
          onClick={() => handleTabChange("income")}
          className={`${tabBaseStyle} ${
            activeTab === "income" ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Indtægter
        </button>
        <button
          onClick={() => handleTabChange("expense")}
          className={`${tabBaseStyle} ${
            activeTab === "expense" ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Udgifter
        </button>
      </div>
      <CategoryTable categories={filteredCategories} />
    </div>
  );
}
