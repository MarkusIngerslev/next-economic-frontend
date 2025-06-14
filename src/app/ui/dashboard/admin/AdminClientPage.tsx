"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile, getAllUsers } from "@/services/api/user";
import EditUserRolesModal from "@/app/ui/dashboard/admin/editUserRolesModal";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "framer-motion";

export default function AdminClientPage() {
  const { token } = useAuth();
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // State for modal
  const [isEditRolesModalOpen, setIsEditRolesModalOpen] = useState(false);
  const [userToEditRoles, setUserToEditRoles] = useState<UserProfile | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("Godkendelse påkrævet.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userProfile = await getUserProfile();

        if (userProfile.roles && userProfile.roles.includes("admin")) {
          setIsAdmin(true);
          const users = await getAllUsers(); // Hent alle brugere
          setAllUsers(users);
          setError(null);
        } else {
          setIsAdmin(false);
          setError(
            "Adgang nægtet: Du har ikke tilladelse til at se denne side."
          );
        }
      } catch (err) {
        console.error("Kunne ikke hente data:", err);
        let errorMessage = "En ukendt fejl opstod.";
        if (err instanceof Error) {
          errorMessage = err.message;
          if (
            errorMessage.includes("403") ||
            errorMessage.toLowerCase().includes("forbidden")
          ) {
            errorMessage =
              "Adgang nægtet: Du har ikke tilladelse til at se denne side eller ressourcen.";
          } else if (
            errorMessage.includes("401") ||
            errorMessage.toLowerCase().includes("unauthorized")
          ) {
            errorMessage = "Godkendelse påkrævet. Log venligst ind igen.";
          }
        }
        setError(errorMessage);
        setIsAdmin(false); // Sæt isAdmin til false ved fejl for at forhindre visning af admin-indhold
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleOpenEditRolesModal = (user: UserProfile) => {
    setUserToEditRoles(user);
    setIsEditRolesModalOpen(true);
  };

  const handleCloseEditRolesModal = () => {
    setIsEditRolesModalOpen(false);
    setUserToEditRoles(null);
  };

  const handleUserRolesUpdated = (updatedUser: UserProfile) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
  };

  if (isLoading) {
    return (
      <main className="p-8 text-center text-gray-100">
        <p>Indlæser...</p>
      </main>
    );
  }

  if (!isAdmin || error) {
    return (
      <main className="p-8 bg-gray-800 text-gray-100">
        <div className="max-w-md mx-auto bg-gray-700 shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Fejl</h1>
          <p className="text-red-300">
            {error || "Du har ikke adgang til denne side."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8 bg-gray-800 text-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Admin - Brugeradministration
        </h1>
        {allUsers.length === 0 ? (
          <p className="text-gray-400">Ingen brugere fundet.</p>
        ) : (
          <div className="overflow-x-auto bg-gray-700 shadow-xl rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Navn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Roller
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Bruger ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    <span className="sr-only">Handlinger</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {allUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-500/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.roles.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 hidden md:table-cell">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleOpenEditRolesModal(user)}
                        className="text-cyan-400 hover:text-cyan-300 p-1 rounded-md hover:bg-gray-600 transition-colors flex items-center"
                        title="Rediger roller"
                      >
                        <PencilSquareIcon className="h-5 w-5 mr-1" />
                        Rediger Roller
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sørg for at AnimatePresence omgiver modalen hvis du bruger exit animationer i modalen */}
      <AnimatePresence>
        {isEditRolesModalOpen && userToEditRoles && (
          <EditUserRolesModal
            isOpen={isEditRolesModalOpen}
            onClose={handleCloseEditRolesModal}
            userToEdit={userToEditRoles}
            onUserRolesUpdated={handleUserRolesUpdated}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
