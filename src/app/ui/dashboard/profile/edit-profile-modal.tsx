"use client";

import React from "react";
import { UserProfile } from "@/services/api/user"; // Antager du har denne type defineret
import { motion } from "framer-motion";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile | null; // Send brugerdata til modalen for at pre-fill felter
  onSave: (updatedData: Partial<UserProfile>) => void; // Funktion til at gemme ændringer
}

const modalVariants = {
  hidden: {
    opacity: 0,
    y: -50, // Start lidt over centrum
    scale: 0.95, // Start lidt mindre
  },
  visible: {
    opacity: 1,
    y: 0, // Animer til centrum
    scale: 1, // Animer til fuld størrelse
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: 50, // Animer nedad ved exit
    scale: 0.95, // Skaler lidt ned ved exit
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  onSave,
}: EditProfileModalProps) {
  if (!isOpen || !userData) return null;

  // Her kan du tilføje state for form felter, f.eks. med useState
  // const [firstName, setFirstName] = useState(userData.firstName);
  // ... andre felter

  const handleSave = () => {
    // Indsaml opdaterede data fra form felter
    const updatedData: Partial<UserProfile> = {
      // firstName: firstName,
      // ... andre opdaterede felter
    };
    onSave(updatedData);
    onClose(); // Luk modalen efter gem
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex justify-center items-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose} // Luk modalen ved klik på baggrunden
    >
      {/* Animer selve modal-indholdet */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()} // Forhindrer lukning ved klik inde i modalen
      >
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              defaultValue={userData.firstName}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {/* ... andre form felter ... */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
