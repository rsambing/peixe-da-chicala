"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, ShoppingBag, Package, Tag, Settings, LogOut, Menu, X, MessageSquare } from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/dashboard/produtos", label: "Produtos", icon: Package },
  { href: "/dashboard/categorias", label: "Categorias", icon: Tag },
  { href: "/dashboard/testemunhos", label: "Testemunhos", icon: MessageSquare },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isReady, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isReady && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isReady, router]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  if (!isReady) return null;
  if (!isAuthenticated) return null;

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function NavLinks() {
    return (
      <>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                ].join(" ")}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100/60 dark:border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">

      {/* ── Desktop sidebar (md+) ── */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white dark:bg-gray-900 flex-col">
        <div className="px-5 py-4 border-b border-gray-100/60 dark:border-white/5 flex items-center gap-3">
          <Image src="/images/logo.png" alt="Peixe da Chicala" width={36} height={36} className="rounded-lg object-contain" />
          <div>
            <p className="text-sm font-black text-gray-900 dark:text-white leading-tight">PDC Admin</p>
            <p className="text-xs text-gray-400">Painel de Gestão</p>
          </div>
        </div>
        <NavLinks />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-100/60 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src="/images/logo.png" alt="Peixe da Chicala" width={32} height={32} className="rounded-lg object-contain" />
                <p className="text-sm font-black text-gray-900 dark:text-white">PDC Admin</p>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks />
          </aside>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Menu className="size-5" />
          </button>
          <Image src="/images/logo.png" alt="Peixe da Chicala" width={28} height={28} className="rounded-md object-contain" />
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
          >
            <LogOut className="size-4" />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
