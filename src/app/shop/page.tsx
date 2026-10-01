import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-x py-20 text-center" style={{ color: "var(--text-soft)" }}>Loading products…</div>}>
      <ShopClient />
    </Suspense>
  );
}
