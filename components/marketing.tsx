import { MessageCircle, Send } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { clients, company } from "@/lib/mock-data";

const inactiveGroups = [
  { label: "30 dias sem retorno", days: 30 },
  { label: "60 dias sem retorno", days: 60 },
  { label: "90 dias sem retorno", days: 90 }
];

export function Marketing() {
  return (
    <Card className="p-4">
      <SectionTitle eyebrow="Retencao" title="Recuperacao de clientes" />
      <div className="grid gap-3 lg:grid-cols-3">
        {inactiveGroups.map((group) => (
          <div key={group.days} className="rounded-lg border border-black/5 bg-cream p-4">
            <p className="text-sm font-semibold text-ink">{group.label}</p>
            <strong className="mt-2 block text-2xl text-jade">{clients.filter((client) => (client.returnFrequencyDays ?? 0) >= group.days).length}</strong>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white">
              <MessageCircle size={16} /> Enviar WhatsApp
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-mist p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Send size={16} /> Mensagem padrao</p>
        <p className="mt-2 text-sm text-moss">{company.automaticMessages.inactiveClient}</p>
      </div>
    </Card>
  );
}
