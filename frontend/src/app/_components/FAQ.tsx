"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  {
    question: "Como posso criar uma campanha?",
    answer:
      "Basta registar-se, clicar em «Criar Campanha» e preencher as informações do projecto. Após a submissão, a equipa de moderação analisa a campanha em até 48 horas. Uma vez aprovada, ela fica visível para todos os doadores.",
  },
  {
    question: "Quais métodos de pagamento são aceites?",
    answer:
      "Aceitamos pagamentos via Multicaixa Express, transferência bancária e cartão de crédito/débito. Estamos a trabalhar para integrar mais métodos como pagamento por referência e mobile money.",
  },
  {
    question: "O Levanta Angola cobra alguma taxa?",
    answer:
      "A plataforma cobra uma taxa de serviço de 5% sobre os fundos arrecadados. Esta taxa cobre os custos operacionais, incluindo processamento de pagamentos, segurança, suporte e manutenção da plataforma.",
  },
  {
    question: "Como sei que os fundos estão a ser bem utilizados?",
    answer:
      "Todos os criadores de campanha são verificados através do nosso processo KYC. Além disso, exigimos a publicação de actualizações regulares e relatórios de progresso. Os doadores podem acompanhar o uso dos fundos em tempo real.",
  },
  {
    question: "O que acontece se a campanha não atingir a meta?",
    answer:
      "Caso a campanha não atinja a meta dentro do prazo definido, os fundos arrecadados são mantidos na carteira do criador (não há devolução automática). O criador pode utilizar os fundos parciais para iniciar o projecto em escala reduzida.",
  },
  {
    question: "Posso criar uma campanha em nome de uma organização?",
    answer:
      "Sim! Organizações verificadas podem criar campanhas. Basta registar a organização na plataforma, completar a verificação de documentos e associar a campanha ao perfil da organização.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Tudo o que precisa de saber sobre o Levanta Angola
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display font-bold text-foreground pr-4">
                    {faq.question}
                  </span>
                  <FiChevronDown
                    className={`size-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
