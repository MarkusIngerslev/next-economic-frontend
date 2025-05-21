import { Metadata } from "next";
import AdminClientPage from "@/app/ui/dashboard/admin/AdminClientPage";

export const metadata: Metadata = {
  title: "Admin | ØkoSmart",
  description: "Admin for ØkoSmart",
};

export default function Page() {
  return <AdminClientPage />;
}
