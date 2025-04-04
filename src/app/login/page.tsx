"use client";

import dynamic from "next/dynamic";

// Importing the LoginForm component dynamically to avoid server-side rendering
const LoginForm = dynamic(
  () =>
    import("@/app/ui/shared/login-form").then((mod) => ({ default: mod.LoginForm })),
  { ssr: false }
);

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-violet-400 px-4">
      <LoginForm />
    </main>
  );
}
