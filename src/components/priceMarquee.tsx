"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
};

export default function PriceMarquee() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api.api-store.workers.dev/api/bazardor/products",
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: Product[] = await response.json();

        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden border-b border-gray-200 bg-white">
      <div className="flex w-max animate-marquee">
        {/* First copy */}
        <div className="flex shrink-0">
          {products.map((product) => (
            <PriceItem key={`first-${product.id}`} product={product} />
          ))}
        </div>

        {/* Second copy */}
        <div className="flex shrink-0">
          {products.map((product) => (
            <PriceItem key={`second-${product.id}`} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================
// PRICE ITEM
// =========================================

function PriceItem({ product }: { product: Product }) {
  const unitText =
    {
      kg: "কেজি",
      litre: "লিটার",
      dozen: "ডজন",
      piece: "পিস",
    }[product.unit] || product.unit;

  const isUp = product.change.dir === "up";
  const isDown = product.change.dir === "down";
  const isFlat = product.change.dir === "flat";

  return (
    <div className="flex shrink-0 items-center gap-2 border-r border-gray-200 px-5 py-2 text-xs whitespace-nowrap">
      {/* Product Emoji */}
      <span className="text-sm">{product.image}</span>

      {/* Product Name */}
      <span className="font-medium text-gray-700">{product.nameBn}</span>

      {/* Price */}
      <span className="text-gray-500">
        {product.today} টাকা/{unitText}
      </span>

      {/* Price Change */}
      <span
        className={
          isUp
            ? "font-semibold text-red-500"
            : isDown
              ? "font-semibold text-green-600"
              : "font-semibold text-gray-400"
        }
      >
        {isUp && "▲"}
        {isDown && "▼"}
        {isFlat && "—"} {Math.abs(product.change.pct)}%
      </span>
    </div>
  );
}
