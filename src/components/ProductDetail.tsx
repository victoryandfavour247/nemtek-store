"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice, pricing, PRODUCTS, CATEGORIES, type Product } from "@/lib/products";
import { useStore } from "@/store/StoreProvider";
import ProductImage from "@/components/ProductImage";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";

export default function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, inWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const saved = inWishlist(product.id);
  const { oldPrice, discount } = pricing(product);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const features = [
    "Genuine, warranty-backed product",
    "Nationwide delivery across Ghana",
    "Expert installation support available",
    `Ships from category: ${CATEGORIES[product.category].label}`,
  ];

  return (
    <div className="container-x py-8">
      <nav className="mb-5 text-sm" style={{ color: "var(--text-faint)" }}>
        <Link href="/" className="hover:text-[var(--blue)]">Home</Link> /{" "}
        <Link href={`/shop?category=${product.category}`} className="hover:text-[var(--blue)]">{CATEGORIES[product.category].label}</Link> /{" "}
        <span style={{ color: "var(--text)" }}>{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* gallery */}
        <div>
          <div className="card overflow-hidden">
            <ProductImage product={product} className="aspect-square w-full" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card overflow-hidden opacity-80 transition hover:opacity-100">
                <ProductImage product={product} className="aspect-square w-full" />
              </div>
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-md px-2.5 py-1 text-xs font-extrabold" style={{ color: product.brand === "NEMTEK" ? "var(--blue)" : "var(--navy)", background: "var(--surface-2)" }}>
              {product.brand}
            </span>
            {product.badge && <span className="rounded-md px-2.5 py-1 text-xs font-bold text-white" style={{ background: "var(--red)" }}>{product.badge}</span>}
          </div>

          <h1 className="mt-3 text-3xl font-black leading-tight">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating value={product.rating} size={17} showNumber />
            <span className="text-sm" style={{ color: "var(--text-faint)" }}>({product.reviews} reviews)</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-4xl font-black" style={{ color: "var(--text)" }}>{formatPrice(product.price)}</span>
            <span className="rounded px-2 py-1 text-sm font-bold" style={{ color: "var(--red)", background: "#ffe8ec" }}>-{discount}%</span>
          </div>
          <div className="mt-1 text-base line-through" style={{ color: "var(--text-faint)" }}>{formatPrice(oldPrice)}</div>
          <div className="mt-1 text-sm" style={{ color: product.stock <= 5 ? "var(--red)" : "var(--green)" }}>
            {product.stock <= 5 ? `⚠ Only ${product.stock} left in stock` : `✓ In stock (${product.stock} available)`}
          </div>

          <p className="mt-5 leading-relaxed" style={{ color: "var(--text-soft)" }}>{product.desc}</p>

          {/* qty + add */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-xl">−</button>
              <span className="w-10 text-center text-lg font-bold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="grid h-12 w-12 place-items-center text-xl">+</button>
            </div>
            <button className="btn btn-primary flex-1" style={{ minWidth: 180 }} onClick={() => addToCart(product.id, qty)}>
              Add to cart · {formatPrice(product.price * qty)}
            </button>
            <button className="btn btn-outline" onClick={() => toggleWishlist(product.id)} style={{ color: saved ? "var(--red)" : undefined, borderColor: saved ? "var(--red)" : undefined }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
            </button>
          </div>

          {/* features */}
          <ul className="mt-7 grid gap-2.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "var(--text-soft)" }}>
                <span className="grid h-5 w-5 place-items-center rounded-full text-white" style={{ background: "var(--green)" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-black">You may also need</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
