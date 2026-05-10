import { Header, Footer } from "@/components/layout";
import { Category, CATEGORY_LABELS } from "@/lib/types";
import { CategoryIcon } from "@/components/features/campaigns";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const categoryExtraInfo: Record<Category, { description: string, color: string }> = {
  [Category.EDUCATION]: {
    description: "Apoie escolas, bolsas de estudo e materiais didácticos para o futuro de Angola.",
    color: "bg-blue-500/10 text-blue-600 border-blue-200"
  },
  [Category.HEALTH]: {
    description: "Contribua para tratamentos médicos, cirurgias e equipamentos hospitalares essenciais.",
    color: "bg-red-500/10 text-red-600 border-red-200"
  },
  [Category.TECHNOLOGY]: {
    description: "Impulsione o ecossistema tecnológico, startups e literacia digital no país.",
    color: "bg-indigo-500/10 text-indigo-600 border-indigo-200"
  },
  [Category.ARTS]: {
    description: "Preserve a nossa cultura através da música, artes visuais e património angolano.",
    color: "bg-purple-500/10 text-purple-600 border-purple-200"
  },
  [Category.COMMUNITY]: {
    description: "Projectos locais que transformam bairros e fortalecem os laços sociais.",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-200"
  },
  [Category.BUSINESS]: {
    description: "Suporte o empreendedorismo local e pequenos negócios familiares a crescer.",
    color: "bg-amber-500/10 text-amber-600 border-amber-200"
  },
  [Category.EMERGENCY]: {
    description: "Ajuda urgente para catástrofes naturais e situações críticas em qualquer província.",
    color: "bg-orange-500/10 text-orange-600 border-orange-200"
  },
  [Category.ENVIRONMENT]: {
    description: "Proteja a nossa fauna e flora, promovendo um futuro sustentável para Angola.",
    color: "bg-green-500/10 text-green-600 border-green-200"
  }
};

export default function CategoriasPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-background">
        {/* Header Section */}
        <section className="py-20 px-6 border-b border-black/5">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-foreground mb-6 tracking-tighter">
              Explore por <br />
              <span className="font-serif italic text-primary">Sectores de Impacto</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Encontre as causas que mais ressoam com os seus valores e ajude a transformar realidades em cada canto de Angola.
            </p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
                <Link 
                  key={cat} 
                  href={`/explorar?category=${cat}`}
                  className="group relative flex flex-col p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-black/5 dark:border-white/5 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Decorative Gradient Background (Hover Only) */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${categoryExtraInfo[cat].color && categoryExtraInfo[cat].color.split(' ')[0]}`} />
                  
                  <div className="relative z-10">
                    <div className={`size-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 ${categoryExtraInfo[cat].color}`}>
                      <CategoryIcon category={cat} className="size-7" />
                    </div>

                    <h3 className="text-2xl font-display font-black text-foreground mb-4">
                      {CATEGORY_LABELS[cat]}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed mb-10 min-h-[4.5rem]">
                      {categoryExtraInfo[cat].description}
                    </p>

                    <div className="flex items-center gap-2 text-primary font-display font-bold text-sm uppercase tracking-widest">
                      <span>Explorar Campanhas</span>
                      <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Aesthetic Number / Position */}
                  <div className="absolute -bottom-6 -right-6 text-9xl font-display font-black text-black/[0.02] dark:text-white/[0.02] pointer-events-none">
                    {cat.slice(0, 1)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Global Stats or Support Callout */}
        <section className="py-24 px-6 bg-gray-50 dark:bg-gray-950/50">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-display font-black text-foreground mb-4">
              Não encontrou o que procurava?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Estamos sempre abertos a novas ideias e necessidades da comunidade.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/campanhas/criar">
                <button className="px-8 py-4 bg-primary text-white rounded-full font-display font-bold hover:bg-primary/90 transition-colors">
                  Começar Nova Causa
                </button>
              </Link>
              <Link href="/contacto">
                <button className="px-8 py-4 border border-black/10 dark:border-white/20 rounded-full font-display font-bold hover:bg-white dark:hover:bg-gray-800 transition-colors">
                  Sugira uma Categoria
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
