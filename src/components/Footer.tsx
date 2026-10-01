import Link from "next/link";
import Logo from "./Logo";
import { categoryList } from "@/lib/products";

export default function Footer() {
  return (
    <footer className="mt-20 border-t" style={{ background: "var(--bg-elev)", borderColor: "var(--border)" }}>
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm" style={{ color: "var(--text-soft)" }}>
            Ghana&apos;s home for genuine NEMTEK electric fencing and CENTURION gate automation. Trade pricing, nationwide delivery, expert support.
          </p>
          <div className="mt-4 flex gap-2">
            {["facebook", "instagram", "whatsapp"].map((s) => (
              <span key={s} className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "var(--surface-2)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="var(--text-soft)"><circle cx="12" cy="12" r="10" /></svg>
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>Shop</h4>
          <ul className="space-y-2 text-sm">
            {categoryList.slice(0, 6).map((c) => (
              <li key={c.key}>
                <Link href={`/shop?category=${c.key}`} className="hover:text-[var(--blue)]" style={{ color: "var(--text-soft)" }}>{c.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>Company</h4>
          <ul className="space-y-2 text-sm">
            {["About us", "Installation guides", "Warranty", "Contact", "Track order"].map((l) => (
              <li key={l}><Link href="/shop" className="hover:text-[var(--blue)]" style={{ color: "var(--text-soft)" }}>{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: "var(--text-faint)" }}>Get updates</h4>
          <p className="mb-3 text-sm" style={{ color: "var(--text-soft)" }}>Deals and new stock, straight to your inbox.</p>
          <div className="flex gap-2">
            <input className="input" placeholder="Email address" style={{ background: "var(--surface-2)" }} />
            <button className="btn btn-primary">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t py-5" style={{ borderColor: "var(--border)" }}>
        <div className="container-x flex flex-col items-center justify-between gap-2 text-xs sm:flex-row" style={{ color: "var(--text-faint)" }}>
          <span>© {new Date().getFullYear()} NEMTEK Store Ghana. </span>
          <span className="flex gap-4">
            <Link href="/shop">Privacy</Link><Link href="/shop">Terms</Link><Link href="/shop">Returns</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
