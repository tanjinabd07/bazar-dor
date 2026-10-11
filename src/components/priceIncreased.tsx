"use client";
import React, { useEffect, useState } from "react";

// এপিআই থেকে আসা ডেটার টাইপ ইন্টারফেস
interface Product {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

export default function PriceIncreaseSection() {
  const [increasedItems, setIncreasedItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );
        const data = await response.json();

        // এপিআই ডেটা থেকে সরাসরি যেগুলোর change.dir "up" সেগুলোকে ফিল্টার করা হলো এবং সর্বোচ্চ ৬টি নেওয়া হলো
        const filtered = data
          .filter((item: Product) => item.change && item.change.dir === "up")
          .slice(0, 6);

        setIncreasedItems(filtered);
      } catch (error) {
        console.error("ডেটা ফেচ করতে সমস্যা হয়েছে:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Figma Matching Title */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-red-600 text-sm">▲</span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          আজ দাম বেড়েছে
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {increasedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
            {/* Left side: Icon, Name & Price */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                {item.image || "📦"}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {item.nameBn}
                </h3>
                <p className="text-xs text-gray-500">
                  বর্তমান দাম:{" "}
                  <span className="font-semibold text-gray-800">
                    ৳{item.today} / {item.unit}
                  </span>
                </p>
              </div>
            </div>

            {/* Right side: Percentage Badge */}
            <div className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0">
              <span>+{item.change.pct}%</span>
              <span>📈</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
