import { Metadata } from "next";
import BudgetClientPage from "@/app/ui/dashboard/budget/BudgetClientPage";

export const metadata: Metadata = {
  title: "Indtægter | ØkoSmart",
  description: "Budget for ØkoSmart",
};

export default function BudgetPage() {
  return <BudgetClientPage />;
}