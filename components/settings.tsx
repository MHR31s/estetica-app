"use client";

import { useEffect, useState } from "react";
import { Check, Palette } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { company as initialCompany } from "@/lib/mock-data";
import { Company } from "@/lib/types";

export function Settings() {
  const [company, setCompany] = useState<Company>(() => {
    if (typeof window === "undefined") return initialCompany;
    const saved = window.localStorage.getItem("estetica.company");
    return saved ? JSON.parse(saved) as Company : initialCompany;
  });

  useEffect(() => {
    window.localStorage.setItem("estetica.company", JSON.stringify(company));
  }, [company]);

  function update(field: keyof Company, value: string | number) {
    setCompany((current) => ({ ...current, [field]: value }));
  }

  function updateMessage(field: keyof Company["automaticMessages"], value: string) {
    setCompany((current) => ({
      ...current,
      automaticMessages: { ...current.automaticMessages, [field]: value }
    }));
  }

  return (
    <Card className="p-4">
      <SectionTitle eyebrow="Configuracoes" title="Identidade da empresa" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          <EditField label="Nome da empresa" value={company.name} onChange={(value) => update("name", value)} />
          <EditField label="Email" value={company.email} onChange={(value) => update("email", value)} />
          <EditField label="WhatsApp" value={company.whatsapp} onChange={(value) => update("whatsapp", value)} />
          <EditField label="Meta mensal" type="number" value={String(company.monthlyGoal)} onChange={(value) => update("monthlyGoal", Number(value))} />
          <EditField label="Cor principal" type="color" value={company.primaryColor} onChange={(value) => update("primaryColor", value)} />
          <EditField label="Cor secundaria" type="color" value={company.secondaryColor} onChange={(value) => update("secondaryColor", value)} />
        </div>
        <div className="rounded-lg bg-cream p-4">
          <p className="flex items-center gap-2 font-semibold text-ink"><Palette size={17} /> Mensagens automaticas</p>
          <div className="mt-3 grid gap-3">
            <EditArea label="Confirmacao" value={company.automaticMessages.confirmation} onChange={(value) => updateMessage("confirmation", value)} />
            <EditArea label="Lembrete 24h" value={company.automaticMessages.reminder24h} onChange={(value) => updateMessage("reminder24h", value)} />
            <EditArea label="Pos atendimento" value={company.automaticMessages.afterCare} onChange={(value) => updateMessage("afterCare", value)} />
            <EditArea label="Cliente inativa" value={company.automaticMessages.inactiveClient} onChange={(value) => updateMessage("inactiveClient", value)} />
          </div>
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-jade px-4 py-3 text-sm font-semibold text-white">
            <Check size={16} /> Salvar configuracoes
          </button>
        </div>
      </div>
    </Card>
  );
}

function EditField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-moss">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade" />
    </label>
  );
}

function EditArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-moss">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={3} className="resize-none rounded-lg border border-black/10 bg-white px-3 py-3 text-base text-ink outline-none focus:border-jade" />
    </label>
  );
}
