"use client";

import { useEffect, useState } from "react";
import { links as allLinks, LinkDefinition } from "@/app/lib/nav-links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/services/api/user";

export default function NavLinks() {
  const pathname = usePathname();
  const { token } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [visibleLinks, setVisibleLinks] = useState<LinkDefinition[]>([]);

  useEffect(() => {
    const fetchProfileAndSetLinks = async () => {
      if (token) {
        try {
          setIsLoadingProfile(true);
          const userProfile = await getUserProfile();
          const userIsAdmin =
            userProfile.roles && userProfile.roles.includes("admin");
          setIsAdmin(userIsAdmin);

          if (userIsAdmin) {
            setVisibleLinks(allLinks);
          } else {
            setVisibleLinks(
              allLinks.filter((link) => link.name.toLowerCase() !== "Admin")
            );
          }
        } catch (error) {
          console.error("Failed to fetch user profile for NavLinks:", error);
          // Vis ikke admin linket ved fejl
          setVisibleLinks(
            allLinks.filter((link) => link.name.toLowerCase() !== "Admin")
          );
        } finally {
          setIsLoadingProfile(false);
        }
      } else {
        // Hvis der ikke er token, vis ikke admin linket og stop loading
        setVisibleLinks(
          allLinks.filter((link) => link.name.toLowerCase() !== "Admin")
        );
        setIsLoadingProfile(false);
      }
    };

    fetchProfileAndSetLinks();
  }, [token]);

  // Viser et simpelt loading state eller ingenting, mens profil hentes
  if (isLoadingProfile) {
    // Du kan returnere en loading spinner eller null her
    // For nu, filtrer links som om brugeren ikke er admin, for at undgå et "hop" i UI
    const nonAdminLinks = allLinks.filter(
      (link) => link.name.toLowerCase() !== "admin"
    );
    return (
      <>
        {nonAdminLinks.map((link) => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-sky-400 dark:text-white border animate-pulse", // Tilføjet animate-pulse for loading indikation
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

  return (
    <>
      {visibleLinks.map((link) => {
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
