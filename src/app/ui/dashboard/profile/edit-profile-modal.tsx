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
        <h2 className="text-xl font-semibold mb-4">Opdater Profil</h2>
        <form>
          {/* Input felter */}
          <div className="flex flex-col mb-4">
            {/* Personlige oplysninger */}
            <div className="flex flex-row ">
              <label
                htmlFor="firstName"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Fornavn
              </label>
              <input
                type="text"
                id="firstName"
                defaultValue={userData.firstName}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="lastName"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Efternavn
              </label>
              <input
                type="text"
                id="lastName"
                defaultValue={userData.lastName}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="email"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                defaultValue={userData.email}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="phone"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Telefonnummer
              </label>
              <input
                type="tel"
                id="phone"
                defaultValue={userData.phone}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="birthDate"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Fødselsdato
              </label>
              <input
                type="date"
                id="birthDate"
                defaultValue={userData.birthDate}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {/* Adresse */}

            <div className="flex flex-row">
              <label
                htmlFor="address"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Adresse
              </label>
              <input
                type="text"
                id="address"
                defaultValue={userData.address}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex flex-row">
              <label
                htmlFor="city"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                By
              </label>
              <input
                type="text"
                id="city"
                defaultValue={userData.city}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="postalCode"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Postnummer
              </label>
              <input
                type="text"
                id="postalCode"
                defaultValue={userData.postalCode}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex flex-row">
              <label
                htmlFor="country"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Land
              </label>
              <input
                type="text"
                id="country"
                defaultValue={userData.country}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {/* Upload billede url */}
            <div className="flex flex-row">
              <label
                htmlFor="profilePictureUrl"
                className="block w-35 text-start content-center text-sm font-medium text-gray-700"
              >
                Profilbillede
              </label>
              <input
                type="text"
                id="profilePictureUrl"
                defaultValue={userData.profilePictureUrl}
                className="mt-1 block w-65 content-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* ... andre form felter ... */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Annuller
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Gem ændringer
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
