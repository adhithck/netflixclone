import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      await login(form);
      navigate("/browse");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl"
        >
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="mt-1 text-sm text-white/60">Login to continue</p>

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mt-5 space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>

          <p className="mt-5 text-center text-sm text-white/60">
            New here?{" "}
            <Link to="/register" className="text-red-500 hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
