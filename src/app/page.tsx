import { Metadata } from "next";
import HomeClientPage from "@/app/ui/home/HomeClientPage";

export const metadata: Metadata = {
  title: "Forside | ØkoSmart ",
  description: "ØkoSmart - Økonomi og budgettering for private og virksomheder",
};

export default function Page() {
  return <HomeClientPage />;
}
