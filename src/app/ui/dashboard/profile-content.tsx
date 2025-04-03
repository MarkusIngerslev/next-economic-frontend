"use client";

import React from "react";
import { getUserProfile, UserProfile } from "@/services/api/user";
import { ProfileSkeleton } from "@/app/ui/skeleton";

// Debugging komponent
function TokenDebugger() {
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    setToken(localStorage.getItem("jwt-token"));
  }, []);

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded border border-red-500">
      <h3 className="font-bold mb-2">Debugging Info:</h3>
      <p>JWT Token exists: {token ? "Yes" : "No"}</p>
      {token && (
        <div>
          <p className="mt-2 font-medium">Token value (first 20 chars):</p>
          <p className="font-mono text-sm bg-gray-200 p-1 rounded">
            {token.substring(0, 20)}...
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProfileContent() {
  const [userData, setUserData] = React.useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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
      <TokenDebugger />

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
              <p className="text-gray-600">{userData.email}</p>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="border-b pb-4">
              <h3 className="font-medium mb-2">Person Information</h3>
              <p className="text-gray-600">Location: Copenhagen, Denmark</p>
              <p className="text-gray-600">Birthday: January 2023</p>
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
