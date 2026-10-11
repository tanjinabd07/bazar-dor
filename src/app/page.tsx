import Hero from "@/components/hero";
import PriceIncreasedProducts from "@/components/priceIncreased";
import PriceDecreasedProducts from "@/components/priceDecreased";
import AllProductsSection from "@/components/allProducts";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Hero />
        <PriceIncreasedProducts />
        <PriceDecreasedProducts />
        <AllProductsSection />
      </div>

      {/* বাজারের বাকি তালিকা বা প্রোডাক্ট সেকশন */}
    </main>
  );
}
