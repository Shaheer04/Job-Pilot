"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

function LoginContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get("expired") === "true";

  useEffect(() => {
    if (isExpired) {
      setError("Your tactical session has expired. Please log in again.");
    }
  }, [isExpired]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login/", { username, password });
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      router.push("/");
    } catch (err: unknown) {
      const errorDetail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      setError(errorDetail || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-surface-container-lowest p-6">
      <div className="w-full max-w-md bg-surface border border-outline-variant/20 rounded-xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">JobPilot</h1>
          <p className="text-sm text-on-surface-variant">Sign in to manage your tactical archive</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className={`p-3 border text-xs rounded ${isExpired && !error.includes("Invalid") ? "bg-primary/10 border-primary/20 text-primary" : "bg-error/10 border-error/20 text-error"}`}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="Your username"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md py-3 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-container text-sm font-black uppercase tracking-widest rounded-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login to Archive"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          Don&apos;t have an archive? <Link href="/register" className="text-primary hover:underline font-bold">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-surface-container-lowest text-on-surface">Initializing Secure Link...</div>}>
      <LoginContent />
    </Suspense>
  );
}
