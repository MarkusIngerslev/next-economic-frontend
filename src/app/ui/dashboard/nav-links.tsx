"use client";

import {
  HomeIcon,
  TagIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

// Map of links to be displayed in the sidebar navigation
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Budget",
    href: "/dashboard/budget",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Spending",
    href: "/dashboard/spending",
    icon: CreditCardIcon,
  },
  {
    name: "Categories",
    href: "/dashboard/category",
    icon: TagIcon,
  },
];

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
              "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-violet-600 dark:text-white border",
              {
                "bg-gray-100 dark:bg-violet-600": pathname === link.href,
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
