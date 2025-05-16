"use client";

import React, { useState, useEffect } from "react";
import { IncomeCreatePayload } from "@/services/api";
import { Category } from "@/services/api/category";
import { motion } from "framer-motion";

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newIncomeData: IncomeCreatePayload) => Promise<void>;
  categories: Category[];
  defaultDate?: string;
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

const initialFormData = {
  description: "",
  amount: "",
  categoryId: "",
  date: new Date().toISOString().split("T")[0],
};

export default function AddIncomeModal({
  isOpen,
  onClose,
  onSave,
  categories,
  defaultDate,
}: AddIncomeModalProps) {
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    categoryId: string;
    date: string;
  }>(() => ({
    ...initialFormData,
    date: defaultDate || initialFormData.date,
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...initialFormData,
        date: defaultDate || new Date().toISOString().split("T")[0],
      });
      setError(null);
    }
  }, [isOpen, defaultDate]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (!formData.categoryId) {
      setError("Vælg venligst en kategori.");
      setIsSaving(false);
      return;
    }

    const numericAmount = parseFloat(formData.amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError("Beløbet skal være et gyldigt positivt tal.");
      setIsSaving(false);
      return;
    }

    if (!formData.date) {
      setError("Vælg venligst en dato.");
      setIsSaving(false);
      return;
    }

    const newIncomeData: IncomeCreatePayload = {
      description: formData.description.trim(),
      amount: numericAmount,
      categoryId: formData.categoryId,
      date: formData.date,
    };

    try {
      await onSave(newIncomeData);
    } catch (err) {
      console.error("Failed to save new income record:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Kunne ikke oprette indkomst. Prøv igen."
      );
    } finally {
      setIsSaving(false);
    }
  };

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
        <h2 className="text-xl font-semibold mb-6">Tilføj Ny Indkomst</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-200"
              >
                Dato <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                disabled={isSaving}
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-200"
              >
                Beskrivelse
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                disabled={isSaving}
              />
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-200"
              >
                Beløb (kr) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0.01"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                disabled={isSaving}
                required
              />
            </div>
            <div>
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-200"
              >
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-800 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                disabled={isSaving || categories.length === 0}
                required
              >
                <option value="">Vælg en kategori...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="mt-1 text-xs text-gray-200">
                  Ingen indkomstkategorier fundet.
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-2 rounded">
                {error}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
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
              disabled={isSaving || categories.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:bg-green-300"
            >
              {isSaving ? "Gemmer..." : "Opret Indkomst"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
