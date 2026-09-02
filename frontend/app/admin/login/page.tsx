"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: { token: string } }>("/auth/login", { email, password });
      authStorage.set(res.data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5">
      <div className="w-full rounded-sm border border-walnut-100 bg-white/60 p-8">
        <p className="font-display text-xl font-semibold text-walnut-900">Admin Login</p>
        <p className="mt-1 text-sm text-walnut-500">Sharma Furniture House</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-walnut-800">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-walnut-800">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-walnut-100 bg-white px-3.5 py-2.5 text-sm focus-ring"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-walnut-900 px-5 py-2.5 font-medium text-linen hover:bg-brass-600 transition-colors disabled:opacity-60 focus-ring"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
