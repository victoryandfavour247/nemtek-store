import Image from "next/image";
import { imageFor, type Product } from "@/lib/products";

export default function ProductImage({
  product,
  className = "",
  contain = true,
}: {
  product: Product;
  className?: string;
  contain?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <Image
        src={imageFor(product)}
        alt={product.name}
        fill
        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 260px"
        className={contain ? "object-contain p-2.5" : "object-cover"}
      />
    </div>
  );
}
