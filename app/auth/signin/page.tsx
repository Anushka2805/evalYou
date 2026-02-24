"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);
  const submit = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.detail || "Login failed");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", json.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (e) {
      console.error(e);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f2c] to-black">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign In</h2>

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">{error}</div>
        )}

        <input
          className="w-full mb-4 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-6 px-4 py-3 rounded-lg bg-black/40 border border-white/10"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-lg disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <p className="text-sm text-gray-400 text-center mt-4">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}