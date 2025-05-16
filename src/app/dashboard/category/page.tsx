"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryTabs from "@/app/ui/dashboard/category/categoryTabs";
import CreateCategoryModal from "@/app/ui/dashboard/category/createCategoryModal";
import EditCategoryModal from "@/app/ui/dashboard/category/editCategoryModal";
import { getAllCategories, Category } from "@/services/api/category";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";

export default function Page() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null); // State for kategori der redigeres

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryCreated = (newCategory: Category) => {
    fetchCategories();
    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    fetchCategories();
    setIsEditModalOpen(false);
    setCategoryToEdit(null); // Nulstil valgt kategori
  };

  if (isLoading && categories.length === 0) {
    return (
      <main className="p-8 bg-gray-800 text-white min-h-screen flex justify-center items-center">
        <p>Indlæser kategorier...</p>
      </main>
    );
  }

  if (error && categories.length === 0) {
    return (
      <main className="p-8 bg-gray-800 text-white min-h-screen flex justify-center items-center">
        <p className="text-red-500">Fejl: {error}</p>
      </main>
    );
  }

  return (
    <main className="relative p-8 bg-gray-800 text-white min-h-screen">
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

        {error && categories.length > 0 && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            <p>Der opstod en fejl: {error}. Viser muligvis forældede data.</p>
          </div>
        )}

        {isLoading && categories.length > 0 && (
          <div className="text-center py-4 text-gray-400">
            Indlæser opdateringer...
          </div>
        )}

        <CategoryTabs
          categories={categories}
          onEditCategory={handleOpenEditModal} // Send handler til tabs
          // onDeleteCategory={}
        />
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
        {isEditModalOpen &&
          categoryToEdit && ( // Sørg for at categoryToEdit ikke er null
            <EditCategoryModal
              key="edit-category-modal"
              isOpen={isEditModalOpen}
              onClose={() => {
                setIsEditModalOpen(false);
                setCategoryToEdit(null); // Nulstil også her for en sikkerheds skyld
              }}
              categoryToEdit={categoryToEdit}
              onCategoryUpdated={handleCategoryUpdated}
            />
          )}
      </AnimatePresence>
    </main>
  );
}
