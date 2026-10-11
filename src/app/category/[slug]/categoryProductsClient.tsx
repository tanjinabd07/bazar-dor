"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

const categoryNames: Record<string, string> = {
  rice: "চাল",
  lentils: "ডাল",
  oil: "তেল",
  vegetables: "সবজি",
  fish: "মাছ",
  meat: "মাংস",
  dairy: "দুধ-ডিম",
  spices: "মসলা",
};

const categoryIcons: Record<string, string> = {
  rice: "🍚",
  lentils: "🫘",
  oil: "🛢️",
  vegetables: "🥔",
  fish: "🐟",
  meat: "🥩",
  dairy: "🥚",
  spices: "🫚",
};

const categoryMap: Record<string, string[]> = {
  rice: ["rice", "chal"],
  lentils: ["lentils", "dal"],
  oil: ["oil", "tel"],
  vegetables: ["vegetables", "vegetable", "sobji"],
  fish: ["fish", "mach"],
  meat: ["meat", "mangsho"],
  dairy: ["dairy", "milk", "egg", "dudh", "dim"],
  spices: ["spices", "spice", "mosla"],
};

interface CategoryProductsClientProps {
  slug: string;
}

export default function CategoryProductsClient({
  slug,
}: CategoryProductsClientProps) {
  const categorySlug = slug.toLowerCase().trim();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );

        if (!response.ok) {
          throw new Error("পণ্য লোড করা যায়নি");
        }

        const result = await response.json();

        // API response-এর বিভিন্ন সম্ভাব্য structure সামলানো
        const possibleProducts = Array.isArray(result)
          ? result
          : Array.isArray(result?.products)
            ? result.products
            : Array.isArray(result?.data)
              ? result.data
              : Array.isArray(result?.data?.products)
                ? result.data.products
                : [];

        const allProducts = possibleProducts as Product[];

        const allowedCategories = (
          categoryMap[categorySlug] ?? [categorySlug]
        ).map((category) => category.toLowerCase());

        const filteredProducts = allProducts.filter((product) => {
          const productCategory = String(product.category ?? "")
            .toLowerCase()
            .trim();

          return allowedCategories.includes(productCategory);
        });

        if (!cancelled) {
          setProducts(filteredProducts);
        }
      } catch (err) {
        console.error("পণ্য লোড করতে সমস্যা হয়েছে:", err);

        if (!cancelled) {
          setError("পণ্য লোড করা যায়নি। আবার চেষ্টা করো।");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const categoryName = categoryNames[categorySlug] ?? "পণ্য";
  const categoryIcon = categoryIcons[categorySlug] ?? "🛒";

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600">পণ্য লোড হচ্ছে...</div>
    );
  }

  if (error) {
    return <div className="py-16 text-center text-red-600">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {categoryIcon} {categoryName}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            মোট {products.length} টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-gray-600">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => {
              const isUp = item.change?.dir === "up";
              const isDown = item.change?.dir === "down";

              const badgeColor = isUp
                ? "bg-red-50 text-red-600"
                : isDown
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-600";

              const arrowIcon = isUp ? "▲" : isDown ? "▼" : "—";
              const sign = isUp ? "+" : "";

              return (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl">
                      {item.image?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.nameBn}
                          className="h-full w-full rounded-xl object-contain"
                        />
                      ) : (
                        item.image || item.categoryIcon || "📦"
                      )}
                    </div>

                    <div>
                      <h2 className="mb-1 text-base font-bold text-gray-900">
                        {item.nameBn}
                      </h2>

                      <p className="text-xs text-gray-500">
                        আজকের দাম:{" "}
                        <span className="font-semibold text-gray-800">
                          ৳{item.today} / {item.unit}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold ${badgeColor}`}
                  >
                    <span>{arrowIcon}</span>
                    <span>
                      {sign}
                      {item.change?.pct ?? 0}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
