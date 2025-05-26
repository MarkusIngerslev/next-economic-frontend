import "@/app/ui/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ChatButton from "@/app/ui/shared/chat/ChatButton";

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
          {children}
          <ChatButton />
        </AuthProvider>
      </body>
    </html>
  );
}
