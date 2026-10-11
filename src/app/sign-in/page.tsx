"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Account = {
  name: string;
  email: string;
  password: string;
  image?: string;
};

export default function SignInPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const storedAccounts = localStorage.getItem("bazar-dor-accounts");

      const accounts: Account[] = storedAccounts
        ? JSON.parse(storedAccounts)
        : [];

      if (!Array.isArray(accounts)) {
        setError("অ্যাকাউন্টের তথ্য পড়তে সমস্যা হয়েছে।");
        return;
      }

      const account = accounts.find(
        (item) =>
          item.email.toLowerCase() === normalizedEmail &&
          item.password === password,
      );

      if (!account) {
        setError("ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
        return;
      }

      login(account.name, account.email, account.image);

      router.push("/");
    } catch {
      setError("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <Link href="/" className="block text-center">
          <h1 className="text-3xl font-bold text-green-700">🛒 বাজার দর</h1>
          <p className="mt-1 text-sm text-gray-500">তাজা খবর, সঠিক দাম</p>
        </Link>

        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          স্বাগতম!
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          আপনার অ্যাকাউন্টে প্রবেশ করুন
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="signin-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>
            <input
              id="signin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="signin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড লিখুন"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white shadow-md transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">অথবা</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setError(
                "Google login চালু করতে OAuth authentication setup করতে হবে।",
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span>🌐</span> Google
          </button>

          <button
            type="button"
            onClick={() =>
              setError(
                "GitHub login চালু করতে OAuth authentication setup করতে হবে।",
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <span>🐙</span> GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন আপ করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
