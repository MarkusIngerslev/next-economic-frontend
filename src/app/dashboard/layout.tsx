"use client";

import SideNav from "@/app/ui/dashboard/sidenav";
import ProtectedRoute from "@/app/ui/shared/ProtectedRoute";

export const experimental_ppr = true;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gray-800">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>

        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
