"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  itemName?: string;
  isDeleting?: boolean;
}

const modalVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.98,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  isDeleting,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Deletion failed from modal:", error);
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
        className="bg-gray-800 border-4 border-slate-600 p-6 rounded-lg shadow-xl w-full max-w-sm"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Bekræft Sletning</h2>
        <p className="mb-6 text-gray-400">
          Er du sikker på, at du vil slette{" "}
          {itemName ? (
            <span className="font-medium">"{itemName}"</span>
          ) : (
            "denne post"
          )}
          ?
          <br />
          Handlingen kan ikke fortrydes.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Annuller
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:bg-red-300"
          >
            {isDeleting ? "Sletter..." : "Ja, slet"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
