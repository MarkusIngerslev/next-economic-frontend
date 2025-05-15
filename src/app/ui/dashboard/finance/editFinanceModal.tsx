"use client";

import React, { useState, useEffect } from "react";
import { IncomeRecord, IncomeUpdatePayload } from "@/services/api";
import { Category } from "@/services/api/category";
import { motion } from "framer-motion";

interface EditIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  incomeRecord: IncomeRecord | null;
  onSave: (id: string, updatedData: IncomeUpdatePayload) => Promise<void>;
  categories?: Category[];
}

const modalVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function EditFinanceModal({
  isOpen,
  onClose,
  incomeRecord,
  onSave,
  categories,
}: EditIncomeModalProps) {
  const [formData, setFormData] = useState<{
    amount: string;
    description: string;
    date: string;
    categoryId?: string;
  }>({
    amount: "",
    description: "",
    date: "",
    categoryId: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (incomeRecord) {
      setFormData({
        amount: incomeRecord.amount,
        description: incomeRecord.description,
        date: incomeRecord.date ? incomeRecord.date.split("T")[0] : "",
        categoryId: incomeRecord.category.id,
      });
      setError(null);
    }
  }, [incomeRecord]);

  if (!isOpen || !incomeRecord) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!incomeRecord) return;
    setIsSaving(true);
    setError(null);

    const changedData: IncomeUpdatePayload = {};

    // Sammenlign med oprindelige værdier for at finde ændringer
    if (formData.amount !== incomeRecord.amount) {
      const numericAmount = parseFloat(formData.amount);
      if (isNaN(numericAmount)) {
        setError("Beløbet skal være et gyldigt tal.");
        setIsSaving(false);
        return;
      }
      changedData.amount = numericAmount;
    }

    if (formData.description !== incomeRecord.description) {
      changedData.description = formData.description;
    }

    const originalDateFormatted = incomeRecord.date
      ? incomeRecord.date.split("T")[0]
      : "";
    if (formData.date !== originalDateFormatted) {
      changedData.date = formData.date;
    }

    if (
      formData.categoryId &&
      formData.categoryId !== incomeRecord.category.id
    ) {
      changedData.categoryId = formData.categoryId;
    }

    if (Object.keys(changedData).length > 0) {
      try {
        await onSave(incomeRecord.id, changedData);
      } catch (err) {
        console.error("Failed to save income record:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Kunne ikke gemme ændringer. Prøv igen."
        );
      }
    } else {
      onClose();
    }
    setIsSaving(false);
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex justify-center items-center  backdrop-blur-xs"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">
          Rediger Indkomst: {incomeRecord.category.name}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Dato
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isSaving}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Beskrivelse
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isSaving}
              />
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Beløb (kr)
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isSaving}
              />
            </div>

            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700"
              >
                Kategori
              </label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled={isSaving || !categories || categories.length === 0}
              >
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {(!categories || categories.length === 0) && (
                <p className="mt-1 text-xs text-gray-500">
                  Ingen kategorier tilgængelige.
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
            >
              Annuller
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isSaving ? "Gemmer..." : "Gem ændringer"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
