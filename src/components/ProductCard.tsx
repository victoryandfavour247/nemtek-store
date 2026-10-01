"use client";

import Link from "next/link";
import { formatPrice, pricing, type Product } from "@/lib/products";
import { useStore } from "@/store/StoreProvider";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const saved = inWishlist(product.id);
  const { oldPrice, discount } = pricing(product);
  const low = product.stock <= 5;

  return (
    <div className="group relative flex flex-col overflow-hidden bg-[var(--surface)] transition-shadow duration-200 hover:z-10 hover:shadow-[var(--shadow-md)]"
      style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
      <span className="disc-badge">-{discount}%</span>

      <button
        aria-label="Toggle wishlist"
        onClick={() => toggleWishlist(product.id)}
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full"
        style={{ background: "var(--surface)", boxShadow: "var(--shadow-sm)", color: saved ? "var(--red)" : "var(--text-faint)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
        </svg>
      </button>

      <Link href={`/product/${product.id}`} className="block">
        <ProductImage product={product} className="aspect-square w-full" />
      </Link>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 min-h-[36px] text-[13px] leading-snug text-[var(--text-soft)] hover:text-[var(--orange)]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[16px] font-extrabold" style={{ color: "var(--text)" }}>{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] line-through" style={{ color: "var(--text-faint)" }}>{formatPrice(oldPrice)}</span>
          <span className="rounded-sm px-1 text-[11px] font-bold" style={{ color: "var(--red)", background: "#ffe8ec" }}>-{discount}%</span>
        </div>

        {/* rating */}
        <div className="mt-1.5 flex items-center gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-sm px-1 py-0.5 text-[11px] font-bold text-white" style={{ background: "var(--amber)" }}>
            {product.rating.toFixed(1)}
            <svg width="9" height="9" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z"/></svg>
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>({product.reviews})</span>
          {low && <span className="ml-auto text-[11px] font-semibold" style={{ color: "var(--red)" }}>{product.stock} left</span>}
        </div>

        <button className="btn btn-primary mt-2.5 w-full !py-2 !text-[13px]" onClick={() => addToCart(product.id)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="9" cy="21" r="1.6" /><circle cx="18" cy="21" r="1.6" />
            <path d="M2 2h3l2.6 13.2a1.8 1.8 0 001.8 1.4h8.8a1.8 1.8 0 001.8-1.4L23 7H6" />
          </svg>
          Add to cart
        </button>
      </div>
    </div>
  );
}
