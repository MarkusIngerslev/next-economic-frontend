import { Metadata } from "next";
import SpendingClientPage from "@/app/ui/dashboard/spending/SpendingClientPage";

export const metadata: Metadata = {
  title: "Udgifter | ØkoSmart ",
  description: "Hold styr på dine udgifter",
};

export default function Page() {
  return <SpendingClientPage />;
}
