"use client";

import RegisterForm from "@/app/ui/shared/register-from";

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-700 rounded-xl shadow-2xl border border-gray-600">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Opret Konto</h1>
          <p className="text-gray-300 mt-2">
            Udfyld formularen for at komme i gang.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}
