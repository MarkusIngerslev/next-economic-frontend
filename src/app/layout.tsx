import "@/app/ui/globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Login Demo",
  description: "NestJS + Next.js + JWT",
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
