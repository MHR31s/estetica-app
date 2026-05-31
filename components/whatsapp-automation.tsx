import { BellRing, Bot, CheckCircle2, MessageCircle, RefreshCw } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";

const automations = [
  {
    title: "Confirmacao automatica",
    detail: "Mensagem enviada ao criar ou alterar um horario.",
    icon: CheckCircle2
  },
  {
    title: "Lembrete 24h antes",
    detail: "Pode ser disparado por cron externo chamando a rota de envio.",
    icon: BellRing
  },
  {
    title: "Backup automatico",
    detail: "POST /api/backup exporta os dados principais para webhook.",
    icon: RefreshCw
  }
];

export function WhatsappAutomation() {
  return (
    <Card className="p-4">
      <SectionTitle eyebrow="WhatsApp" title="Automacoes e integrações" />
      <div className="mb-4 rounded-lg bg-ink p-4 text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <MessageCircle size={17} />
          Canal conectado
        </div>
        <p className="mt-2 text-sm text-white/75">12 mensagens enviadas hoje - 96% de confirmacao</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {automations.map((automation) => (
          <article key={automation.title} className="rounded-lg border border-black/5 bg-cream p-3">
            <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-white text-jade">
              <automation.icon size={17} />
            </div>
            <h3 className="font-semibold text-ink">{automation.title}</h3>
            <p className="mt-1 text-sm text-moss">{automation.detail}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-mist p-3 text-sm text-moss">
        <Bot size={17} className="text-jade" />
        Fila de lembretes: 2 mensagens para as proximas 24h
      </div>
    </Card>
  );
}
