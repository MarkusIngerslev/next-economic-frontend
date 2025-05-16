"use client";

import { useState } from "react";
import { Category } from "@/services/api/category";
import CategoryTable from "./categoryTable";

interface CategoryTabsProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: Category) => void;
}

type TabType = "income" | "expense";

export default function CategoryTabs({
  categories,
  onEditCategory,
  onDeleteCategory,
}: CategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("income");

  const filteredCategories = categories.filter(
    (category) => category.type === activeTab
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Basis styling for faneblade - nu med rounded-t-lg
  const tabBaseStyleLeft =
    "py-2 px-6 font-medium text-sm rounded-tl-lg focus:outline-none transition-colors duration-150 ease-in-out";

  const tabBaseStyleRight =
    "py-2 px-6 font-medium text-sm rounded-tr-lg focus:outline-none transition-colors duration-150 ease-in-out";

  // Aktiv faneblad - matcher thead farven
  const activeTabStyle = "bg-gray-600 text-white";

  // Inaktiv faneblad - mørkere baggrund
  const inactiveTabStyle =
    "bg-gray-700 text-gray-300 hover:bg-gray-700 hover:text-gray-100";

  return (
    <div className="w-full ">
      <div className="flex">
        <button
          onClick={() => handleTabChange("income")}
          className={`${tabBaseStyleLeft} ${
            activeTab === "income" ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Indtægter
        </button>
        <button
          onClick={() => handleTabChange("expense")}
          className={`${tabBaseStyleRight} ${
            activeTab === "expense" ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Udgifter
        </button>
      </div>
      <CategoryTable
        categories={filteredCategories}
        onEditCategory={onEditCategory}
        onDeleteCategory={onDeleteCategory}
      />
    </div>
  );
}
