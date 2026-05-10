import Link from "next/link";
import Image from 'next/image';

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      image: "/images/landing/1.png",
      title: "Dê vida à sua ideia",
      description:
        "Começar é simples. Partilhe a sua história, defina um objectivo claro e adicione fotos ou vídeos que mostrem o impacto que deseja criar em Angola.",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      number: "02",
      image: "/images/landing/2.png",
      title: "Mobilize a comunidade",
      description:
        "Use as nossas ferramentas de partilha integradas para alcançar doadores. Aceitamos pagamentos locais e internacionais de forma segura.",
      color: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      number: "03",
      image: "/images/landing/3.png",
      title: "Realize e acompanhe",
      description:
        "Receba os fundos e mantenha os seus apoiantes actualizados. A nossa plataforma garante total transparência em cada kwanza movimentado.",
      color: "bg-emerald-50 dark:bg-emerald-900/20",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white dark:bg-transparent">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="inline-block text-accent font-display font-bold tracking-widest uppercase text-xs mb-4">
            Passo a Passo
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-foreground mb-6 leading-tight">
            Como o Levanta Angola <br />
            ajuda a <span className="text-primary italic font-serif">transformar</span> ideias em realidade
          </h2>
          <p className="text-muted-foreground text-xl leading-relaxed">
            Uma plataforma transparente e fácil de usar, desenhada especificamente para os desafios e oportunidades do nosso país.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div key={step.number} className="group flex flex-col items-start">
              {/* Image Container */}
              <div className={`w-full aspect-square rounded-3xl ${step.color} p-8 mb-8 relative overflow-hidden transition-all duration-500 group-hover:scale-[1.02] flex items-center justify-center`}>
                {/* Step Number Badge */}
                <div className="absolute top-6 left-6 size-10 rounded-full bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center font-display font-black text-sm text-foreground z-10">
                  {step.number}
                </div>
                
                <Image
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  fill
                />

                {/* Decorative blob in background */}
                <div className="absolute -bottom-10 -right-10 size-40 bg-white/40 dark:bg-white/5 blur-3xl rounded-full" />
              </div>

              {/* Text */}
              <h3 className="text-2xl font-display font-black text-foreground mb-4 group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-20 p-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="size-16 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-3xl">
              💡
            </div>
            <div>
              <h4 className="font-display font-bold text-xl text-foreground mb-1">Dúvidas sobre o processo?</h4>
              <p className="text-muted-foreground">O nosso suporte local está disponível para o ajudar em cada etapa.</p>
            </div>
          </div>
          <Link href="/como-funciona">
            <button className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-display font-bold text-foreground hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">
              Ler Guia Completo
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
