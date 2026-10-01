"use client";

import Link from "next/link";
import { useStore } from "@/store/StoreProvider";
import { getProduct, formatPrice } from "@/lib/products";
import ProductImage from "./ProductImage";

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cart, cartSubtotal, cartCount, setQty, removeFromCart } = useStore();

  const freeShipThreshold = 2000;
  const remaining = Math.max(0, freeShipThreshold - cartSubtotal);
  const pct = Math.min(100, (cartSubtotal / freeShipThreshold) * 100);

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        style={{ opacity: cartOpen ? 1 : 0, pointerEvents: cartOpen ? "auto" : "none" }}
      />
      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col transition-transform duration-300"
        style={{ background: "var(--bg-elev)", transform: cartOpen ? "none" : "translateX(100%)", boxShadow: "var(--shadow-lg)" }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
          <h2 className="flex items-center gap-2 text-lg font-bold">
            Your Cart
            <span className="rounded-full px-2 py-0.5 text-xs font-bold text-white" style={{ background: "var(--blue)" }}>{cartCount}</span>
          </h2>
          <button onClick={() => setCartOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[var(--surface-2)]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full" style={{ background: "var(--surface-2)" }}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.8"><circle cx="9" cy="21" r="1.6"/><circle cx="18" cy="21" r="1.6"/><path d="M2 2h3l2.6 13.2a1.8 1.8 0 001.8 1.4h8.8a1.8 1.8 0 001.8-1.4L23 7H6"/></svg>
            </div>
            <p className="font-semibold">Your cart is empty</p>
            <p className="text-sm" style={{ color: "var(--text-soft)" }}>Add some products to get started.</p>
            <Link href="/shop" onClick={() => setCartOpen(false)} className="btn btn-primary">Browse products</Link>
          </div>
        ) : (
          <>
            {/* free shipping bar */}
            <div className="px-5 pt-4">
              <p className="mb-1.5 text-xs" style={{ color: "var(--text-soft)" }}>
                {remaining > 0 ? <>Add <b>{formatPrice(remaining)}</b> more for free delivery 🚚</> : <>🎉 You&apos;ve unlocked <b>free delivery!</b></>}
              </p>
              <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--surface-2)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "linear-gradient(90deg,var(--blue),var(--cyan))" }} />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {cart.map((line) => {
                const p = getProduct(line.id);
                if (!p) return null;
                return (
                  <div key={line.id} className="flex gap-3 rounded-xl border p-2.5" style={{ borderColor: "var(--border)" }}>
                    <ProductImage product={p} className="h-20 w-20 shrink-0 rounded-lg" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link href={`/product/${p.id}`} onClick={() => setCartOpen(false)} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-[var(--blue)]">
                        {p.name}
                      </Link>
                      <span className="text-xs" style={{ color: "var(--text-faint)" }}>{p.brand}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border" style={{ borderColor: "var(--border)" }}>
                          <button onClick={() => setQty(line.id, line.qty - 1)} className="grid h-7 w-7 place-items-center text-lg">−</button>
                          <span className="w-7 text-center text-sm font-semibold">{line.qty}</span>
                          <button onClick={() => setQty(line.id, line.qty + 1)} className="grid h-7 w-7 place-items-center text-lg">+</button>
                        </div>
                        <span className="text-sm font-bold" style={{ color: "var(--navy)" }}>{formatPrice(p.price * line.qty)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(line.id)} className="self-start text-[var(--text-faint)] hover:text-[var(--red)]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t p-5" style={{ borderColor: "var(--border)" }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-soft)" }}>Subtotal</span>
                <span className="text-xl font-extrabold" style={{ color: "var(--navy)" }}>{formatPrice(cartSubtotal)}</span>
              </div>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="btn btn-primary mb-2 w-full">Checkout</Link>
              <Link href="/cart" onClick={() => setCartOpen(false)} className="btn btn-ghost w-full">View full cart</Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
