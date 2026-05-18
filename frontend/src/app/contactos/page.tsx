"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, CardContent, Badge, Input, Textarea } from "@/components/ui";

export default function ContactosPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function submit() {
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return;
    toast.success("Mensagem enviada", {
      description: "Obrigado! Vamos responder o mais rápido possível.",
    });
    setForm({ name: "", phone: "", message: "" });
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-5xl space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-display font-black text-foreground">
              Contactos
            </h1>
            <p className="text-muted-foreground">
              Fale connosco para encomendas, reservas e informações.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-display font-black text-foreground">
                    Peixe da Chicala
                  </h2>
                  <Badge variant="accent">Aberto hoje</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted-foreground">Telefone/WhatsApp:</span>{" "}
                    <span className="text-foreground font-medium">(+244) 9XX XXX XXX</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span>{" "}
                    <span className="text-foreground font-medium">contacto@peixedachicala.ao</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Localização:</span>{" "}
                    <span className="text-foreground font-medium">Chicala, Luanda</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Horário:</span>{" "}
                    <span className="text-foreground font-medium">11:00 – 22:00</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/menu" className="flex-1">
                    <Button variant="accent" size="lg" className="w-full">
                      Fazer Pedido
                    </Button>
                  </Link>
                  <a href="#" className="flex-1">
                    <Button variant="outline" size="lg" className="w-full">
                      Abrir WhatsApp
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-display font-black text-foreground">
                  Enviar mensagem
                </h2>
                <Input
                  label="Nome"
                  placeholder="O seu nome"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
                <Input
                  label="Telefone"
                  placeholder="9XX XXX XXX"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                />
                <Textarea
                  label="Mensagem"
                  placeholder="Como podemos ajudar?"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                />
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={!form.name.trim() || !form.phone.trim() || !form.message.trim()}
                  onClick={submit}
                >
                  Enviar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0 overflow-hidden">
                <div className="aspect-video bg-muted">
                  <iframe
                    title="Mapa"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=Chicala%2C%20Luanda&output=embed"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
