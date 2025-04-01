import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/api";

interface LoginFormProps {
  // Interface for props if needed
}

export function LoginForm(props: LoginFormProps) {
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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-80"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-stone-950">
        Log ind
      </h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-3 border rounded text-stone-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 border rounded text-stone-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Logger ind..." : "Log ind"}
      </button>
    </form>
  );
}
