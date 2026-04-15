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
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest p-6">
      <div className="mb-8 flex flex-col items-center gap-4">
        <Link href="/" className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
          </svg>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Join JobPilot</h1>
          <p className="text-sm text-on-surface-variant">Deploy your smart job tracker today</p>
        </div>
      </div>

      <div className="w-full max-w-md bg-surface border border-outline-variant/20 rounded-xl shadow-2xl p-8">

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
