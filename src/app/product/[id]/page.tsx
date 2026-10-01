import { notFound } from "next/navigation";
import { getProduct, PRODUCTS } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) return notFound();
  return <ProductDetail product={product} />;
}
