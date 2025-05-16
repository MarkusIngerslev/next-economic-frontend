"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { Category, updateCategory } from "@/services/api/category";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit: Category | null;
  onCategoryUpdated: (updatedCategory: Category) => void;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { y: "-50px", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  exit: { y: "50px", opacity: 0 },
};

export default function EditCategoryModal({
  isOpen,
  onClose,
  categoryToEdit,
  onCategoryUpdated,
}: EditCategoryModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setError(null); 
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!categoryToEdit) {
      setError("Ingen kategori valgt til redigering.");
      return;
    }
    if (!name.trim()) {
      setError("Navn på kategori må ikke være tomt.");
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      const updatedData = { name, type };
      const updated = await updateCategory(categoryToEdit.id, updatedData);
      onCategoryUpdated(updated);
    } catch (err) {
      console.error("Failed to update category:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ukendt fejl ved opdatering af kategori."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !categoryToEdit) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex justify-center items-center backdrop-blur-xs"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 border-4 border-slate-600 p-6 rounded-lg shadow-xl w-full max-w-md"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">
          Rediger Kategori: {categoryToEdit.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="editCategoryName"
                className="block text-sm font-medium text-gray-300"
              >
                Navn på Kategori
              </label>
              <input
                type="text"
                id="editCategoryName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                disabled={isSaving}
              />
            </div>
            <div>
              <label
                htmlFor="editCategoryType"
                className="block text-sm font-medium text-gray-300"
              >
                Type
              </label>
              <select
                id="editCategoryType"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "income" | "expense")
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                disabled={isSaving}
              >
                <option value="expense">Udgift</option>
                <option value="income">Indtægt</option>
              </select>
            </div>
            {error && (
              <p className="text-sm text-red-500 bg-red-100 p-2 rounded border border-red-300">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 disabled:opacity-50 transition-colors"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 disabled:opacity-50 transition-colors"
            >
              {isSaving ? "Gemmer..." : "Gem Ændringer"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
