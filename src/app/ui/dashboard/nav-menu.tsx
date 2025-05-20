"use client";

import { links } from "@/app/lib/nav-links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-sky-400 dark:text-white border",
              {
                "bg-gray-100 dark:bg-sky-400": pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6 h-6" />
            <span className="ml-3">{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}
