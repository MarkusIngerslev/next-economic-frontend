"use client";

import { useEffect, useState } from "react";
import { getUserProfile, UserProfile } from "@/services/api/user";
import { ProfileSkeleton } from "@/app/ui/skeleton";

export default function ProfileCard() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Tilføj debugger over indholdet
  return (
    <div>
      {isLoading ? (
        <ProfileSkeleton />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : !userData ? (
        <div>No user data available</div>
      ) : (
        <div className="bg-slate-300 shadow rounded-lg p-6 mt-4">
          {/* Resten af dit indhold... */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-300 mr-4"></div>
            <div>
              <h2 className="text-xl font-semibold">User</h2>
              <p className="text-gray-600">
                {userData.firstName} {userData.lastName}
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2 font-semibold">
                Person Information
              </h3>
              <p className="text-gray-600 font-medium">
                Location: Copenhagen, Denmark
              </p>
              <p className="text-gray-600">Birthday: January 2023</p>
              <p className="text-gray-600">Email: {userData.email}</p>
              <p className="text-gray-600">
                Roles: {userData.roles.join(", ")}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Account Settings</h3>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
