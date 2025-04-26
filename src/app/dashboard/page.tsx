"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <main className=" p-8 border">
      <div className="flex items-center justify-center flex-col max-w-2xl mx-auto bg-white p-8 rounded shadow-md text-stone-600">
        <h1 className="text-3xl font-bold mb-4 text-stone-950">Dashboard</h1>
        <p className="mb-6">Velkommen! Du er logget ind ✅</p>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Log ud
        </button>
      </div>
    </main>
  );
}
