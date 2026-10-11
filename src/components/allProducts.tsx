"use client";
import React, { useEffect, useState } from "react";

// এপিআই-এর ডেটা স্ট্রাকচার অনুযায়ী ইন্টারফেস
interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

export default function AllProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );
        const data = await response.json();
        setProducts(data);
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
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">সব পণ্য</h2>
        <p className="text-sm text-gray-500">
            মোট ৩৩টি পণ্য দেখানো হচ্ছে
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((item) => {
          // দাম বাড়লে লাল, কমলে সবুজ এবং সমান থাকলে ধূসর কালার ও আইকন সেট করা
          const isUp = item.change.dir === "up";
          const isDown = item.change.dir === "down";

          const badgeColor = isUp
            ? "bg-red-50 text-red-600"
            : isDown
              ? "bg-green-50 text-green-600"
              : "bg-gray-100 text-gray-600";

          const sign = isUp ? "+" : "";
          const arrowIcon = isUp ? "▲" : isDown ? "▼" : "—";

          return (
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
                    বাজারদর তাজা:{" "}
                    <span className="font-semibold text-gray-800">
                      ৳{item.today} / {item.unit}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right side: Percentage Badge */}
              <div
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 ${badgeColor}`}
              >
                <span>{arrowIcon}</span>
                <span>
                  {sign}
                  {item.change.pct}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
