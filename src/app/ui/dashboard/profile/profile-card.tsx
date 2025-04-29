"use client";

import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/services/api/user";
import { ProfileSkeleton } from "@/app/ui/skeleton";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import EditProfileModal from "./edit-profile-modal";
import { AnimatePresence } from "framer-motion";

export default function ProfileCard() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Udregn birthday fra fødselsdato
  function calculateAge(birthDate: string): number {
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
    return age;
  }

  // Omdanner fødselsdato til dd-mm-yyyy format
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        const data = await getUserProfile();
        setUserData(data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        setError("Could not load profile data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveChanges = (updatedData: Partial<UserProfile>) => {
    // Her skal du implementere logikken til at gemme de opdaterede data
    // Dette involverer typisk et API kald
    console.log("Saving changes:", updatedData);
    // Opdater evt. lokal state hvis API kaldet lykkes
    // setUserData(prevData => ({ ...prevData, ...updatedData }));
    // Luk modalen er håndteret i selve modal komponenten
  };

  // Tilføj debugger over indholdet
  return (
    <div className="relative">
      {isLoading ? (
        <ProfileSkeleton />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : !userData ? (
        <div>No user data available</div>
      ) : (
        <div
          className={`bg-slate-300 shadow rounded-lg p-6 mt-4 ${
            isModalOpen ? "blur-xs" : ""
          }`}
        >
          {/* Resten af dit indhold... */}
          <div className="flex items-center mb-6">
            {userData.profilePictureUrl ? (
              <img
                src={userData.profilePictureUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full mr-4 object-cover"
              />
            ) : (
              <UserCircleIcon className="w-20 h-20 text-gray-500 mr-4" />
            )}
            <div>
              <h2 className="text-xl font-semibold">User</h2>
              <p className="text-gray-600">
                {userData.firstName} {userData.lastName}
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border-b-3 pb-4">
              <h3 className="font-medium mb-2 px-2 font-semibold">
                Personlig Information
              </h3>
              <div className="mb-4 px-4">
                <p className="text-gray-600">
                  Alder: {calculateAge(userData.birthDate || "N/A")}
                </p>
                <p className="text-gray-600">
                  Fødselsdag : {formatDate(userData.birthDate || "N/A")}
                </p>

                <fieldset className="border-y-1 px-2 pb-2 mt-2">
                  <legend className="font-semibold">Address</legend>
                  <p className="text-gray-600">
                    Address: {userData.address || "N/A"}
                  </p>
                  <p className="text-gray-600">By: {userData.city || "N/A"}</p>
                  <p className="text-gray-600">
                    Post nummer: {userData.postalCode || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    Land: {userData.country || "N/A"}
                  </p>
                </fieldset>
              </div>

              <h3 className="font-medium mb-2 px-2 font-semibold">
                Kontakt Information
              </h3>
              <div className="mb-4 px-4">
                <p className="text-gray-600">
                  Email: {userData.email || "N/A"}
                </p>
                <p className="text-gray-600">
                  Telefonnummer: {userData.phone || "N/A"}
                </p>
              </div>

              <h3 className="font-medium mb-2 px-2 font-semibold">
                Relevant Information
              </h3>
              <div className=" px-4">
                <p className="text-gray-600">
                  Roller: {userData.roles.join(", ") || "N/A"}
                </p>
              </div>
            </div>
            <div>
              <button
                onClick={handleOpenModal} // Tilføj onClick handler
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ændre profile oplysninger
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Wrap modalen med AnimatePresence */}
      <AnimatePresence>
        {isModalOpen && ( // Render kun modalen når den er åben
          <EditProfileModal
            // key prop kan være nyttig for AnimatePresence, men ikke strengt nødvendig her
            // key="edit-profile-modal"
            isOpen={isModalOpen} // isOpen prop er teknisk set ikke nødvendig for AnimatePresence, men god at beholde
            onClose={handleCloseModal}
            userData={userData}
            onSave={handleSaveChanges}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
