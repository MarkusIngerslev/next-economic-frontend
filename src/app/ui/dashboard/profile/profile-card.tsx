"use client";

import { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/services/api/user";
import { ProfileSkeleton } from "@/app/ui/skeletons/skeleton";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import EditProfileModal from "./edit-profile-modal";
import { AnimatePresence } from "framer-motion";

export default function ProfileCard() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State for at vise loading under save
  const [saveError, setSaveError] = useState<string | null>(null); // State for fejl under save

  // Funktion til at hente brugerdata (genbruges)
  const fetchUserData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserProfile();
      setUserData(data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Could not load profile data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Udregn alder
  function calculateAge(birthDate: string): number | string {
    if (!birthDate || birthDate === "N/A") return "N/A";
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age >= 0 ? age : "N/A"; // Sørg for at alder ikke er negativ
    } catch (e) {
      console.error("Error calculating age:", e);
      return "N/A";
    }
  }

  // Formater dato
  function formatDate(dateString: string): string {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      const date = new Date(dateString);
      // Check om datoen er valid
      if (isNaN(date.getTime())) {
        return "N/A";
      }
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    } catch (e) {
      console.error("Error formatting date:", e);
      return "N/A";
    }
  }

  // Hent data ved mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setSaveError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Opdateret handleSaveChanges
  const handleSaveChanges = async (updatedData: Partial<UserProfile>) => {
    if (!userData) return;

    setIsSaving(true);
    setSaveError(null);
    // console.log("Attempting to save changes:", updatedData);

    try {
      // 1. Kald PATCH for at opdatere data
      await updateUserProfile(updatedData);
      console.log("Profile update request successful.");

      // 2. Kald GET for at hente den fulde, opdaterede profil
      console.log("Re-fetching updated profile data...");
      await fetchUserData(); // Genbrug fetchUserData til at opdatere state

      handleCloseModal(); // Luk modalen ved succes
    } catch (err) {
      console.error("Failed to save or re-fetch profile changes:", err);
      // Sæt en generel fejlbesked, da fejlen kan komme fra PATCH eller GET
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false); // Sørg for at isSaving altid sættes til false
    }
  };

  // Tilføj debugger over indholdet
  return (
    <div className="relative">
      {isLoading && !isSaving ? ( // Vis kun initial loading skeleton hvis vi ikke er ved at gemme
        <ProfileSkeleton />
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded">
          {error}
        </div>
      ) : !userData ? (
        <div className="p-4 text-gray-600">No user data available.</div>
      ) : (
        <div
          className={`bg-gray-700 shadow-lg rounded-lg p-6 mt-4 transition-filter duration-300 ${
            isModalOpen ? "blur-xs" : ""
          } ${isSaving ? "opacity-75" : ""}`}
        >
          {/* ... Profile display code ... */}
          <div className="flex items-center mb-6">
            {userData.profilePictureUrl ? (
              <img
                src={userData.profilePictureUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
            ) : (
              <UserCircleIcon className="w-20 h-20 text-gray-400 mr-4" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-100">User</h2>
              <p className="text-gray-300">
                {userData.firstName} {userData.lastName}
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border-b-2 border-gray-600 pb-4">
              <h3 className="font-medium mb-2 px-2 font-semibold text-gray-200">
                Personlig Information
              </h3>
              <div className="mb-4 px-4">
                <p className="text-gray-300">
                  Alder: {calculateAge(userData.birthDate || "N/A")}
                </p>
                <p className="text-gray-300">
                  Fødselsdag : {formatDate(userData.birthDate || "N/A")}
                </p>

                <fieldset className="border-y border-gray-600 px-2 pb-2 mt-2">
                  <legend className="font-semibold text-gray-200">
                    Address
                  </legend>
                  <p className="text-gray-300">
                    Address: {userData.address || "N/A"}
                  </p>
                  <p className="text-gray-300">By: {userData.city || "N/A"}</p>
                  <p className="text-gray-300">
                    Post nummer: {userData.postalCode || "N/A"}
                  </p>
                  <p className="text-gray-300">
                    Land: {userData.country || "N/A"}
                  </p>
                </fieldset>
              </div>

              <h3 className="font-medium mb-2 px-2 font-semibold text-gray-200">
                Kontakt Information
              </h3>
              <div className="mb-4 px-4">
                <p className="text-gray-300">
                  Email: {userData.email || "N/A"}
                </p>
                <p className="text-gray-300">
                  Telefonnummer: {userData.phone || "N/A"}
                </p>
              </div>

              <h3 className="font-medium mb-2 px-2 font-semibold text-gray-200">
                Relevant Information
              </h3>
              <div className=" px-4">
                <p className="text-gray-300">
                  Roller: {userData.roles ? userData.roles.join(", ") : "N/A"}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={handleOpenModal}
                className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-600 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
                disabled={isSaving || isLoading} 
              >
                {isSaving ? "Gemmer..." : "Ændre profile oplysninger"}
              </button>
              {saveError && (
                <p className="text-red-400 text-sm mt-2">{saveError}</p>
              )}
            </div>
          </div>
        </div>
      )}
      <AnimatePresence>
        {isModalOpen && (
          <EditProfileModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            userData={userData}
            onSave={handleSaveChanges}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
