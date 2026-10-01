"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { PRODUCTS, categoryList, type CategoryKey, type Brand } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating" | "name";

export default function ShopClient() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<CategoryKey | "all">((params.get("category") as CategoryKey) ?? "all");
  const [brand, setBrand] = useState<Brand | "all">((params.get("brand") as Brand) ?? "all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [maxPrice, setMaxPrice] = useState<number>(13000);
  const [mobileFilters, setMobileFilters] = useState(false);

  // keep in sync when nav changes (e.g. from navbar search)
  useEffect(() => {
    setQ(params.get("q") ?? "");
    setCategory((params.get("category") as CategoryKey) ?? "all");
    setBrand((params.get("brand") as Brand) ?? "all");
  }, [params]);

  const updateUrl = (next: Record<string, string | undefined>) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === "all") sp.delete(k);
      else sp.set(k, v);
    });
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  const results = useMemo(() => {
    let list = PRODUCTS.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (brand !== "all" && p.brand !== brand) return false;
      if (p.price > maxPrice) return false;
      if (q.trim()) {
        const t = q.toLowerCase();
        if (!(p.name.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t)))
          return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "name": list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [q, category, brand, sort, maxPrice]);

  const title =
    category !== "all" ? categoryList.find((c) => c.key === category)?.label :
    brand !== "all" ? brand : "All products";

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>Brand</h4>
        <div className="flex flex-wrap gap-2">
          {(["all", "NEMTEK", "CENTURION"] as const).map((b) => (
            <button key={b} className={`chip ${brand === b ? "chip-active" : ""}`} onClick={() => { setBrand(b); updateUrl({ brand: b }); }}>
              {b === "all" ? "All brands" : b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>Category</h4>
        <div className="flex flex-col gap-1">
          <button className={`chip justify-start ${category === "all" ? "chip-active" : ""}`} onClick={() => { setCategory("all"); updateUrl({ category: "all" }); }}>
            All categories
          </button>
          {categoryList.map((c) => (
            <button key={c.key} className={`chip justify-between ${category === c.key ? "chip-active" : ""}`} onClick={() => { setCategory(c.key); updateUrl({ category: c.key }); }}>
              <span>{c.label}</span><span className="opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>Max price</h4>
        <input type="range" min={0} max={13000} step={50} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--blue)]" />
        <div className="mt-1 text-sm font-semibold">Up to GH₵ {maxPrice.toLocaleString()}</div>
      </div>

      <button
        className="btn btn-ghost w-full"
        onClick={() => { setQ(""); setCategory("all"); setBrand("all"); setMaxPrice(13000); setSort("featured"); router.replace(pathname, { scroll: false }); }}
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <div className="container-x py-8">
      <nav className="mb-4 text-sm" style={{ color: "var(--text-faint)" }}>Home / <span style={{ color: "var(--text)" }}>Shop</span></nav>
      <h1 className="text-3xl font-black">{title}</h1>
      <p className="mt-1 text-sm" style={{ color: "var(--text-soft)" }}>{results.length} products</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* sidebar — desktop */}
        <aside className="hidden lg:block">
          <div className="card sticky top-28 p-5">{FilterPanel}</div>
        </aside>

        <div>
          {/* toolbar */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
              <input value={q} onChange={(e) => { setQ(e.target.value); updateUrl({ q: e.target.value }); }} placeholder="Search products…" className="input" style={{ paddingLeft: 40 }} />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="input" style={{ width: "auto" }}>
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
              <option value="name">Name A–Z</option>
            </select>
            <button className="btn btn-outline lg:hidden" onClick={() => setMobileFilters((v) => !v)}>Filters</button>
          </div>

          {mobileFilters && <div className="card mb-5 p-5 lg:hidden">{FilterPanel}</div>}

          {results.length === 0 ? (
            <div className="card flex flex-col items-center gap-3 p-16 text-center">
              <span className="text-4xl">🔍</span>
              <p className="font-bold">No products match your filters</p>
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>Try widening your price range or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {results.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
