import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api";
import { motion } from "framer-motion";
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Log ind");

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
      className="bg-gradient-to-tl from-gray-100 to-white p-10 rounded-2xl shadow-lg w-full max-w-sm border"
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

      <h2 className="text-2xl font-bold mb-4 text-center text-stone-800">
        Log ind på din konto
      </h2>

      {error && (
        <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
      )}

      <div className="space-y-4 text-gray-500">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-60"
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
