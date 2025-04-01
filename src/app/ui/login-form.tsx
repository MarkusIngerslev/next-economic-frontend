import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api";
import { motion } from "framer-motion";

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(email, password);

      if (!response) {
        throw new Error("Login fejlede");
      }

      login(response);
    } catch (err: any) {
      setError(err.message || "Noget gik galt under login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-sm border"
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
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logger ind..." : "Log ind"}
        </button>
      </div>
    </motion.form>
  );
}
