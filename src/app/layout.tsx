import "@/app/ui/globals.css";
import { AuthProvider } from "@/context/AuthContext";

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
