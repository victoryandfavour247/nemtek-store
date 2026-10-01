"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/store/StoreProvider";
import { formatPrice } from "@/lib/products";

export default function AccountPage() {
  const { user, orders, ready, signIn, signUp, signOut } = useStore();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (!ready) return <div className="container-x py-20 text-center" style={{ color: "var(--text-soft)" }}>Loading…</div>;

  /* ---------------- signed-in dashboard ---------------- */
  if (user) {
    return (
      <div className="container-x py-10">
        <div className="card mb-8 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full text-xl font-black text-white" style={{ background: "linear-gradient(135deg,var(--blue),var(--navy))" }}>
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="text-2xl font-black">Hi, {user.name.split(" ")[0]} 👋</h1>
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>{user.email}</p>
            </div>
          </div>
          <button onClick={signOut} className="btn btn-outline">Sign out</button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-4">
          {[["Orders", orders.length], ["Spent", formatPrice(orders.reduce((s, o) => s + o.total, 0))], ["Items", orders.reduce((s, o) => s + o.items.reduce((n, i) => n + i.qty, 0), 0)]].map(([l, v]) => (
            <div key={l} className="card p-5 text-center">
              <div className="text-2xl font-black" style={{ color: "var(--navy)" }}>{v}</div>
              <div className="text-xs" style={{ color: "var(--text-faint)" }}>{l}</div>
            </div>
          ))}
        </div>

        <h2 className="mb-4 mt-8 text-xl font-bold">Order history</h2>
        {orders.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 p-12 text-center">
            <span className="text-3xl">📦</span>
            <p className="font-semibold">No orders yet</p>
            <Link href="/shop" className="btn btn-primary">Start shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <span className="font-mono font-bold">#{o.id}</span>
                    <span className="ml-3 text-sm" style={{ color: "var(--text-faint)" }}>{new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <span className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: "var(--green)" }}>{o.status}</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span style={{ color: "var(--text-soft)" }}>{it.qty}× {it.name}</span>
                      <span className="font-semibold">{formatPrice(it.price * it.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between border-t pt-3 text-sm font-bold" style={{ borderColor: "var(--border)" }}>
                  <span>Total</span><span style={{ color: "var(--navy)" }}>{formatPrice(o.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------------- auth form ---------------- */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = mode === "signin"
      ? signIn(form.email, form.password)
      : signUp(form.name, form.email, form.password);
    if (!res.ok) setError(res.error ?? "Something went wrong");
  };

  return (
    <div className="container-x grid gap-10 py-14 lg:grid-cols-2">
      <div className="hidden flex-col justify-center lg:flex">
        <h1 className="text-4xl font-black leading-tight">Your account, <span style={{ color: "var(--blue)" }}>your way.</span></h1>
        <p className="mt-4 max-w-md text-lg" style={{ color: "var(--text-soft)" }}>Create an account to track orders, save your wishlist and check out faster.</p>
        <ul className="mt-6 space-y-3">
          {["Faster checkout with saved details", "Full order history & tracking", "Save products to your wishlist", "Early access to deals"].map((f) => (
            <li key={f} className="flex items-center gap-3" style={{ color: "var(--text-soft)" }}>
              <span className="grid h-6 w-6 place-items-center rounded-full text-white" style={{ background: "var(--green)" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
              </span>{f}
            </li>
          ))}
        </ul>
      </div>

      <div className="card mx-auto w-full max-w-md p-8">
        <div className="mb-6 flex rounded-xl p-1" style={{ background: "var(--surface-2)" }}>
          {(["signin", "signup"] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} className="flex-1 rounded-lg py-2.5 text-sm font-bold transition" style={{ background: mode === m ? "var(--surface)" : "transparent", boxShadow: mode === m ? "var(--shadow-sm)" : "none", color: mode === m ? "var(--navy)" : "var(--text-faint)" }}>
              {m === "signin" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div><label className="label">Full name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kwame Mensah" required /></div>
          )}
          <div><label className="label">Email</label><input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required /></div>
          <div><label className="label">Password</label><input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" minLength={4} required /></div>

          {error && <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "rgba(226,59,59,.1)", color: "var(--red)" }}>{error}</div>}

          <button type="submit" className="btn btn-primary w-full">{mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>

        <p className="mt-4 text-center text-xs" style={{ color: "var(--text-faint)" }}>
          Demo accounts are stored only in your browser. Don&apos;t reuse a real password.
        </p>
      </div>
    </div>
  );
}
