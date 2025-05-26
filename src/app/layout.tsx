import "@/app/ui/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ClientLayoutWrapper from "@/app/ui/shared/ClientLayoutWrapper";

export const metadata = {
  title: "ØkoSmart",
  description: "Dashboard for ØkoSmart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body>
        <AuthProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
