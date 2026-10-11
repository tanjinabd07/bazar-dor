"use client";
import React, { useEffect, useState } from "react";

// এপিআই-এর ডেটা স্ট্রাকচার অনুযায়ী ইন্টারফেস
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

export default function PriceDecreasedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((result) => {
        const items = Array.isArray(result)
          ? result
          : result.products || result.data || [];

        // শুধুমাত্র যেগুলোর দাম কমেছে (dir === "down") সেগুলো ফিল্টার করা হলো
        const decreased = items
          .filter((item: Product) => item.change && item.change.dir === "down")
          .slice(0, 6);

        setProducts(decreased);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-8">লোড হচ্ছে...</div>;
  }

  // যদি কোনো পণ্য না থাকে তবে কম্পোনেন্ট রেন্ডার হবে না
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-green-600 text-sm">▼</span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          আজ দাম কমেছে
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex items-center justify-between"
          >
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

            <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-xs font-semibold flex-shrink-0">
              <span>{Math.abs(item.change.pct)}%</span>
              <span>📉</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
