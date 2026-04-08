"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await api.post("/auth/register/", { 
        username, 
        email, 
        password, 
        password2 
      });
      router.push("/login?registered=true");
    } catch (err: unknown) {
      const responseData = (err as { response?: { data?: Record<string, string[]> } }).response?.data;
      const errorMsg = responseData ? JSON.stringify(responseData) : "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-surface-container-lowest p-6">
      <div className="w-full max-w-md bg-surface border border-outline-variant/20 rounded-xl shadow-2xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Join JobPilot</h1>
          <p className="text-sm text-on-surface-variant">Deploy your career archive today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {error && (
            <div className="p-3 bg-error/10 border border-error/20 text-error text-[10px] mono-text rounded break-words">
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
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md py-2.5 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="commander"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md py-2.5 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="sarah@linear.app"
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
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md py-2.5 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/20 rounded-md py-2.5 px-4 text-sm text-on-surface focus:ring-1 focus:ring-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-primary to-primary-container text-on-primary-container text-sm font-black uppercase tracking-widest rounded-md shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? "Processing..." : "Create Archive"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-on-surface-variant">
          Already a member? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
