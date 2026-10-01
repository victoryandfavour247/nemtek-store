"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/store/StoreProvider";
import { categoryList } from "@/lib/products";
import Logo from "./Logo";

export default function Navbar() {
  const { cartCount, wishlist, user, setCartOpen } = useStore();
  const router = useRouter();
  const [q, setQ] = useState("");

  // Store is light-only — clear any stale dark preference from earlier sessions.
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    try { localStorage.setItem("nemtek.theme", "light"); } catch {}
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-40">
      {/* top strip */}
      <div style={{ background: "var(--navy)" }} className="text-white">
        <div className="container-x flex h-8 items-center justify-between text-[11.5px] font-medium">
          <span className="flex items-center gap-1.5">⚡ Genuine NEMTEK &amp; CENTURION — available in stock</span>
          <span className="hidden items-center gap-4 sm:flex">
            <span>🚚 Nationwide delivery</span>
            <span>📞 +233 00 000 0000</span>
          </span>
        </div>
      </div>

      {/* main orange header */}
      <div style={{ background: "var(--orange)" }}>
        <div className="container-x flex h-16 items-center gap-3">
          <Link href="/" className="shrink-0"><Logo light /></Link>

          <form onSubmit={submitSearch} className="relative mx-auto hidden w-full max-w-2xl md:flex">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands and categories"
              className="w-full rounded-l-md border-0 bg-white px-4 py-2.5 text-[15px] text-[#282828] outline-none"
            />
            <button className="flex items-center gap-1.5 rounded-r-md px-5 text-sm font-bold text-white" style={{ background: "var(--navy)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
              Search
            </button>
          </form>

          <nav className="ml-auto flex items-center gap-1 text-white">
            <Link href="/account" className="flex items-center gap-1.5 rounded px-2.5 py-2 text-sm font-semibold hover:bg-white/15">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></svg>
              <span className="hidden lg:inline">{user ? user.name.split(" ")[0] : "Account"}</span>
            </Link>
            <Link href="/wishlist" className="relative flex items-center gap-1.5 rounded px-2.5 py-2 text-sm font-semibold hover:bg-white/15">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z"/></svg>
              <span className="hidden lg:inline">Saved</span>
              {wishlist.length > 0 && <span className="absolute right-1 top-0.5 grid place-items-center rounded-full px-1 text-[10px] font-bold text-[var(--orange)]" style={{ background: "#fff", height: 16, minWidth: 16 }}>{wishlist.length}</span>}
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-1.5 rounded px-2.5 py-2 text-sm font-semibold hover:bg-white/15">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1.6"/><circle cx="18" cy="21" r="1.6"/><path d="M2 2h3l2.6 13.2a1.8 1.8 0 001.8 1.4h8.8a1.8 1.8 0 001.8-1.4L23 7H6"/></svg>
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && <span className="pop absolute right-0.5 top-0.5 grid place-items-center rounded-full px-1 text-[10px] font-bold text-white" style={{ background: "var(--navy)", height: 17, minWidth: 17 }}>{cartCount}</span>}
            </button>
          </nav>
        </div>

        {/* mobile search */}
        <form onSubmit={submitSearch} className="container-x flex pb-3 md:hidden">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="w-full rounded-l-md border-0 bg-white px-3 py-2.5 text-[15px] text-[#282828] outline-none" />
          <button className="rounded-r-md px-4 text-sm font-bold text-white" style={{ background: "var(--navy)" }}>Go</button>
        </form>
      </div>

      {/* category strip */}
      <div className="hidden border-b md:block" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
        <div className="container-x flex h-10 items-center gap-5 overflow-x-auto text-[13px] font-semibold">
          <Link href="/shop" className="shrink-0 text-[var(--orange)]">All Products</Link>
          {categoryList.slice(0, 9).map((c) => (
            <Link key={c.key} href={`/shop?category=${c.key}`} className="shrink-0 text-[var(--text-soft)] hover:text-[var(--orange)]">{c.label}</Link>
          ))}
        </div>
      </div>
    </header>
  );
}
