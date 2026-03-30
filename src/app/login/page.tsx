"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/gallery");
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-end">
      {/* Background image */}
      <img
        src="/family.jpg"
        alt="Family"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-12 pt-8">
        {/* App title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🎨 さくひんしゅう
          </h1>
          <p className="text-white/80 text-base">
            こどもの さくひんを きろくしよう
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレス"
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-coral/50 focus:bg-white/30"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-coral/50 focus:bg-white/30"
          />
          <button
            type="submit"
            className="w-full py-3 bg-coral text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            ログイン
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center mt-5">
          <button className="text-white/70 text-sm hover:text-white transition-colors underline underline-offset-2">
            はじめてのかた
          </button>
        </div>
      </div>
    </div>
  );
}
