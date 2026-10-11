
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

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
  markets?: Market[];
}

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        const response = await fetch(
          `https://openapi.programming-hero.com/api/bazardor/products/${productId}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য লোড করা যায়নি।");
        }

        const result = await response.json();

        // API response থেকে product বের করা
        const data = result?.data;

        const candidate = Array.isArray(data)
          ? data.find(
              (item: Product) => String(item.id) === String(productId)
            )
          : data?.product ?? data ?? result?.product ?? result;

        if (
          !candidate ||
          typeof candidate !== "object" ||
          Array.isArray(candidate) ||
          String(candidate.id) !== String(productId)
        ) {
          throw new Error("এই ID-এর পণ্য পাওয়া যায়নি।");
        }

        setProduct(candidate as Product);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "পণ্যের তথ্য লোড করতে সমস্যা হয়েছে।"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    if (productId) {
      fetchProduct();
    }

    return () => controller.abort();
  }, [productId]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-600">
        পণ্যের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (error || !product) {
    return (
      <main className="px-4 py-20 text-center">
        <p className="mb-5 text-red-600">
          {error || "পণ্যটি পাওয়া যায়নি।"}
        </p>

        <Link
          href="/"
          className="font-medium text-green-700 underline"
        >
          হোম পেজে ফিরে যাও
        </Link>
      </main>
    );
  }

  const isUp = product.change?.dir === "up";
  const isDown = product.change?.dir === "down";

  return (
    <main className="min-h-screen bg-[#F8FAF9] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <Link href="/" className="hover:text-green-600">
            হোম
          </Link>

          <span>/</span>

          <Link
            href={`/category/${product.category}`}
            className="hover:text-green-600"
          >
            {product.categoryNameBn || "ক্যাটাগরি"}
          </Link>

          <span>/</span>

          <span className="font-medium text-gray-900">
            {product.nameBn}
          </span>
        </div>

        {/* Product Header */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-50 text-3xl">
                {product.image?.startsWith("http") ? (
                  <Image
                    src={product.image}
                    alt={product.nameBn}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                    unoptimized
                  />
                ) : (
                  product.image || product.categoryIcon || "📦"
                )}
              </div>

              <div>
                <h1 className="mb-1 text-2xl font-bold text-gray-900">
                  {product.nameBn}
                </h1>

                <p className="text-xs text-gray-500 sm:text-sm">
                  প্রতি {product.unit} · ক্যাটাগরি:{" "}
                  {product.categoryNameBn}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-3 sm:text-right">
              <p className="mb-1 text-[11px] text-gray-400">
                বাজারের ভাব
              </p>

              <div
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                  isUp
                    ? "bg-red-50 text-red-600"
                    : isDown
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                <span>
                  {isUp ? "▲" : isDown ? "▼" : "—"}
                </span>

                <span>
                  {isUp ? "+" : isDown ? "-" : ""}
                  {product.change?.pct ?? 0}%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            বাজার সারসংক্ষেপ
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Today's Price */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs text-gray-500">
                আজকের দাম
              </p>

              <p className="text-xl font-bold text-gray-900">
                ৳{product.today}
                <span className="text-xs font-normal text-gray-500">
                  {" "}/ {product.unit}
                </span>
              </p>
            </div>

            {/* Yesterday's Price */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs text-gray-500">
                গতকালের দাম
              </p>

              <p className="text-xl font-bold text-gray-900">
                ৳{product.yesterday}
                <span className="text-xs font-normal text-gray-500">
                  {" "}/ {product.unit}
                </span>
              </p>
            </div>

            {/* Price Change */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <p className="mb-1 text-xs text-gray-500">
                দামের পরিবর্তন
              </p>

              <p
                className={`text-lg font-bold ${
                  isUp
                    ? "text-red-600"
                    : isDown
                      ? "text-green-600"
                      : "text-gray-600"
                }`}
              >
                {isUp
                  ? "▲ বৃদ্ধি পেয়েছে"
                  : isDown
                    ? "▼ হ্রাস পেয়েছে"
                    : "— অপরিবর্তিত"}
              </p>
            </div>
          </div>
        </section>

        {/* Market-wise Price Table */}
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            বাজারভিত্তিক আজকের দর
          </h2>

          {product.markets && product.markets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
                    <th className="px-4 py-3">বাজার</th>
                    <th className="px-4 py-3">অঞ্চল</th>
                    <th className="px-4 py-3">সর্বনিম্ন (৳)</th>
                    <th className="px-4 py-3">সর্বোচ্চ (৳)</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                  {product.markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        {market.market}
                      </td>

                      <td className="px-4 py-3.5 text-gray-500">
                        {market.division}
                      </td>

                      <td className="px-4 py-3.5 font-semibold">
                        ৳{market.min}
                      </td>

                      <td className="px-4 py-3.5 font-semibold">
                        ৳{market.max}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-gray-50 p-5 text-sm text-gray-500">
              এই পণ্যের জন্য আলাদা বাজারভিত্তিক দামের তথ্য API-তে পাওয়া যায়নি।
            </p>
          )}
        </section>

        {/* Back Button */}
        <div>
          <Link
            href="/"
            className="inline-flex rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            ← সব পণ্য দেখো
          </Link>
        </div>

      </div>
    </main>
  );
}
