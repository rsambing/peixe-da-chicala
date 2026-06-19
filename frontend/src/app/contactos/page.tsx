"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { api } from "@/lib/api";
import type { SiteSettings } from "@/lib/api-types";


function InfoCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string | null;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <div className="size-9 rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
        <Icon className="size-4 text-primary" />
      </div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-display font-bold text-gray-900 hover:text-primary transition-colors leading-snug"
        >
          {value}
        </a>
      ) : (
        <p className="text-sm font-display font-bold text-gray-900 leading-snug">{value}</p>
      )}
    </div>
  );
}

export default function ContactosPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {});
  }, []);
  const whatsappHref = settings?.contactWhatsapp
    ? `https://wa.me/${settings.contactWhatsapp}`
    : null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">

          {/* ── Header ──────────────────────────────────────── */}
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-display font-black text-gray-900 mb-3">
              Contactos
            </h1>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              Fale connosco para encomendas, reservas ou qualquer informação.
            </p>
          </div>

          {/* ── Info cards ──────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <InfoCard
              icon={Phone}
              label="Telefone"
              value={settings?.contactPhone ?? "A carregar…"}
              href={whatsappHref}
            />
            <InfoCard
              icon={Mail}
              label="Email"
              value={settings?.contactEmail ?? "A carregar…"}
              href={settings?.contactEmail ? `mailto:${settings.contactEmail}` : null}
            />
            <InfoCard
              icon={MapPin}
              label="Localização"
              value={settings?.contactAddress ?? "A carregar…"}
              href="https://maps.app.goo.gl/3kggRRD11o9PSQAD8"
            />
            <InfoCard
              icon={Clock}
              label="Horário"
              value={settings?.contactHours ?? "A carregar…"}
            />
          </div>

          {/* ── Map + Form ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Map */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {settings?.contactMapEmbedUrl ? (
                <iframe
                  title="Peixe da Chicala — Localização"
                  src={settings.contactMapEmbedUrl}
                  className="w-full h-[280px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="h-[280px] bg-gray-100 animate-pulse rounded-2xl" />
              )}
            </div>

            {/* Actions */}
            <div className="lg:col-span-2 flex flex-col gap-3 justify-center">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 font-display font-bold text-sm transition-colors"
                >
                  <MessageCircle className="size-5" />
                  Falar no WhatsApp
                </a>
              )}
              <Link
                href="/menu"
                className="flex items-center justify-center w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-display font-bold text-sm transition-colors"
              >
                Fazer Pedido Online
              </Link>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
