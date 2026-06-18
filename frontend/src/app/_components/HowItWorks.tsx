import Link from "next/link";
import { UtensilsCrossed, ShoppingCart, Navigation, type LucideIcon } from "lucide-react";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  iconColor: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: UtensilsCrossed,
    title: "Escolhe o teu prato",
    description:
      "Navega pelo cardápio, filtra por categoria e adiciona os teus favoritos ao carrinho. Peixes grelhados, mariscos, bebidas — tudo a um toque.",
    color: "bg-primary/10 dark:bg-primary/20",
    iconColor: "text-primary",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Confirma e paga",
    description:
      "Revê o teu pedido, escolhe o método de pagamento e confirma. Rápido, sem complicações.",
    color: "bg-accent/10 dark:bg-accent/20",
    iconColor: "text-accent",
  },
  {
    number: "03",
    icon: Navigation,
    title: "Acompanha em tempo real",
    description:
      "Recebe um código único e segue o estado do teu pedido — da cozinha até à tua porta.",
    color: "bg-success/10 dark:bg-success/20",
    iconColor: "text-success",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-white dark:bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <span className="inline-block text-accent font-display font-bold tracking-widest uppercase text-xs mb-4">
            Passo a Passo
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-foreground mb-5 leading-tight">
            Como fazer o teu pedido no{" "}
            <span className="text-primary italic font-serif">Peixe da Chicala</span>
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Três passos simples — do cardápio à entrega.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="group flex flex-col items-start">
                {/* Icon container */}
                <div
                  className={`w-full aspect-square rounded-3xl ${step.color} p-8 mb-8 relative flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]`}
                >
                  <div className="absolute top-6 left-6 size-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center font-display font-black text-sm text-foreground z-10">
                    {step.number}
                  </div>
                  <Icon
                    className={`size-16 ${step.iconColor} opacity-80`}
                    strokeWidth={1.25}
                  />
                </div>

                <h3 className="text-2xl font-display font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom callout */}
        <div className="mt-20 p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-3xl">
              🍽️
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-foreground mb-1">
                Pronto para experimentar?
              </h4>
              <p className="text-muted-foreground">
                O cardápio está à espera. Primeiro pedido, primeira vez — é simples.
              </p>
            </div>
          </div>
          <Link href="/menu">
            <button className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-display font-bold text-foreground hover:bg-gray-50 transition-colors shadow-sm cursor-pointer whitespace-nowrap">
              Ver Cardápio 
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
