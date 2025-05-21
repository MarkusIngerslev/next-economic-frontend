import { Metadata } from "next";
import DashboardClientPage from "@/app/ui/dashboard/DashboardClientPage";

export const metadata: Metadata = {
  title: "Forside | ØkoSmart",
  description: "Forside for ØkoSmart",
};

export default function DashboardPage() {
  return <DashboardClientPage />;
}
