"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useCart } from "@/lib/cart-context";

export function FloatingCart() {
  const { itemsCount } = useCart();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const btnRef = useRef<HTMLAnchorElement>(null);
  const prevCountRef = useRef(itemsCount);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (itemsCount > prevCountRef.current && btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 1 },
        { scale: 1.3, yoyo: true, repeat: 1, duration: 0.15, ease: "power2.out" }
      );
    }
    prevCountRef.current = itemsCount;
  }, [itemsCount]);

  if (!mounted || itemsCount === 0 || pathname === "/carrinho") return null;

  return (
    <Link
      ref={btnRef}
      href="/carrinho"
      className="fixed bottom-6 right-6 z-50 size-16 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:bg-primary/90 transition-colors"
      aria-label={`Carrinho com ${itemsCount} item(s)`}
    >
      <ShoppingCart className="size-6" />
      <span className="absolute -top-1.5 -right-1.5 min-w-6 h-6 px-1 rounded-full bg-white text-primary text-xs font-display font-black flex items-center justify-center border-2 border-primary leading-none">
        {itemsCount > 99 ? "99+" : itemsCount}
      </span>
    </Link>
  );
}
