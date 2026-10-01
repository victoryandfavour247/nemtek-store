import Link from "next/link";
import { PRODUCTS, categoryList } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";

function Grid({ items }: { items: typeof PRODUCTS }) {
  return (
    <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export default function Home() {
  const flash = PRODUCTS.filter((p) => ["ct-d5evo", "nt-merlin4", "ct-remote4", "nt-warnsign", "ct-d6", "nt-ss-1mm", "ct-photon", "nt-stealth", "ct-d10", "nt-siren15", "ct-gspeak", "nt-strobe"].includes(p.id));
  const gateMotors = PRODUCTS.filter((p) => p.category === "gate-motors").slice(0, 12);
  const nemtek = PRODUCTS.filter((p) => p.brand === "NEMTEK").slice(0, 12);
  const topRated = [...PRODUCTS].sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="container-x py-4">
      {/* ===================== HERO ROW ===================== */}
      <div className="grid gap-3 lg:grid-cols-[220px_1fr_240px]">
        {/* category sidebar */}
        <aside className="hidden overflow-hidden rounded-[var(--radius)] border bg-[var(--surface)] lg:block" style={{ borderColor: "var(--border)" }}>
          <ul className="py-1 text-[13.5px]">
            {categoryList.map((c) => (
              <li key={c.key}>
                <Link href={`/shop?category=${c.key}`} className="flex items-center justify-between px-3.5 py-[9px] hover:bg-[var(--orange-50)] hover:text-[var(--orange)]">
                  <span>{c.label}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-faint)" }}><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* hero banner */}
        <Link href="/shop?category=gate-motors" className="relative flex min-h-[260px] flex-col justify-center overflow-hidden rounded-[var(--radius)] p-8 text-white" style={{ background: "linear-gradient(115deg,#1f2937,#374151)" }}>
          <div className="absolute inset-0 opacity-20">
            <svg className="h-full w-full" preserveAspectRatio="none">
              <defs><pattern id="m" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect x="0" y="8" width="14" height="4" rx="2" fill="#f68b1e"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#m)"/>
            </svg>
          </div>
          <div className="relative max-w-md">
            <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: "var(--orange)" }}>MEGA STOCK DEALS</span>
            <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">Secure your perimeter.<br/>Automate your gate.</h1>
            <p className="mt-2 text-sm text-white/80">Genuine NEMTEK fencing &amp; CENTURION motors — up to 30% off.</p>
            <span className="btn btn-primary mt-5 inline-flex">Shop deals now</span>
          </div>
          <div className="absolute right-6 top-1/2 hidden h-40 w-40 -translate-y-1/2 overflow-hidden rounded-xl bg-white sm:block">
            <ProductImage product={PRODUCTS.find((p) => p.id === "ct-d5evo")!} className="h-full w-full" />
          </div>
        </Link>

        {/* right promo stack */}
        <div className="hidden flex-col gap-3 lg:flex">
          <div className="flex-1 rounded-[var(--radius)] border bg-[var(--surface)] p-3" style={{ borderColor: "var(--border)" }}>
            <div className="text-[13px] font-bold">Free delivery</div>
            <div className="text-[11px] text-[var(--text-faint)]">On orders over GH₵2,000</div>
            <div className="mt-2 h-16 overflow-hidden rounded"><ProductImage product={PRODUCTS.find((p) => p.id === "ct-remote4")!} className="h-full w-full" /></div>
          </div>
          <div className="flex-1 rounded-[var(--radius)] border bg-[var(--surface)] p-3" style={{ borderColor: "var(--border)" }}>
            <div className="text-[13px] font-bold">Trade accounts</div>
            <div className="text-[11px] text-[var(--text-faint)]">Bulk pricing available</div>
            <div className="mt-2 h-16 overflow-hidden rounded"><ProductImage product={PRODUCTS.find((p) => p.id === "nt-merlin4")!} className="h-full w-full" /></div>
          </div>
        </div>
      </div>

      {/* ===================== TRUST BAR ===================== */}
      <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius)] border bg-[var(--border)] md:grid-cols-4" style={{ borderColor: "var(--border)" }}>
        {[["🚚", "Nationwide delivery"], ["✅", "100% genuine stock"], ["🛠️", "Expert support"], ["🔒", "Secure checkout"]].map(([e, t]) => (
          <div key={t} className="flex items-center gap-2.5 bg-[var(--surface)] px-4 py-3">
            <span className="text-xl">{e}</span><span className="text-[13px] font-semibold">{t}</span>
          </div>
        ))}
      </div>

      {/* ===================== FLASH SALES ===================== */}
      <section className="section mt-3">
        <div className="section-head" style={{ background: "var(--orange)", color: "#fff", borderColor: "transparent" }}>
          <h2 className="flex items-center gap-2">⚡ Flash Sales <span className="text-xs font-semibold opacity-90">Today&apos;s best prices</span></h2>
          <Link href="/shop" className="text-sm font-semibold hover:underline">See all ›</Link>
        </div>
        <Grid items={flash} />
      </section>

      {/* ===================== CATEGORY TILES ===================== */}
      <section className="section mt-3">
        <div className="section-head"><h2>Shop by category</h2></div>
        <div className="grid grid-cols-3 gap-px bg-[var(--border)] sm:grid-cols-4 md:grid-cols-6">
          {categoryList.map((c) => {
            const sample = PRODUCTS.find((p) => p.category === c.key)!;
            return (
              <Link key={c.key} href={`/shop?category=${c.key}`} className="flex flex-col items-center gap-1.5 bg-[var(--surface)] p-3 text-center hover:bg-[var(--orange-50)]">
                <ProductImage product={sample} className="h-16 w-16" />
                <span className="line-clamp-2 text-[12px] font-medium leading-tight">{c.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===================== GATE MOTORS ===================== */}
      <section className="section mt-3">
        <div className="section-head"><h2>CENTURION Gate Motors</h2><Link href="/shop?brand=CENTURION" className="text-sm font-semibold text-[var(--orange)]">See all ›</Link></div>
        <Grid items={gateMotors} />
      </section>

      {/* ===================== NEMTEK ===================== */}
      <section className="section mt-3">
        <div className="section-head"><h2>NEMTEK Electric Fencing</h2><Link href="/shop?brand=NEMTEK" className="text-sm font-semibold text-[var(--orange)]">See all ›</Link></div>
        <Grid items={nemtek} />
      </section>

      {/* ===================== TOP RATED ===================== */}
      <section className="section mt-3">
        <div className="section-head"><h2>⭐ Top rated</h2><Link href="/shop" className="text-sm font-semibold text-[var(--orange)]">See all ›</Link></div>
        <Grid items={topRated} />
      </section>
    </div>
  );
}
