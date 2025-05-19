import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useSearchParams, useRouter } from "next/navigation";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Log ind");
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const messageCode = searchParams.get("message");
    if (messageCode) {
      if (
        messageCode === "session_expired_initial" ||
        messageCode === "session_expired_interval"
      ) {
        setInfoMessage("Din session er udløbet. Log venligst ind igen.");
      } else if (messageCode === "session_corrupt") {
        setInfoMessage(
          "Der opstod et problem med din session. Log venligst ind igen."
        );
      }
      // Fjern query parameteren fra URL'en for at undgå at beskeden vises igen ved refresh
      // Uden at forårsage en fuld navigation, hvilket kan være komplekst med App Router.
      // En simpel måde er at lade den være, eller bruge router.replace med den nuværende path uden query.
      // For nu lader vi den være, da det er den simpleste løsning.
      // Hvis du vil fjerne den: router.replace('/login', { scroll: false }); (kan kræve justering)
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStatusMessage("Logger ind...");

    try {
      const response = await authService.login(email, password);

      // Kunstig forsinkelse for testning (f.eks. 2 sekunder)
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      if (!response) {
        // Selvom authService-login sandsynligvis kaster en fejl ved HTTP-fejl,
        // er dette en ekstra sikkerhedsforanstaltning.
        throw new Error("Login fejlede: Uventet respons fra serveren.");
      }

      // Login var succesfult, token er modtaget.
      // Opdater statusbeskeden for at indikere omdirigering.
      // loading forbliver true, indtil komponenten unmountes ved omdirigering.
      setStatusMessage("Login succesfuldt, omdirigerer...");
      login(response); // Denne funktion i AuthContext bør håndtere omdirigeringen.
    } catch (err: any) {
      let errorMessage = "Noget gik galt under login"; // Standard fejlbesked
      if (err.message) {
        try {
          // Forsøg at parse fejlbeskeden som JSON
          const errorResponse = JSON.parse(err.message);
          if (errorResponse && errorResponse.message) {
            errorMessage = errorResponse.message; // Brug 'message' feltet fra JSON
          } else {
            // Hvis JSON ikke har 'message', brug den oprindelige err.message
            errorMessage = err.message;
          }
        } catch (parseError) {
          // Hvis err.message ikke er valid JSON, brug den som den er
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setStatusMessage("Log ind");
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-gray-700 p-10 rounded-2xl shadow-xl w-full max-w-sm border border-gray-600"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Ikon eller illustration */}
      <div className="flex justify-center mb-6">
        <img
          src="/login-illustration.svg"
          alt="Login illustration"
          className="w-40 h-40"
        />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center text-gray-100">
        Log ind på din konto
      </h2>

      {infoMessage && (
        <p className="text-yellow-300 bg-yellow-700 bg-opacity-50 border border-yellow-500 p-3 rounded-md mb-4 text-sm text-center">
          {infoMessage}
        </p>
      )}

      {error && (
        <p className="text-red-400 mb-4 text-sm text-center">{error}</p>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-500 bg-gray-600 text-gray-100 placeholder-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none" // Ændret input styling
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-500 bg-gray-600 text-gray-100 placeholder-gray-300 rounded-md focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none" // Ændret input styling
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-60 flex items-center justify-center" // Knapfarve bibeholdt som accent
          disabled={loading}
        >
          {loading && (
            <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
          )}
          {statusMessage}
        </button>
      </div>
    </motion.form>
  );
}
