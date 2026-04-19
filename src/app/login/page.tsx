"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Inner component that uses useSearchParams — must be inside <Suspense>
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("from") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials");
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass p-10 rounded-[2.5rem] border-[#ffffff11] relative shadow-2xl">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#00d4ff] flex items-center justify-center font-bold text-black text-2xl mb-6 shadow-[0_0_20px_rgba(0,212,255,0.3)]">
          S
        </div>
        <h1 className="text-3xl font-bold font-[var(--font-space)] mb-2 tracking-tight">Admin Access</h1>
        <p className="text-[#64748b] text-sm md:text-base text-center">Enter your details to manage the guide.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-6 animate-pulse">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#334155] group-focus-within:text-[#00d4ff] transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0f1e]/50 border border-[#1e293b] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all text-white placeholder:text-[#334155]"
              placeholder="admin@smarttech.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#64748b] px-1 uppercase tracking-widest">Password</label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#334155] group-focus-within:text-[#00d4ff] transition-colors" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0f1e]/50 border border-[#1e293b] rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#00d4ff] focus:ring-1 focus:ring-[#00d4ff] transition-all text-white placeholder:text-[#1e293b]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00d4ff] text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#00c4ef] transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 shadow-[0_0_20px_rgba(0,212,255,0.3)] mt-8"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign In <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="text-sm text-[#64748b] hover:text-[#00d4ff] transition-colors inline-flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}

// Page wraps LoginForm in Suspense so useSearchParams() works during static prerendering
export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[150px] bg-gradient-to-tr from-[#00d4ff15] to-[#ffa50015] pointer-events-none -z-10" />
      <Suspense fallback={
        <div className="w-16 h-16 rounded-2xl bg-[#00d4ff] flex items-center justify-center font-bold text-black text-2xl shadow-[0_0_20px_rgba(0,212,255,0.3)] animate-pulse">
          S
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
