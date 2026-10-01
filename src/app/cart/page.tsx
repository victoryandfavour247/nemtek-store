"use client";

import Link from "next/link";
import { useStore } from "@/store/StoreProvider";
import { getProduct, formatPrice } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { cart, cartSubtotal, setQty, removeFromCart, ready } = useStore();

  if (!ready) return <div className="container-x py-20 text-center" style={{ color: "var(--text-soft)" }}>Loading…</div>;

  const shipping = cartSubtotal >= 2000 || cartSubtotal === 0 ? 0 : 80;
  const total = cartSubtotal + shipping;

  if (cart.length === 0)
    return (
      <div className="container-x flex flex-col items-center gap-5 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full" style={{ background: "var(--surface-2)" }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="1.6"><circle cx="9" cy="21" r="1.6"/><circle cx="18" cy="21" r="1.6"/><path d="M2 2h3l2.6 13.2a1.8 1.8 0 001.8 1.4h8.8a1.8 1.8 0 001.8-1.4L23 7H6"/></svg>
        </div>
        <h1 className="text-2xl font-black">Your cart is empty</h1>
        <p style={{ color: "var(--text-soft)" }}>Browse our range of fencing and gate automation products.</p>
        <Link href="/shop" className="btn btn-primary">Start shopping</Link>
      </div>
    );

  return (
    <div className="container-x py-10">
      <h1 className="mb-6 text-3xl font-black">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.map((line) => {
            const p = getProduct(line.id);
            if (!p) return null;
            return (
              <div key={line.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <Link href={`/product/${p.id}`}><ProductImage product={p} className="h-28 w-full shrink-0 rounded-xl sm:w-28" /></Link>
                <div className="flex-1">
                  <span className="text-xs font-bold" style={{ color: "var(--blue)" }}>{p.brand}</span>
                  <Link href={`/product/${p.id}`}><h3 className="font-semibold hover:text-[var(--blue)]">{p.name}</h3></Link>
                  <div className="mt-1 text-sm" style={{ color: "var(--text-faint)" }}>{formatPrice(p.price)} each</div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center rounded-lg border" style={{ borderColor: "var(--border)" }}>
                    <button onClick={() => setQty(line.id, line.qty - 1)} className="grid h-9 w-9 place-items-center text-lg">−</button>
                    <span className="w-8 text-center font-semibold">{line.qty}</span>
                    <button onClick={() => setQty(line.id, line.qty + 1)} className="grid h-9 w-9 place-items-center text-lg">+</button>
                  </div>
                  <div className="w-24 text-right font-bold" style={{ color: "var(--navy)" }}>{formatPrice(p.price * line.qty)}</div>
                  <button onClick={() => removeFromCart(line.id)} className="text-[var(--text-faint)] hover:text-[var(--red)]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="card h-fit p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 text-lg font-bold">Order summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span style={{ color: "var(--text-soft)" }}>Subtotal</span><span className="font-semibold">{formatPrice(cartSubtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-soft)" }}>Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="my-3 border-t" style={{ borderColor: "var(--border)" }} />
            <div className="flex justify-between text-base"><span className="font-bold">Total</span><span className="text-xl font-black" style={{ color: "var(--navy)" }}>{formatPrice(total)}</span></div>
          </div>
          <Link href="/checkout" className="btn btn-primary mt-5 w-full">Proceed to checkout</Link>
          <Link href="/shop" className="btn btn-ghost mt-2 w-full">Continue shopping</Link>
        </aside>
      </div>
    </div>
  );
}
