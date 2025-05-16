"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Category, deleteCategory } from "@/services/api/category"; // Antager deleteCategory findes

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToDelete: Category | null;
  onCategoryDeleted: (categoryId: string) => void;
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

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  categoryToDelete,
  onCategoryDeleted,
}: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    setError(null);
    try {
      await deleteCategory(categoryToDelete.id);
      onCategoryDeleted(categoryToDelete.id);
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ukendt fejl ved sletning af kategori."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !categoryToDelete) return null;

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
        className="bg-gray-800 border-4 border-red-500 p-6 rounded-lg shadow-xl w-full max-w-md" // Rød kant for sletning
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-100">
          Slet Kategori
        </h2>
        <p className="text-gray-300 mb-6">
          Er du sikker på, at du vil slette kategorien "
          <span className="font-semibold text-gray-100">
            {categoryToDelete.name}
          </span>
          "? Denne handling kan ikke fortrydes.
        </p>
        {error && (
          <p className="text-sm text-red-400 bg-red-900 p-3 rounded mb-4 border border-red-700">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 disabled:opacity-50 transition-colors"
          >
            Annuller
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? "Sletter..." : "Slet Kategori"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
