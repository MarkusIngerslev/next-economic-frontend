import { Metadata } from "next";
import RegisterClientPage from "../ui/shared/RegisterClientPage";

export const metadata: Metadata = {
  title: "Opret bruger | ØkoSmart",
  description: "Opret bruger til ØkoSmart",
};

export default function Page() {
  return <RegisterClientPage />;
}