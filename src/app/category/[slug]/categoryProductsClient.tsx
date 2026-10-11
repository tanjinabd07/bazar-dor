"use client";

import { useEffect, useMemo, useState } from "react";
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
  today: number | string;
  yesterday: number | string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number | string;
  };
}

type SortOption = "default" | "price-asc" | "price-desc";

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

const BENGALI_DIGITS = "০১২৩৪৫৬৭৮৯";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

// বাংলা ও ইংরেজি সংখ্যাকে numeric value-তে রূপান্তর (sort-এর জন্য)
function toNumber(value: number | string): number {
  const normalized = String(value)
    .replace(/[০-৯]/g, (digit) => String(BENGALI_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
    .replace(/[৳,\s]/g, "")
    .trim();

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

// ইংরেজি সংখ্যাকে বাংলা সংখ্যায় রূপান্তর (দেখানোর জন্য)
function toBengali(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

// "কেজি" -> "প্রতি কেজি", আগে থেকে "প্রতি" থাকলে অপরিবর্তিত
function formatUnit(unit: string): string {
  const trimmed = (unit ?? "").trim();

  if (!trimmed) return "";

  return trimmed.startsWith("প্রতি") ? trimmed : `প্রতি ${trimmed}`;
}

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
  const [sortBy, setSortBy] = useState<SortOption>("default");

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

  // Dropdown-এর option অনুযায়ী product sort (সংখ্যার মান ধরে, string ধরে নয়)
  const sortedProducts = useMemo(() => {
    if (sortBy === "default") return products;

    return [...products].sort((a, b) => {
      const priceA = toNumber(a.today);
      const priceB = toNumber(b.today);

      return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
    });
  }, [products, sortBy]);

  if (loading) {
    return (
      <div className="py-16 text-center text-gray-600">পণ্য লোড হচ্ছে...</div>
    );
  }

  if (error) {
    return <div className="py-16 text-center text-red-600">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-[#eff3ee] px-4 py-5 sm:px-6">
      <section className="mx-auto flex max-w-4xl flex-col gap-4">
        {/* Category Header */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#e1e8df] bg-[#fafcf9] px-5 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-2xl">
            {categoryIcon}
          </div>

          <div>
            <h1 className="text-2xl font-bold leading-tight text-gray-900">
              {categoryName}
            </h1>

            <p className="text-xs text-gray-500">
              {toBengali(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center justify-end gap-2 rounded-2xl border border-[#e1e8df] bg-[#fafcf9] px-5 py-4">
          <label htmlFor="product-sort" className="text-sm text-gray-500">
            সাজান
          </label>

          <div className="relative">
            <select
              id="product-sort"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="cursor-pointer appearance-none rounded-lg border border-[#e1e8df] bg-[#fafcf9] py-1.5 pl-3 pr-8 text-xs text-gray-800 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>

            {/* Chevron Icon */}
            <svg
              className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>

        {/* Product Count */}
        <p className="text-xs text-gray-500">
          মোট {toBengali(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Product Cards */}
        {sortedProducts.length === 0 ? (
          <div className="rounded-2xl border border-[#e1e8df] bg-[#fafcf9] py-12 text-center">
            <p className="text-gray-600">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((item) => {
              const isUp = item.change?.dir === "up";
              const isDown = item.change?.dir === "down";

              const badgeColor = isUp
                ? "bg-[#f1efed] text-red-600"
                : isDown
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-700";

              const arrowIcon = isUp ? "▲" : isDown ? "▼" : "—";
              const pct = toNumber(item.change?.pct ?? 0).toFixed(1);

              return (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="flex min-w-0 flex-col gap-3 rounded-xl border border-[#e1e8df] bg-[#fafcf9] p-3 transition duration-200 hover:shadow-md"
                >
                  {/* Product Information */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eef2ec] text-xl">
                      {item.image?.startsWith("http") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.nameBn}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        item.image || item.categoryIcon || "📦"
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold leading-tight text-gray-900">
                        {item.nameBn}
                      </h2>

                      <p className="text-[11px] text-gray-500">
                        {formatUnit(item.unit)}
                      </p>
                    </div>
                  </div>

                  {/* Price + Change Badge */}
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-gray-500">আজকের দাম</p>

                      <p className="text-lg font-bold leading-snug text-gray-900">
                        {toBengali(toNumber(item.today))}{" "}
                        <span className="text-sm font-medium">টাকা</span>
                      </p>
                    </div>

                    <div
                      className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeColor}`}
                    >
                      <span className="text-[8px]">{arrowIcon}</span>
                      <span>{toBengali(pct)}%</span>
                    </div>
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
