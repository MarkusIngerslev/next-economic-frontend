import { Metadata } from "next";
import CategoryClientPage from "@/app/ui/dashboard/category/CategoryClientPage";

export const metadata: Metadata = {
  title: "Kategorier | ØkoSmart",
  description: "Kategorier for ØkoSmart",
};

export default function Page() {
  return <CategoryClientPage />;
}
