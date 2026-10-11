"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Suspense, useState, useRef, useEffect } from "react";

const categories = [
  { name: "চাল", icon: "🍚", href: "/category/rice" },
  { name: "ডাল", icon: "🫘", href: "/category/lentils" },
  { name: "তেল", icon: "🛢️", href: "/category/oil" },
  { name: "সবজি", icon: "🥔", href: "/category/vegetables" },
  { name: "মাছ", icon: "🐟", href: "/category/fish" },
  { name: "মাংস", icon: "🥩", href: "/category/meat" },
  { name: "দুধ-ডিম", icon: "🥚", href: "/category/dairy" },
  { name: "মসলা", icon: "🫚", href: "/category/spices" },
];

// Main Navbar Component
function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown-er baire click korle menu close hobe
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Profile page khola thakle previous page-e fire jabe
  const handleProfileClick = () => {
    setIsOpen(false);

    if (pathname === "/profile") {
      router.back();
    } else {
      router.push("/profile");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* TOP NAVBAR */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 md:px-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600 text-lg">
              🛒
            </div>

            <div className="leading-tight">
              <h1 className="text-[18px] font-bold text-gray-800">বাজার দর</h1>
              <p className="text-[9px] text-gray-500">তাজা খবর, সঠিক দাম</p>
            </div>
          </Link>

          {/* AUTH / PROFILE DROPDOWN */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                {/* PROFILE BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    if (pathname === "/profile") {
                      setIsOpen(false);
                      router.back();
                    } else {
                      setIsOpen((prev) => !prev);
                    }
                  }}
                  className="flex items-center gap-2 rounded-full px-3 py-1.5 transition hover:bg-gray-100 focus:outline-none"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-sm font-bold uppercase text-white">
                    {user.name?.charAt(0) || "U"}
                  </div>

                  <span className="text-sm font-medium text-gray-800">
                    {user.name}
                  </span>

                  <span className="text-xs text-gray-500">▼</span>
                </button>

                {/* DROPDOWN MENU */}
                {isOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-64 space-y-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
                    {/* USER INFO */}
                    <div className="border-b border-gray-100 px-2 pb-3 pt-1">
                      <p className="text-sm font-bold text-gray-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    {/* MY PROFILE */}
                    <button
                      type="button"
                      onClick={handleProfileClick}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      <span>👤</span>
                      আমার প্রোফাইল
                    </button>

                    {/* SIGN OUT */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <span>↩</span>
                      সাইন আউট
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* SIGN IN */}
                <Link
                  href="/sign-in"
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  সাইন ইন
                </Link>

                {/* SIGN UP */}
                <Link
                  href="/sign-up"
                  className="rounded-md bg-green-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CATEGORY NAVIGATION */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1440px] overflow-x-auto px-5 md:px-8">
          <nav className="flex min-w-max items-center justify-center gap-2 py-2">
            {categories.map((category) => {
              const isActive =
                pathname === category.href ||
                pathname.startsWith(`${category.href}/`);

              return (
                <Link
                  key={category.href}
                  href={category.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-green-700"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

// Suspense Boundary
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
          <div className="h-[68px] border-b border-gray-100" />
          <div className="h-12 border-b border-gray-100" />
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
