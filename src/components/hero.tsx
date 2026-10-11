"use client"; // এটি ক্লায়েন্ট কম্পোনেন্ট হিসেবে ডিক্লেয়ার করার জন্য জরুরি

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // বাংলা লোকাল (Locale) ব্যবহার করে আজকের তারিখ ও বার জেনারেট করা
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("bn-BD", options).format(
      new Date(),
    );
    setCurrentDate(formattedDate);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 space-y-4 text-left">
          {/* Dynamic Date Tag */}
          <span className="inline-block text-xs font-medium text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            {currentDate || "লোড হচ্ছে..."}
          </span>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            আজকের বাজারের দাম এক নজরে
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-xl">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, মসলা ও অন্যান্য নিত্যপ্রয়োজনীয়
            পণ্যের আজকের বাজারদর এবং দামের পরিবর্তন সম্পর্কে বিস্তারিত জানুন।
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <a
              href="#market-list"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-3 rounded-xl shadow-md transition duration-200"
            >
              সকল বাজার দেখুন
            </a>
          </div>
        </div>

        {/* Right Illustration/Image */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="relative w-64 h-48 md:w-80 md:h-60">
            <Image
              src="/banar.png"
              alt="Market Basket Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
