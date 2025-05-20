import {
  HomeIcon,
  TagIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export const links = [
  {
    name: "Forside",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Min profil",
    href: "/dashboard/profile",
    icon: UserCircleIcon,
  },
  {
    name: "Indtægter",
    href: "/dashboard/budget",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Udgifter",
    href: "/dashboard/spending",
    icon: CreditCardIcon,
  },
  {
    name: "Kategorier",
    href: "/dashboard/category",
    icon: TagIcon,
  },
  {
    name: "Admin",
    href: "/dashboard/admin",
    icon: TagIcon,
  },
];
