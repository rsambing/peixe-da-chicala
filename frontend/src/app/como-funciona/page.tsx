import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import { FiCheckCircle, FiShield, FiTrendingUp, FiHeart, FiLock } from "react-icons/fi";

export default function ComoFuncionaPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen bg-background">
        {/* Simple Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="mx-auto max-w-5xl text-center relative z-10">
            <span className="inline-block text-accent font-display font-bold tracking-widest uppercase text-xs mb-4">
              Guia Completo
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-foreground mb-8 tracking-tighter leading-[0.95]">
              Transformar Angola <br />
              começa com <span className="font-serif italic text-primary underline underline-offset-8 decoration-primary/20">o seu</span> gesto.
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Descubra como criamos uma ponte segura entre sonhos e realizadores, garantindo transparência em cada kwanza.
            </p>
          </div>
          
          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-150 bg-primary/30 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* The Process - Expanded */}
        <section className="py-24 px-6 bg-white dark:bg-gray-950/50">
          <div className="mx-auto max-w-5xl">
            <div className="space-y-32">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                <div className="flex-1 order-2 md:order-1">
                  <span className="text-8xl font-display font-black text-primary/10 block mb-4">01</span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-6">Crie a sua campanha em minutos</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Seja para uma causa pessoal, social ou empresarial, a nossa plataforma simplifica tudo. Defina o seu objectivo, conte a sua história de forma autêntica e partilhe imagens que inspirem confiança.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Registo rápido e gratuito
                    </li>
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Suporte na criação de conteúdo
                    </li>
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Verificação de identidade (KYC)
                    </li>
                  </ul>
                </div>
                <div className="flex-1 order-1 md:order-2">
                  <div className="aspect-square bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] overflow-hidden relative group">
                    <Image 
                      src="/images/landing/1.png" 
                      alt="Criar" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                <div className="flex-1">
                  <div className="aspect-square bg-amber-50 dark:bg-amber-900/10 rounded-[3rem] overflow-hidden relative group">
                    <Image 
                      src="/images/landing/2.png" 
                      alt="Mobilizar" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-8xl font-display font-black text-primary/10 block mb-4">02</span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-6">Receba apoio de todo o mundo</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Facilitamos o processo de doação com métodos de pagamento que os angolanos usam e confiam. Do Multicaixa Express ao Unitel Money, tornamos apoiar impossível de ignorar.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Multicaixa Express & Transferências
                    </li>
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Dinheiro Móvel (Unitel/AfriMoney)
                    </li>
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Painel de controlo em tempo real
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                <div className="flex-1 order-2 md:order-1">
                  <span className="text-8xl font-display font-black text-primary/10 block mb-4">03</span>
                  <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-6">Levante os fundos com segurança</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Assim que atingir o seu objectivo (ou o prazo terminar), os fundos são transferidos directamente para a sua conta bancária. O nosso processo é auditado e transparente.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Prazos de levantamento rápidos
                    </li>
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Relatórios de transparência
                    </li>
                    <li className="flex items-center gap-3 text-foreground font-medium">
                      <FiCheckCircle className="text-primary size-5" /> Taxas competitivas e claras
                    </li>
                  </ul>
                </div>
                <div className="flex-1 order-1 md:order-2">
                  <div className="aspect-square bg-emerald-50 dark:bg-emerald-900/10 rounded-[3rem] overflow-hidden relative group">
                    <Image 
                      src="/images/landing/3.png" 
                      alt="Realizar" 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Cards */}
        <section className="py-24 px-6 bg-primary dark:bg-primary/90 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-10 rounded-full -mr-48 -mt-48 blur-3xl" />
          
          <div className="mx-auto max-w-5xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-display font-black mb-6">Segurança em primeiro lugar</h2>
              <p className="text-primary-foreground/80 text-xl max-w-2xl mx-auto">
                Implementamos as tecnologias mais avançadas para proteger cada centavo e cada dado pessoal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiShield className="size-8" />,
                  title: "Verificação Rigorosa",
                  desc: "Validamos cada organizador através de documentos oficiais antes de qualquer levantamento."
                },
                {
                  icon: <FiLock className="size-8" />,
                  title: "Pagamentos Encriptados",
                  desc: "Os seus dados bancários nunca são armazenados nos nossos servidores."
                },
                {
                  icon: <FiTrendingUp className="size-8" />,
                  title: "Transparência Total",
                  desc: "O público pode acompanhar o progresso das campanhas e os levantamentos efectuados."
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/20 transition-colors">
                  <div className="text-accent mb-6">{item.icon}</div>
                  <h3 className="text-2xl font-display font-black mb-4">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 px-6 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="size-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-10 text-primary animate-bounce">
              <FiHeart className="size-10 fill-current" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-foreground mb-8 tracking-tighter">
              Pronto para fazer <br />a <span className="text-primary italic font-serif">diferença</span>?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/campanhas/criar" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto px-12">Começar agora</Button>
              </Link>
              <Link href="/explorar" className="w-full sm:w-auto">
                <Button variant="outline" size="xl" className="w-full sm:w-auto px-12">Ver exemplos</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
