"use client";

import Link from "next/link";
import { useStore } from "@/store/StoreProvider";
import { getProduct } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { wishlist, ready } = useStore();
  if (!ready) return <div className="container-x py-20 text-center" style={{ color: "var(--text-soft)" }}>Loading…</div>;

  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <div className="container-x py-10">
      <h1 className="mb-1 text-3xl font-black">Your wishlist</h1>
      <p className="mb-7 text-sm" style={{ color: "var(--text-soft)" }}>{items.length} saved items</p>

      {items.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-16 text-center">
          <span className="text-4xl">💙</span>
          <p className="font-bold">No saved items yet</p>
          <p className="text-sm" style={{ color: "var(--text-soft)" }}>Tap the heart on any product to save it here.</p>
          <Link href="/shop" className="btn btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => <ProductCard key={p!.id} product={p!} />)}
        </div>
      )}
    </div>
  );
}
