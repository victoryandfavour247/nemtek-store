"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { PRODUCTS, getProduct, type Product } from "@/lib/products";

/* ----------------------------- types ----------------------------- */
export interface CartLine {
  id: string;
  qty: number;
}
export interface User {
  name: string;
  email: string;
}
export interface Order {
  id: string;
  date: string;
  items: { id: string; name: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: { name: string; email: string; phone: string; address: string; city: string };
  payment: string;
  status: string;
}
export interface Toast {
  id: number;
  msg: string;
  type: "success" | "error" | "info";
}

interface StoreCtx {
  ready: boolean;
  cart: CartLine[];
  wishlist: string[];
  user: User | null;
  orders: Order[];
  toasts: Toast[];
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  inWishlist: (id: string) => boolean;
  signUp: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  placeOrder: (o: Omit<Order, "id" | "date" | "status">) => Order;
  toast: (msg: string, type?: Toast["type"]) => void;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const LS = {
  cart: "nemtek.cart",
  wish: "nemtek.wishlist",
  user: "nemtek.user",
  users: "nemtek.users",
  orders: "nemtek.orders",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

/* tiny non-crypto hash so we never store a raw password */
function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  /* hydrate */
  useEffect(() => {
    setCart(read<CartLine[]>(LS.cart, []));
    setWishlist(read<string[]>(LS.wish, []));
    setUser(read<User | null>(LS.user, null));
    setOrders(read<Order[]>(LS.orders, []));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) write(LS.cart, cart); }, [cart, ready]);
  useEffect(() => { if (ready) write(LS.wish, wishlist); }, [wishlist, ready]);
  useEffect(() => { if (ready) write(LS.orders, orders); }, [orders, ready]);

  /* toasts */
  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);
  const toast = useCallback(
    (msg: string, type: Toast["type"] = "success") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, msg, type }]);
      setTimeout(() => dismissToast(id), 2600);
    },
    [dismissToast]
  );

  /* cart */
  const addToCart = useCallback(
    (id: string, qty = 1) => {
      const prod = getProduct(id);
      if (!prod) return;
      setCart((c) => {
        const line = c.find((l) => l.id === id);
        const next = Math.min((line?.qty ?? 0) + qty, prod.stock);
        if (line) return c.map((l) => (l.id === id ? { ...l, qty: next } : l));
        return [...c, { id, qty: Math.min(qty, prod.stock) }];
      });
      toast(`Added to cart — ${prod.name.slice(0, 28)}${prod.name.length > 28 ? "…" : ""}`);
      setCartOpen(true);
    },
    [toast]
  );
  const setQty = useCallback((id: string, qty: number) => {
    const prod = getProduct(id);
    const max = prod?.stock ?? 99;
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => l.id !== id)
        : c.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, max) } : l))
    );
  }, []);
  const removeFromCart = useCallback((id: string) => {
    setCart((c) => c.filter((l) => l.id !== id));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);

  /* wishlist */
  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((w) => {
        if (w.includes(id)) {
          toast("Removed from wishlist", "info");
          return w.filter((x) => x !== id);
        }
        toast("Saved to wishlist");
        return [...w, id];
      });
    },
    [toast]
  );
  const inWishlist = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  /* auth (local simulated) */
  const signUp = useCallback(
    (name: string, email: string, password: string) => {
      const users = read<Record<string, { name: string; pass: string }>>(LS.users, {});
      const key = email.toLowerCase().trim();
      if (users[key]) return { ok: false, error: "An account with this email already exists." };
      users[key] = { name: name.trim(), pass: hash(password) };
      write(LS.users, users);
      const u = { name: name.trim(), email: key };
      setUser(u);
      write(LS.user, u);
      toast(`Welcome, ${u.name.split(" ")[0]}!`);
      return { ok: true };
    },
    [toast]
  );
  const signIn = useCallback(
    (email: string, password: string) => {
      const users = read<Record<string, { name: string; pass: string }>>(LS.users, {});
      const key = email.toLowerCase().trim();
      const rec = users[key];
      if (!rec || rec.pass !== hash(password))
        return { ok: false, error: "Invalid email or password." };
      const u = { name: rec.name, email: key };
      setUser(u);
      write(LS.user, u);
      toast(`Welcome back, ${u.name.split(" ")[0]}!`);
      return { ok: true };
    },
    [toast]
  );
  const signOut = useCallback(() => {
    setUser(null);
    write(LS.user, null);
    toast("Signed out", "info");
  }, [toast]);

  /* orders */
  const placeOrder = useCallback(
    (o: Omit<Order, "id" | "date" | "status">) => {
      const order: Order = {
        ...o,
        id: "NT-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        date: new Date().toISOString(),
        status: "Confirmed",
      };
      setOrders((prev) => [order, ...prev]);
      setCart([]);
      return order;
    },
    []
  );

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartSubtotal = useMemo(
    () =>
      cart.reduce((sum, l) => {
        const p: Product | undefined = getProduct(l.id);
        return sum + (p ? p.price * l.qty : 0);
      }, 0),
    [cart]
  );

  const value: StoreCtx = {
    ready, cart, wishlist, user, orders, toasts, cartOpen, setCartOpen,
    cartCount, cartSubtotal,
    addToCart, setQty, removeFromCart, clearCart,
    toggleWishlist, inWishlist,
    signUp, signIn, signOut, placeOrder,
    toast, dismissToast,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { PRODUCTS };
