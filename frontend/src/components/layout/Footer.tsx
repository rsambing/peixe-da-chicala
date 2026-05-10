import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = {
  Produto: [
    { label: "Como funciona", href: "/como-funciona" },
    { label: "Taxas e custos", href: "#" },
    { label: "Categorias", href: "/categorias" },
    { label: "Histórias de sucesso", href: "#" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Equipa", href: "#" },
    { label: "Imprensa", href: "#" },
    { label: "Contactos", href: "#" },
  ],
  Suporte: [
    { label: "Centro de Ajuda", href: "#" },
    { label: "Perguntas Frequentes", href: "#" },
    { label: "Política de Privacidade", href: "#" },
    { label: "Termos de Serviço", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Top */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/images/logo.png"
                alt="Levanta Angola"
                className="size-18 rounded-xl"
                width={72}
                height={72}
              />
            </div>
            <p className="text-sm leading-relaxed opacity-80 max-w-xs">
              Plataforma de financiamento coletivo para causas sociais, educativas, 
              tecnológicas e comunitárias em Angola.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-display font-bold uppercase tracking-wider mb-4 opacity-60">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-60">
            © {new Date().getFullYear()} Levanta Angola. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            {/* Facebook */}
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Facebook">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-4 3.8-4 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12H16l-.4 3h-2.1v7A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="X">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.38 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.15 12.15 0 0 1 3.1 4.9a4.28 4.28 0 0 0 1.33 5.7 4.26 4.26 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.44 4.2 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 3A8.6 8.6 0 0 1 2 19.54 12.14 12.14 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18 0-.35-.01-.53A8.3 8.3 0 0 0 22.46 6z" />
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Instagram">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
