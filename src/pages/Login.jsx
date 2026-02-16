import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user && isAdmin) {
    navigate("/admin", { replace: true });
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    navigate("/admin", { replace: true });
  };

  return (
    <div className="bg-brand-beige min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="bg-white border shadow-sm rounded-2xl p-8 w-full max-w-md space-y-4"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin login</h1>
          <Link to="/" className="text-sm text-brand-pink">
            ← Terug
          </Link>
        </div>

        <label className="block text-sm">
          Email
          <input
            type="email"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block text-sm">
          Wachtwoord
          <input
            type="password"
            required
            className="mt-1 w-full border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-dark text-brand-beige py-2 rounded-lg disabled:opacity-60"
        >
          {loading ? "Bezig..." : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
