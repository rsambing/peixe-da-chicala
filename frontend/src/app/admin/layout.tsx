"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  FiHome,
  FiFlag,
  FiShield,
  FiUsers,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiX,
  FiActivity,
} from "react-icons/fi";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: FiHome },
  { label: "Campanhas", href: "/admin/campanhas", icon: FiFlag },
  { label: "Verificação KYC", href: "/admin/kyc", icon: FiShield },
  { label: "Utilizadores", href: "/admin/utilizadores", icon: FiUsers },
  { label: "Financeiro", href: "/admin/financeiro", icon: FiDollarSign },
  { label: "Logs", href: "/admin/logs", icon: FiActivity },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — dark admin theme */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-60 bg-gray-900 border-r border-gray-800 z-50 transition-transform duration-300 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Levanta Angola" width={32} height={32} className="size-8 rounded-lg" />
            <div>
              <span className="font-bold text-white text-sm">Admin</span>
              <span className="text-gray-400 text-xs ml-1">Panel</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            <FiX className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-600/20 text-red-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-800 space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-400 hover:text-gray-200">
              ← Painel do Utilizador
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-400 hover:text-gray-200">
              <FiLogOut className="size-4 mr-2" /> Sair
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
          >
            <FiMenu className="size-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">
              Ambiente de Administração
            </span>
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </header>

        {/* Content */}
        <main className="p-6 text-gray-100">{children}</main>
      </div>
    </div>
  );
}
