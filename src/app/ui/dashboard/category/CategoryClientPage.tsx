"use client";

import { useEffect, useState, useCallback } from "react";
import CategoryTabs from "@/app/ui/dashboard/category/categoryTabs";
import CreateCategoryModal from "@/app/ui/dashboard/category/createCategoryModal";
import EditCategoryModal from "@/app/ui/dashboard/category/editCategoryModal";
import DeleteCategoryModal from "@/app/ui/dashboard/category/deleteCategoryModal";
import {
  getAllCategories,
  Category,
  createCategory,
} from "@/services/api/category";
import { standardCategoriesToCreate } from "@/app/lib/default-categories";
import { PlusIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";

export default function CategoryClientPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedCategories = await getAllCategories();
      setCategories(fetchedCategories); // Sæt altid kategorier baseret på fetch
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
    setCategoryToEdit(null);
  };

  const handleOpenDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const handleCategoryDeleted = (deletedCategoryId: string) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat.id !== deletedCategoryId)
    ); // Optimistisk opdatering
    // fetchCategories(); // Eller gen-hent for konsistens
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const createStandardCategories = async () => {
    console.log("Attempting to create standard categories by user request...");
    const results = await Promise.allSettled(
      standardCategoriesToCreate.map((cat) => createCategory(cat))
    );

    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Failed to create standard category "${standardCategoriesToCreate[index].name}":`,
          result.reason
        );
      } else {
        console.log(
          `Successfully created standard category "${standardCategoriesToCreate[index].name}".`
        );
      }
    });
    // Gen-hent kategorier efter oprettelse
    await fetchCategories();
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
          <div className="flex space-x-2">
            <button
              onClick={createStandardCategories}
              disabled={isLoading || error !== null || categories.length > 0}
              className={`px-4 py-2 text-white rounded-md transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                isLoading || error !== null || categories.length > 0
                  ? "bg-green-800 cursor-not-allowed focus:ring-green-800" // Styling for disabled state
                  : "bg-green-500 hover:bg-green-600 focus:ring-green-400" // Styling for enabled state
              }`}
            >
              Opret Standardkategorier
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isLoading} // Deaktiver også "Opret Ny Kategori" under indlæsning for konsistens
              className={`flex items-center px-4 py-2 text-white rounded-md transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                isLoading
                  ? "bg-gray-500 cursor-not-allowed focus:ring-gray-400"
                  : "bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400"
              }`}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Opret Ny Kategori
            </button>
          </div>
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

        {/* Viser en besked hvis der ingen kategorier er, og loading er færdig, og der ikke er fejl */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-400 mb-4">
              Du har endnu ingen kategorier.
            </p>
            <p className="text-gray-500">
              Du kan oprette standardkategorier ved at klikke på knappen
              ovenfor, eller oprette dine egne.
            </p>
          </div>
        )}

        {categories.length > 0 && (
          <CategoryTabs
            categories={categories}
            onEditCategory={handleOpenEditModal}
            onDeleteCategory={handleOpenDeleteModal}
          />
        )}
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
        {isEditModalOpen && categoryToEdit && (
          <EditCategoryModal
            key="edit-category-modal"
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setCategoryToEdit(null);
            }}
            categoryToEdit={categoryToEdit}
            onCategoryUpdated={handleCategoryUpdated}
          />
        )}
        {isDeleteModalOpen && categoryToDelete && (
          <DeleteCategoryModal
            key="delete-category-modal"
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setCategoryToDelete(null);
            }}
            categoryToDelete={categoryToDelete}
            onCategoryDeleted={handleCategoryDeleted}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
