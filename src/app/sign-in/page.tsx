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

const inputClass =
  "h-10 w-full rounded-lg border border-[#e1e8df] bg-[#fafcf9] px-4 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-800 focus:border-green-600 focus:ring-2 focus:ring-green-100";

const labelClass = "mb-1.5 block text-sm text-gray-900";

const socialClass =
  "flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e1e8df] bg-[#fafcf9] px-3 text-sm font-semibold text-gray-900 transition hover:bg-white";

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
        setError("অ্যাকাউন্টের তথ্য পড়তে সমস্যা হয়েছে।");
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
      setError("সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eff3ee] px-4 py-5">
      <div className="mx-auto w-full max-w-[440px]">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">সাইন ইন</h1>
          <p className="mt-1 text-sm text-gray-500">
            বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#e1e8df] bg-[#fafcf9] p-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div>
              <label htmlFor="signin-email" className={labelClass}>
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
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="signin-password" className={labelClass}>
                পাসওয়ার্ড
              </label>
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৮ অক্ষর"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full rounded-lg bg-[#058a3e] text-sm font-semibold text-white shadow-[0_5px_12px_-4px_rgba(5,138,62,0.45)] transition hover:bg-[#047a37] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-3 flex items-center gap-3">
            <span className="h-0.5 flex-1 bg-gray-200" />
            <span className="text-xs text-gray-800">অথবা</span>
            <span className="h-0.5 flex-1 bg-gray-200" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setError(
                  "Google login চালু করতে OAuth authentication setup করতে হবে।",
                )
              }
              className={socialClass}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
                />
              </svg>
              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type="button"
              onClick={() =>
                setError(
                  "GitHub login চালু করতে OAuth authentication setup করতে হবে।",
                )
              }
              className={socialClass}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
              </svg>
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-3 text-center text-sm text-gray-900">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/sign-up" className="text-[#058a3e] hover:underline">
              সাইন আপ করুন
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">
            ← হোম পেজে ফিরে যান
          </Link>
        </p>
      </div>
    </main>
  );
}
