import { Suspense } from "react";
import CategoryProductsClient from "./categoryProductsClient";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryProductsPage({
  params,
}: CategoryPageProps) {
  // এখানে সরাসরি params এওয়াইট করে slug বের করে নিতে হবে
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-gray-600">পণ্য লোড হচ্ছে...</div>
      }
    >
      <CategoryProductsClient slug={slug} />
    </Suspense>
  );
}
