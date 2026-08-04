import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body ?? {};

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "Campos obrigatórios em falta" }, { status: 400 });
    }

    // Aqui você pode integrar com o backend real, enviar email, etc.
    // Neste ambiente devolvemos sucesso e logamos no servidor.
    // Normalize phone
    const normalizedPhone = String(phone).replace(/\D/g, "");
    console.log("[contact] novo contacto:", { name, phone: normalizedPhone, message });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[contact] erro ao processar:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
