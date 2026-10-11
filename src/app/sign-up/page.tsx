"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Account = {
  name: string;
  email: string;
  password: string;
};

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setError("আপনার নাম লিখুন।");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    if (password !== confirmPassword) {
      setError("দুটি পাসওয়ার্ড মিলছে না।");
      return;
    }

    setIsSubmitting(true);

    try {
      const storedAccounts = localStorage.getItem("bazar-dor-accounts");

      const accounts: Account[] = storedAccounts
        ? JSON.parse(storedAccounts)
        : [];

      if (!Array.isArray(accounts)) {
        setError("অ্যাকাউন্টের তথ্য পড়তে সমস্যা হয়েছে।");
        return;
      }

      const accountExists = accounts.some(
        (account) => account.email.toLowerCase() === normalizedEmail,
      );

      if (accountExists) {
        setError("এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে।");
        return;
      }

      const newAccount: Account = {
        name: normalizedName,
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(
        "bazar-dor-accounts",
        JSON.stringify([...accounts, newAccount]),
      );

      setSuccess("অ্যাকাউন্ট তৈরি হয়েছে! Sign In পেজে যাচ্ছি।");

      router.push("/sign-in");
    } catch {
      setError("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
        <Link href="/" className="block text-center">
          <h1 className="text-3xl font-bold text-green-700">🛒 বাজার দর</h1>
          <p className="mt-1 text-sm text-gray-500">
            বিনামূল্যে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
          </p>
        </Link>

        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          অ্যাকাউন্ট তৈরি করুন
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          আপনার তথ্য দিয়ে নতুন অ্যাকাউন্ট খুলুন।
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              নাম
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: তানজিনা"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              ইমেইল
            </label>
            <input
              id="signup-email"
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
              htmlFor="signup-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              minLength={8}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="পাসওয়ার্ড আবার লিখুন"
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

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white shadow-md transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>
      </div>
    </main>
  );
}
