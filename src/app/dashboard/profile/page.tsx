import { Metadata } from "next";
import ProfileCard from "@/app/ui/dashboard/profile/profile-card";

export const metadata: Metadata = {
  title: "Min profil | ØkoSmart",
  description: "Personlige oplysninger hos ØkoSmart",
};

export default function Page() {
  return (
    <main className="container mx-auto p-8 ">
      <div>
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <ProfileCard />
      </div>
    </main>
  );
}
