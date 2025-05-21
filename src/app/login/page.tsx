import { Metadata } from "next";
import LoginClientPage from "../ui/shared/LoginClientPage";

export const metadata: Metadata = {
  title: "Log ind | ØkoSmart",
  description: "Log ind til ØkoSmart",
};

export default function Page() {
  return <LoginClientPage />;
}
