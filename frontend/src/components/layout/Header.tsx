"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Início", href: "/#inicio" },
  { label: "Cardápio", href: "/menu" },
  { label: "Contactos", href: "/contactos" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { itemsCount } = useCart();
  const cartBtnRef = useRef<HTMLAnchorElement>(null);
  const prevCountRef = useRef(itemsCount);

  const isHomePage = pathname === "/";
  const useSolidStyle = !isHomePage || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bounce cart button when item is added
  useEffect(() => {
    if (itemsCount > prevCountRef.current && cartBtnRef.current) {
      gsap.fromTo(
        cartBtnRef.current,
        { scale: 1 },
        { scale: 1.28, yoyo: true, repeat: 1, duration: 0.14, ease: "power2.out" }
      );
    }
    prevCountRef.current = itemsCount;
  }, [itemsCount]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        // Always solid on mobile; transparent hero only on md+ when applicable
        "bg-card/95 backdrop-blur-md shadow-sm border-b",
        !useSolidStyle && "md:bg-transparent md:backdrop-blur-none md:shadow-none md:border-transparent"
      )}
    >
      <div className="mx-auto relative flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo-com-escrita.png"
            alt="Peixe da Chicala"
            className={cn(
              "h-15 w-auto transition-all",
              !useSolidStyle ? "md:brightness-0 md:invert" : "brightness-100"
            )}
            width={120}
            height={60}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="absolute left-0 right-0 mx-auto max-w-5xl flex items-center justify-center pointer-events-none">
          <nav className="hidden md:flex items-center gap-1 pointer-events-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-display font-semibold rounded-full transition-all flex items-center gap-1.5",
                  !useSolidStyle
                    ? "md:text-white/90 md:hover:text-white md:hover:bg-white/10 text-foreground hover:bg-muted"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link ref={cartBtnRef} href="/carrinho" className="hidden sm:inline-flex">
            <Button variant="primary" size="sm">
              Carrinho{itemsCount ? ` (${itemsCount})` : ""}
            </Button>
          </Link>

          <Link href="/acompanhar" className="hidden sm:inline-flex">
            <Button
              variant={useSolidStyle ? "outline" : "ghost"}
              size="sm"
              className={useSolidStyle ? undefined : "text-white hover:bg-white/10"}
            >
              Acompanhar
            </Button>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              useSolidStyle ? "hover:bg-muted" : "text-white hover:bg-white/10"
            )}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-card/95 backdrop-blur-md">
          <nav className="flex flex-col p-4 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-display font-bold rounded-xl transition-all flex items-center gap-3 text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/menu" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" className="w-full mt-2">Fazer Pedido</Button>
            </Link>
            <Link href="/carrinho" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full mt-2">
                Carrinho{itemsCount ? ` (${itemsCount})` : ""}
              </Button>
            </Link>
            <Link href="/acompanhar" onClick={() => setMobileOpen(false)}>
              <Button variant="ghost" className="w-full mt-2">Acompanhar Pedido</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
