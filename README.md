# NEMTEK Store ⚡

Advanced e-commerce storefront for **NEMTEK electric fencing** and **CENTURION gate automation** products (prices in GH₵).

Built with **Next.js 16 (App Router) + TypeScript + Tailwind v4**.

## Run it

```bash
cd nemtek-store
npm install      # first time only
npm run dev      # http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

## Features

- **80+ real products** across 12 categories (energizers, wire & cable, gate motors, access control, remotes, boards, power, lighting/alarms, gate contacts, signage, hardware).
- **Catalogue & search** — live search, category + brand filters, price slider, sorting.
- **Product pages** — gallery, rating, stock status, quantity selector, related products.
- **Cart** — slide-in drawer + full cart page, quantity controls, persistent (localStorage), free-delivery progress bar.
- **Wishlist** — save/remove with heart, dedicated page.
- **Accounts** — sign up / sign in (stored locally, password hashed) with an order-history dashboard.
- **Checkout** — contact + delivery form with validation, payment-method selection (Mobile Money / Card / Pay on delivery), and an order confirmation with order number.
- **Design** — custom NEMTEK navy / electric-blue theme, light + dark mode, responsive, toast notifications, SVG product illustrations (no external images needed).

> This is a demo storefront: no real payments are processed and all data lives in the browser.

## Structure

```
src/
  app/            routes: / , /shop , /product/[id] , /cart , /checkout , /account , /wishlist
  components/     Navbar, Footer, CartDrawer, ProductCard, ProductImage, StarRating, Toaster, ShopClient, ProductDetail, Logo
  lib/products.ts product data, types & helpers
  store/          StoreProvider — cart / wishlist / auth / orders / toasts (React Context + localStorage)
```
