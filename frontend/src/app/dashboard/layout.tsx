"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, Button } from "@/components/ui";
import { currentUser } from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
  FiHome,
  FiGrid,
  FiCreditCard,
  FiUser,
  FiShield,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlusCircle,
  FiBriefcase,
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Visão Geral", href: "/dashboard", icon: FiHome },
  { label: "Minhas Campanhas", href: "/dashboard/campanhas", icon: FiGrid },
  { label: "Organizações", href: "/dashboard/organizacoes", icon: FiBriefcase },
  { label: "Carteira", href: "/dashboard/carteira", icon: FiCreditCard },
  { label: "Perfil", href: "/dashboard/perfil", icon: FiUser },
  { label: "Verificação KYC", href: "/dashboard/kyc", icon: FiShield },
  { label: "Definições", href: "/dashboard/definicoes", icon: FiSettings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Levanta Angola" className="size-8 rounded-lg" width={32} height={32} />
            <Image src="/images/logo-com-escrita.png" alt="Levanta Angola" className="h-6 w-auto" width={120} height={24} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-muted"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar
              src={currentUser.avatarUrl}
              fallback={currentUser.fullName}
              size="md"
              verified={currentUser.isVerified}
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {currentUser.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4">
            <Link href="/campanhas/criar">
              <Button variant="primary" size="sm" className="w-full">
                <FiPlusCircle className="size-4 mr-2" />
                Nova Campanha
              </Button>
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-gray-800">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors">
            <FiLogOut className="size-4" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            <FiMenu className="size-5" />
          </button>
          <div className="flex-1" />
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Voltar ao site
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
