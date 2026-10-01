"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore, type Order } from "@/store/StoreProvider";
import { getProduct, formatPrice } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function CheckoutPage() {
  const { cart, cartSubtotal, user, placeOrder, ready, toast } = useStore();
  const router = useRouter();
  const [placed, setPlaced] = useState<Order | null>(null);

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", payment: "mobile-money" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [user]);

  if (!ready) return <div className="container-x py-20 text-center" style={{ color: "var(--text-soft)" }}>Loading…</div>;

  const shipping = cartSubtotal >= 2000 ? 0 : 80;
  const total = cartSubtotal + shipping;

  /* ---- confirmation screen ---- */
  if (placed) {
    return (
      <div className="container-x py-16">
        <div className="card mx-auto max-w-2xl p-8 text-center sm:p-12">
          <div className="pop mx-auto grid h-20 w-20 place-items-center rounded-full text-white" style={{ background: "var(--green)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h1 className="mt-5 text-3xl font-black">Order confirmed!</h1>
          <p className="mt-2" style={{ color: "var(--text-soft)" }}>Thank you, {placed.customer.name.split(" ")[0]}. We&apos;ve emailed a confirmation to {placed.customer.email}.</p>
          <div className="my-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-sm font-bold" style={{ background: "var(--surface-2)" }}>
            Order #{placed.id}
          </div>

          <div className="mx-auto max-w-md space-y-3 text-left">
            {placed.items.map((it) => (
              <div key={it.id} className="flex items-center justify-between text-sm">
                <span className="line-clamp-1 pr-3">{it.qty}× {it.name}</span>
                <span className="font-semibold whitespace-nowrap">{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="border-t pt-3" style={{ borderColor: "var(--border)" }} />
            <div className="flex justify-between text-sm"><span style={{ color: "var(--text-soft)" }}>Shipping</span><span>{placed.shipping === 0 ? "Free" : formatPrice(placed.shipping)}</span></div>
            <div className="flex justify-between text-lg font-black"><span>Total</span><span style={{ color: "var(--navy)" }}>{formatPrice(placed.total)}</span></div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
            <Link href="/account" className="btn btn-outline">View orders</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0)
    return (
      <div className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-black">Nothing to check out</h1>
        <p style={{ color: "var(--text-soft)" }}>Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary">Browse products</Link>
      </div>
    );

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^[0-9+\s-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast("Please fix the highlighted fields", "error");
      return;
    }
    const items = cart.map((l) => {
      const p = getProduct(l.id)!;
      return { id: p.id, name: p.name, price: p.price, qty: l.qty };
    });
    const order = placeOrder({
      items,
      subtotal: cartSubtotal,
      shipping,
      total,
      customer: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city },
      payment: form.payment,
    });
    setPlaced(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const field = (k: keyof typeof form, label: string, placeholder: string, type = "text") => (
    <div>
      <label className="label">{label}</label>
      <input className="input" type={type} value={form[k]} placeholder={placeholder} onChange={(e) => set(k, e.target.value)} style={errors[k] ? { borderColor: "var(--red)" } : undefined} />
      {errors[k] && <span className="mt-1 block text-xs" style={{ color: "var(--red)" }}>{errors[k]}</span>}
    </div>
  );

  return (
    <div className="container-x py-10">
      <h1 className="mb-6 text-3xl font-black">Checkout</h1>
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><span className="grid h-6 w-6 place-items-center rounded-full text-xs text-white" style={{ background: "var(--blue)" }}>1</span> Contact &amp; delivery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {field("name", "Full name", "Kwame Mensah")}
              {field("email", "Email", "you@example.com", "email")}
              {field("phone", "Phone", "+233 ...", "tel")}
              {field("city", "City / Town", "Accra")}
              <div className="sm:col-span-2">{field("address", "Delivery address", "House no, street, area")}</div>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><span className="grid h-6 w-6 place-items-center rounded-full text-xs text-white" style={{ background: "var(--blue)" }}>2</span> Payment method</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["mobile-money", "📱 Mobile Money", "MTN · Telecel · AT"],
                ["card", "💳 Card", "Visa / Mastercard"],
                ["cod", "🚚 Pay on delivery", "Cash on arrival"],
              ].map(([val, title, sub]) => (
                <label key={val} className="flex cursor-pointer flex-col gap-1 rounded-xl border p-4 transition" style={{ borderColor: form.payment === val ? "var(--blue)" : "var(--border)", background: form.payment === val ? "rgba(30,82,230,.06)" : "transparent" }}>
                  <input type="radio" name="payment" className="sr-only" checked={form.payment === val} onChange={() => set("payment", val)} />
                  <span className="font-semibold">{title}</span>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>{sub}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--text-faint)" }}>🔒 This is a demo store — no real payment is processed and no card details are collected.</p>
          </section>
        </div>

        {/* summary */}
        <aside className="card h-fit p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 text-lg font-bold">Your order</h2>
          <div className="max-h-72 space-y-3 overflow-y-auto">
            {cart.map((l) => {
              const p = getProduct(l.id);
              if (!p) return null;
              return (
                <div key={l.id} className="flex items-center gap-3">
                  <div className="relative">
                    <ProductImage product={p} className="h-14 w-14 rounded-lg" />
                    <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: "var(--navy)" }}>{l.qty}</span>
                  </div>
                  <div className="min-w-0 flex-1"><div className="line-clamp-1 text-sm font-semibold">{p.name}</div><div className="text-xs" style={{ color: "var(--text-faint)" }}>{formatPrice(p.price)}</div></div>
                  <div className="text-sm font-bold">{formatPrice(p.price * l.qty)}</div>
                </div>
              );
            })}
          </div>
          <div className="my-4 border-t" style={{ borderColor: "var(--border)" }} />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span style={{ color: "var(--text-soft)" }}>Subtotal</span><span className="font-semibold">{formatPrice(cartSubtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-soft)" }}>Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between pt-2 text-lg"><span className="font-bold">Total</span><span className="font-black" style={{ color: "var(--navy)" }}>{formatPrice(total)}</span></div>
          </div>
          <button type="submit" className="btn btn-primary mt-5 w-full">Place order · {formatPrice(total)}</button>
          <Link href="/cart" className="btn btn-ghost mt-2 w-full">Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
