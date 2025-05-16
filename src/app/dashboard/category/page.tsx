"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryTabs from "@/app/ui/dashboard/category/categoryTabs";
import CreateCategoryModal from "@/app/ui/dashboard/category/createCategoryModal";
import { getAllCategories, Category } from "@/services/api/category";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    // Wrap med useCallback
    try {
      setIsLoading(true);
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories on client:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ukendt fejl ved hentning af kategorier"
      );
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Tom dependency array, da den ikke afhænger af props/state udefra

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // Kald fetchCategories når komponenten mounter, og hvis fetchCategories ændrer sig

  const handleCategoryCreated = (newCategory: Category) => {
    // setCategories((prevCategories) => [...prevCategories, newCategory]); // Optimistisk opdatering
    fetchCategories(); // Eller gen-hent alle for at sikre konsistens
    setIsCreateModalOpen(false); // Luk modalen
  };

  if (isLoading && categories.length === 0) {
    // Vis kun fuldskærmsloader ved initial load
    return (
      <main className="p-8 bg-gray-800 text-white  flex justify-center items-center">
        <p>Indlæser kategorier...</p>
      </main>
    );
  }

  if (error && categories.length === 0) {
    // Vis kun fuldskærmsfejl hvis ingen kategorier er loadet
    return (
      <main className="p-8 bg-gray-800 text-white  flex justify-center items-center">
        <p className="text-red-500">Fejl: {error}</p>
      </main>
    );
  }

  return (
    <main className="relative border p-8 bg-gray-800 text-white">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Kategorier</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Opret Ny Kategori
          </button>
        </div>

        {/* Vis fejlbesked her, hvis der er en, men vi stadig har kategorier at vise */}
        {error && categories.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            <p>Der opstod en fejl: {error}. Viser muligvis forældede data.</p>
          </div>
        )}

        {/* Viser loading spinner/tekst hvis vi re-fetcher men allerede har data */}
        {isLoading && categories.length > 0 && (
          <div className="text-center py-4 text-gray-400">
            Indlæser opdateringer...
          </div>
        )}

        <CategoryTabs categories={categories} />
      </div>

      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateCategoryModal
            key="create-category-modal"
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onCategoryCreated={handleCategoryCreated}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
