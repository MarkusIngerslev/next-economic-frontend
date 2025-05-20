"use client";

import React, { useState, useEffect } from "react";
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
  // State for hvert felt
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  // Opdater formData når userData ændres (f.eks. ved første load)
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        birthDate: userData.birthDate ? userData.birthDate.split("T")[0] : "", // Format for date input
        address: userData.address || "",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
        country: userData.country || "",
        profilePictureUrl: userData.profilePictureUrl || "",
      });
    }
  }, [userData]);

  if (!isOpen || !userData) return null;

  // Håndter ændringer i input felter
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const changedData: Partial<UserProfile> = {};
    if (!userData) return; // Add guard clause

    for (const key in formData) {
      // Ensure key is a property of formData itself
      if (Object.prototype.hasOwnProperty.call(formData, key)) {
        const formKey = key as keyof UserProfile;

        // Skip 'id' and 'roles' explicitly for safety, although 'roles' shouldn't be in formData
        if (formKey === "id" || formKey === "roles") {
          continue;
        }

        const currentValue = formData[formKey];
        let originalValue: string | number | string[] | undefined; // Keep original type possibilities from UserProfile

        // Handle date comparison specifically
        if (formKey === "birthDate" && userData[formKey]) {
          originalValue = userData[formKey]?.split("T")[0];
        } else {
          originalValue = userData[formKey];
        }

        // Compare current form value with the original value (or empty string if original was null/undefined)
        if (currentValue !== (originalValue ?? "")) {
          // Use 'as any' to bypass the complex type inference issue
          changedData[formKey] = currentValue as any; // Use type assertion
        }
      }
    }

    if (Object.keys(changedData).length > 0) {
      onSave(changedData);
    }
  };

  return (
    <motion.div
      className="absolute inset-0 z-50 flex justify-center items-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 border-1 border-gray-600 p-6 rounded-lg shadow-xl w-full max-w-md text-gray-200"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          Opdater Profil
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="flex flex-col mb-4 space-y-2">
            <div className="flex flex-row items-center">
              <label
                htmlFor="firstName"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Fornavn
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName || ""} // Brug state value
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="lastName"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Efternavn
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="email"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="phone"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Telefonnummer
              </label>
              <input
                type="text"
                id="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="birthDate"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Fødselsdato
              </label>
              <input
                type="date"
                id="birthDate"
                value={formData.birthDate || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            {/* Adresse */}
            <div className="flex flex-row items-center">
              <label
                htmlFor="address"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Adresse
              </label>
              <input
                type="text"
                id="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="city"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                By
              </label>
              <input
                type="text"
                id="city"
                value={formData.city || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="postalCode"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Postnummer
              </label>
              <input
                type="text"
                id="postalCode"
                value={formData.postalCode || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            <div className="flex flex-row items-center">
              <label
                htmlFor="country"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Land
              </label>
              <input
                type="text"
                id="country"
                value={formData.country || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
            {/* Upload billede url */}
            <div className="flex flex-row items-center">
              <label
                htmlFor="profilePictureUrl"
                className="block w-32 text-start text-sm font-medium text-gray-300 mr-2"
              >
                Profilbillede URL
              </label>
              <input
                type="text"
                id="profilePictureUrl"
                value={formData.profilePictureUrl || ""}
                onChange={handleChange}
                className="mt-1 block flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-400 focus:border-sky-400 sm:text-sm text-gray-100 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
            >
              Annuller
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
            >
              Gem ændringer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
