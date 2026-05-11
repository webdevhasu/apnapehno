"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        toast.success("Welcome back!");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-bg to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-border">
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-3">
            <Image src="/logo.png" alt="Apna Pehnoo" fill className="object-contain" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-accent">Admin Dashboard</h1>
          <p className="text-sm text-text-light">Apna Pehnoo Management</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary"
              placeholder="admin@apnapehnoo.com" required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:border-primary"
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
