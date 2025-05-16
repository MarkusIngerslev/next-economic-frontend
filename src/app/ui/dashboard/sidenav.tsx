"use client";

import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { PowerIcon } from "@heroicons/react/24/outline";
import { authService } from "@/services/api";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md p-4 md:h-40"
        href="/"
      >
        <div className="w-32 md:w-40">
          <img
            src="/pie-chart-illustration.svg"
            alt="logo illustration"
            className="mx-auto w-16 h-16 md:w-32 md:h-32"
          />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md md:block"></div>
        {/* Ændret fra form med server action til almindelig button med onClick */}
        <button
          onClick={() => authService.logout()}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md border p-3 text-sm font-medium hover:bg-sky-400 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </div>
    </div>
  );
}
