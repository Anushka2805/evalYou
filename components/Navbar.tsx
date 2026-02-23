"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Eval<span className="text-blue-500">You</span>.ai
        </Link>

        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="flex gap-4">
          <Link href="/auth/signin" className="text-sm text-gray-300">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-blue-600 hover:bg-blue-500 transition px-4 py-2 rounded-lg text-sm font-medium"
          >
            Get Started →
          </Link>
        </div>
      </div>
    </nav>
  );
}