"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Edit3, Menu, MessageCircle, Plus, Search, X } from "lucide-react";
import { clients as initialClients } from "@/lib/mock-data";
import { Client } from "@/lib/types";
import { Card, SectionTitle } from "@/components/ui";

export function Clients() {
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window === "undefined") return initialClients;
    const saved = window.localStorage.getItem("estetica.clients");
    return saved ? JSON.parse(saved) as Client[] : initialClients;
  });
  const [selectedId, setSelectedId] = useState(clients[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("estetica.clients", JSON.stringify(clients));
  }, [clients]);

  const selectedClient = clients.find((client) => client.id === selectedId) ?? clients[0];
  const filteredClients = useMemo(() => {
    const term = query.toLowerCase().trim();
    if (!term) return clients;
    return clients.filter((client) => `${client.name} ${client.phone} ${client.whatsapp} ${client.notes}`.toLowerCase().includes(term));
  }, [clients, query]);

  function updateSelected(field: keyof Client, value: string) {
    setClients((current) => current.map((client) => (client.id === selectedClient.id ? { ...client, [field]: value } : client)));
  }

  function addClient() {
    const newClient: Client = {
      id: crypto.randomUUID(),
      name: "Novo cliente",
      phone: "",
      whatsapp: "",
      history: "",
      notes: ""
    };
    setClients((current) => [newClient, ...current]);
    setSelectedId(newClient.id);
    setShowEditor(true);
  }

  return (
    <Card className="p-4" data-testid="clients-panel">
      <SectionTitle
        eyebrow="CRM"
        title="Clientes"
        action={<button onClick={addClient} className="flex items-center gap-2 rounded-lg bg-jade px-3 py-2 text-sm font-semibold text-white"><Plus size={16} /> Novo</button>}
      />
      <div className="mb-4 rounded-lg bg-mist p-3 text-sm font-semibold text-moss">
        Clique em um cliente para selecionar. Use o botao Editar somente quando precisar alterar dados.
      </div>
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-moss">
        <Search size={16} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-sm outline-none" placeholder="Buscar cliente, telefone ou observacao" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <div className="grid max-h-[580px] gap-3 overflow-auto pr-1 scrollbar-soft">
          {filteredClients.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                setSelectedId(client.id);
                setShowEditor(false);
              }}
              className={`rounded-lg border p-3 text-left transition ${client.id === selectedClient?.id ? "border-jade bg-mist" : "border-black/5 bg-cream hover:border-jade/40"}`}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-ink">{client.name}</h3>
                  <p className="text-sm text-moss">{client.phone || "Telefone nao informado"}</p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <MessageCircle size={17} />
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-ink">{client.history || "Sem historico cadastrado"}</p>
              <p className="mt-1 line-clamp-2 text-sm text-moss">{client.notes || "Sem observacoes"}</p>
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(client.id);
                  setShowEditor(true);
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"
              >
                <Edit3 size={15} /> Editar
              </span>
            </button>
          ))}
        </div>

        {selectedClient ? (
          <aside
            className={`min-h-72 overflow-hidden rounded-lg border border-jade/20 bg-white shadow-soft transition-all duration-300 ease-out ${
              showEditor ? "w-full xl:w-[430px]" : "w-full xl:w-[78px]"
            }`}
          >
            <div className={`flex h-full ${showEditor ? "flex-col" : "items-center justify-center xl:flex-col"}`}>
              <div className={`flex items-center gap-2 border-b border-black/5 p-3 ${showEditor ? "justify-between" : "justify-center xl:border-b-0"}`}>
                {showEditor ? (
                  <h3 className="flex min-w-0 items-center gap-2 text-lg font-semibold text-ink">
                    <Edit3 size={18} className="shrink-0" />
                    <span className="truncate">Editar cliente</span>
                  </h3>
                ) : null}
                <button
                  onClick={() => setShowEditor((current) => !current)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white transition hover:bg-jade"
                  type="button"
                  aria-label={showEditor ? "Recolher edicao" : "Expandir edicao"}
                  title={showEditor ? "Recolher edicao" : "Expandir edicao"}
                >
                  {showEditor ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>

              {showEditor ? (
                <div className="grid gap-3 p-4">
                  <EditField label="Nome" value={selectedClient.name} onChange={(value) => updateSelected("name", value)} />
                  <EditField label="Telefone" value={selectedClient.phone} onChange={(value) => updateSelected("phone", value)} />
                  <EditField label="WhatsApp" value={selectedClient.whatsapp} onChange={(value) => updateSelected("whatsapp", value)} />
                  <EditArea label="Historico de atendimentos" value={selectedClient.history} onChange={(value) => updateSelected("history", value)} />
                  <EditArea label="Observacoes" value={selectedClient.notes} onChange={(value) => updateSelected("notes", value)} />
                  <button onClick={() => setShowEditor(false)} className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-jade px-4 py-3 text-sm font-semibold text-white">
                    <Check size={16} /> Salvar e recolher
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowEditor(true)}
                  className="flex w-full items-center justify-center gap-2 p-4 text-sm font-semibold text-jade xl:h-full xl:flex-col xl:px-2"
                  type="button"
                >
                  <Edit3 size={20} />
                  <span className="xl:[writing-mode:vertical-rl]">Edicao</span>
                </button>
              )}
            </div>
          </aside>
        ) : null}
      </div>
    </Card>
  );
}

function EditField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-moss">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade" />
    </label>
  );
}

function EditArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-moss">
      {label}
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="resize-none rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade" />
    </label>
  );
}
