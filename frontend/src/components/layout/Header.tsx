"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, Avatar, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { currentUser, mockOrganizations } from "@/lib/mock";
import { FiArrowLeft } from "react-icons/fi";

const NAV_LINKS = [
  { label: "Início", href: "/" },
  { label: "Explorar", href: "/explorar" },
  { label: "Como funciona", href: "/como-funciona" },
  { label: "Categorias", href: "/categorias" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isLoggedIn, activeProfile, switchProfile, logout } = useAuth();
  const pathname = usePathname();

  /* On non-hero pages, always use solid style */
  const isHomePage = pathname === "/";
  const useSolidStyle = !isHomePage || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const currentOrg = mockOrganizations[0]; // For demo, pick first org

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        useSolidStyle
          ? "bg-card/95 backdrop-blur-md shadow-sm border-b"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto relative flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/images/logo-com-escrita.png"
            alt="Levanta Angola"
            className={cn(
              "h-15 w-auto transition-all",
              useSolidStyle ? "brightness-100" : "brightness-0 invert"
            )}
            width={120}
            height={60}
          />
        </Link>

        {/* Desktop Nav (centered to match Hero width) */}
        <div className="absolute left-0 right-0 mx-auto max-w-5xl flex items-center justify-center pointer-events-none">
          <nav className="hidden md:flex items-center gap-1 pointer-events-auto">
            {NAV_LINKS.map((link) => {
              const isHome = link.href === "/";
              if (isHome && isHomePage) return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-display font-semibold rounded-full transition-all flex items-center gap-1.5",
                    isHome 
                      ? "bg-primary/5 text-primary hover:bg-primary/10 mr-4 shadow-xs" 
                      : (useSolidStyle
                        ? "text-foreground hover:bg-muted"
                        : "text-white/90 hover:text-white hover:bg-white/10")
                  )}
                >
                  {isHome && <FiArrowLeft className="size-3.5" />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/campanhas/criar">
            <Button
              variant={useSolidStyle ? "primary" : "accent"}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Criar Campanha
            </Button>
          </Link>

          {!isLoggedIn && (
            <div className={cn(
              "hidden sm:block w-px h-6 mx-1",
              useSolidStyle ? "bg-border" : "bg-white/20"
            )} />
          )}

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 inline-flex items-center justify-center">
                  <Avatar
                    src={currentUser.avatarUrl}
                    fallback={currentUser.fullName}
                    size="sm"
                    verified={currentUser.isVerified}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {activeProfile === "org" ? currentOrg.name : currentUser.fullName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activeProfile === "org" ? "Perfil de Organização" : currentUser.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {/* Profile Switcher Section */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => switchProfile("user")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                      activeProfile === "user" 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <Avatar src={currentUser.avatarUrl} size="xs" />
                    <span>Pessoal</span>
                    {activeProfile === "user" && <div className="ml-auto size-1.5 rounded-full bg-primary" />}
                  </button>
                  <button
                    onClick={() => switchProfile("org")}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                      activeProfile === "org" 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <Avatar src={currentOrg.logoUrl} size="xs" />
                    <span className="truncate max-w-30">{currentOrg.name}</span>
                    {activeProfile === "org" && <div className="ml-auto size-1.5 rounded-full bg-primary" />}
                  </button>
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="w-full">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/campanhas" className="w-full">Minhas Campanhas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/carteira" className="w-full">Carteira</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/perfil" className="w-full">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={logout}>Terminar Sessão</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/entrar">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    useSolidStyle ? "" : "text-white hover:bg-white/10"
                  )}
                >
                  Entrar
                </Button>
              </Link>
              <Link href="/registar">
                <Button
                  variant={useSolidStyle ? "outline" : "secondary"}
                  size="sm"
                >
                  Criar Conta
                </Button>
              </Link>
            </>
          )}

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
            {NAV_LINKS.map((link) => {
              const isHome = link.href === "/";
              if (isHome && isHomePage) return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-display font-bold rounded-xl transition-all flex items-center gap-3",
                    isHome 
                      ? "bg-primary/10 text-primary mb-2 border border-primary/20" 
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {isHome && <FiArrowLeft className="size-4" />}
                  {link.label}
                </Link>
              );
            })}
            <Link href="/campanhas/criar" onClick={() => setMobileOpen(false)}>
              <Button variant="primary" className="w-full mt-2">
                Criar Campanha
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
