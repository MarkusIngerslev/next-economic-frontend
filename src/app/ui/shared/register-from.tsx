"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api/auth";
import Link from "next/link";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Adgangskoden skal være på mindst 6 tegn.");
      setLoading(false);
      return;
    }

    try {
      const token = await authService.register(
        firstName,
        lastName,
        email,
        password
      );
      if (token) {
        login(token); // Dette vil sætte token i AuthContext og omdirigere
        router.push("/dashboard");
      } else {
        setError("Registrering fejlede. Prøv igen.");
      }
    } catch (err: any) {
      let errorMessage = "Der opstod en ukendt fejl.";
      if (err.message) {
        try {
          const errorResponse = JSON.parse(err.message);
          if (errorResponse && errorResponse.message) {
            errorMessage = Array.isArray(errorResponse.message)
              ? errorResponse.message.join(", ")
              : errorResponse.message;
          } else {
            errorMessage = err.message;
          }
        } catch (parseError) {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-300"
          >
            Fornavn
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-600 text-gray-100 placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-300"
          >
            Efternavn
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-600 text-gray-100 placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email adresse
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-600 text-gray-100 placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Adgangskode
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-500 bg-gray-600 text-gray-100 placeholder-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            aria-describedby="password-help"
          />
          <p id="password-help" className="mt-1 text-xs text-gray-400">
            Mindst 6 tegn.
          </p>
        </div>

        {error && (
          <div
            className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md relative"
            role="alert"
          >
            <strong className="font-bold">Fejl: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-700 focus:ring-sky-500 disabled:opacity-60"
          >
            {loading ? (
              <ArrowPathIcon className="animate-spin h-5 w-5 mr-2" />
            ) : null}
            {loading ? "Registrerer..." : "Opret Konto"}
          </button>
        </div>
      </form>

      <p className="mt-4 text-center text-sm text-gray-400">
        Har du allerede en konto?{" "}
        <Link
          href="/login"
          className="font-medium text-sky-400 hover:text-sky-300"
        >
          Log ind her
        </Link>
      </p>
    </>
  );
}
