"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile, updateUserRoles } from "@/services/api/user";
import { set } from "date-fns";

interface EditUserRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: UserProfile | null;
  onUserRolesUpdated: (updatedUser: UserProfile) => void;
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

const availableRoles = ["user", "admin"];

export default function EditUserRolesModal({
  isOpen,
  onClose,
  userToEdit,
  onUserRolesUpdated,
}: EditUserRolesModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("user");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userToEdit) {
      if (userToEdit.roles.includes("admin")) {
        setSelectedRole("admin");
      } else {
        setSelectedRole("user");
      }
      setError(null);
    }
  }, [userToEdit]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userToEdit) {
      setError("Ingen bruger valgt til redigering.");
      return;
    }
    setError(null);
    setIsSaving(true);

    try {
      // Backend forventer et array af roller
      const rolesToSet = [selectedRole];
      const updatedUser = await updateUserRoles(userToEdit.id, rolesToSet);
      onUserRolesUpdated(updatedUser); // Send den opdaterede bruger tilbage
      onClose(); // Luk modal ved succes
    } catch (err) {
      console.error("Failed to upadate user roles:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ukendt fejl ved opdatering af brugerroller."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !userToEdit) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex justify-center items-center backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 border-2 border-slate-600 p-6 rounded-lg shadow-xl w-full max-w-md"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-100">
              Rediger Roller for{" "}
              <span className="text-sky-400">
                {userToEdit.firstName} {userToEdit.lastName}
              </span>
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="userRole"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Vælg Rolle
                  </label>
                  <select
                    id="userRole"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-cyan-400 focus:border-cyan-400 sm:text-sm"
                    disabled={isSaving}
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {error && (
                  <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded border border-red-500">
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
                  {isSaving ? "Gemmer..." : "Gem Roller"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
