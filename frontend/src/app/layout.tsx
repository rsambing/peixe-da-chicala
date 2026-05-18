import type { Metadata } from "next";
import { Toaster } from "@/components/ui";
import CleanupBody from "@/components/CleanupBody";
import "./globals.css";
import { Providers } from "./providers";

import { Inter, Lexend, Instrument_Serif } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const lexend = Lexend({ subsets: ["latin"], variable: "--font-lexend" });

// Instrument Serif só aceita weight "400"
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"], // se você quiser itálico também
  variable: "--font-instrument",
});

export const metadata: Metadata = {
  title: "Peixe da Chicala — Peixe grelhado na brasa, pronto para pedir",
  description:
    "Cardápio digital do Peixe da Chicala. Escolha os pratos, adicione ao carrinho e acompanhe o seu pedido em tempo real.",
  icons: {
    icon: [
      { url: "/images/logo.png", type: "image/png", sizes: "192x192" },
      { url: "/images/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/images/logo.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-AO"
      className={`${inter.className} ${lexend.className} ${instrument.className}`}
    >
      <body suppressHydrationWarning className="min-h-screen antialiased">
        {/* Limpa atributos injetados por extensões para evitar hydration mismatch */}
        <CleanupBody />

        <Providers>{children}</Providers>

        {/* Toasts globais */}
        <Toaster />
      </body>
    </html>
  );
}
