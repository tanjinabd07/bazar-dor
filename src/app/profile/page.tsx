
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

type ProfileFormProps = {
  initialName: string;
  initialEmail: string;
  onUpdate: (name: string, email: string) => void;
};

function ProfileForm({
  initialName,
  initialEmail,
  onUpdate,
}: ProfileFormProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (!name.trim() || !email.trim()) {
      setErrorMessage("নাম ও ইমেইল পূরণ করুন।");
      return;
    }

    onUpdate(name.trim(), email.trim());

    // Update হওয়ার পর input খালি হবে
    setName("");
    setEmail("");
    setNameFocused(false);
    setEmailFocused(false);

    setSuccessMessage("সফলভাবে তথ্য আপডেট করা হয়েছে!");
  };

  return (
    <form
      onSubmit={handleUpdate}
      className="space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-bold text-gray-900">
        তথ্য আপডেট করুন
      </h3>

      {successMessage && (
        <p
          role="status"
          className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {/* Name */}
      <div>
        <label
          htmlFor="profile-name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          নাম
        </label>

        <input
          id="profile-name"
          type="text"
          value={name}
          onFocus={() => {
            if (!nameFocused) {
              setName("");
              setNameFocused(true);
            }
          }}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="profile-email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          ইমেইল
        </label>

        <input
          id="profile-email"
          type="email"
          value={email}
          onFocus={() => {
            if (!emailFocused) {
              setEmail("");
              setEmailFocused(true);
            }
          }}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white shadow-md transition hover:bg-green-800"
      >
        আপডেট
      </button>
    </form>
  );
}

export default function ProfilePage() {
  const { user, updateUser, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">প্রোফাইল লোড হচ্ছে...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <h1 className="text-2xl font-bold text-gray-900">
          আপনি সাইন ইন করেননি
        </h1>

        <p className="text-gray-600">
          প্রোফাইল দেখতে প্রথমে সাইন ইন করুন।
        </p>

        <Link
          href="/sign-in"
          className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          সাইন ইন করুন
        </Link>
      </main>
    );
  }

  const userName = user.name || "ব্যবহারকারী";
  const userEmail = user.email || "user@example.com";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleProfileUpdate = (name: string, email: string) => {
    updateUser({
      ...user,
      name,
      email,
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন এবং আপডেট করুন।
          </p>
        </div>

        {/* Profile Card */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-green-600 bg-green-50 text-xl font-bold text-green-700">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={userName}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              ) : (
                userInitial
              )}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold text-gray-900">
                {userName}
              </h2>

              <p className="break-all text-sm text-gray-500">
                {userEmail}
              </p>
            </div>
          </div>

          <Link
            href="/sign-in"
            onClick={logout}
            className="shrink-0 rounded-lg border border-red-200 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
          >
            সাইন আউট
          </Link>
        </div>

        {/* Update Form */}
        <ProfileForm
          initialName={user.name}
          initialEmail={user.email}
          onUpdate={handleProfileUpdate}
        />
      </div>
    </main>
  );
}

