import { Metadata } from "next";
import ProfileContent from "@/app/ui/dashboard/profile-content";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return (
    <main className="container mx-auto p-8 border">
      <div>
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <ProfileContent />
      </div>
    </main>
  );
}
