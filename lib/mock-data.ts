import { Appointment, Client, Transaction } from "@/lib/types";

export const clients: Client[] = [
  {
    id: "1",
    name: "Marina Lopes",
    phone: "(11) 98411-2200",
    whatsapp: "5511984112200",
    history: "Limpeza de pele, peeling de diamante",
    notes: "Pele sensivel. Prefere horarios pela manha."
  },
  {
    id: "2",
    name: "Bianca Prado",
    phone: "(11) 97742-8101",
    whatsapp: "5511977428101",
    history: "Drenagem linfatica",
    notes: "Pacote mensal ativo."
  },
  {
    id: "3",
    name: "Clara Mendes",
    phone: "(11) 96502-3310",
    whatsapp: "5511965023310",
    history: "Design de sobrancelhas",
    notes: "Enviar lembrete com orientacoes pos-atendimento."
  }
];

export const appointments: Appointment[] = [
  {
    id: "1",
    clientName: "Marina Lopes",
    service: "Limpeza de pele",
    startsAt: "2026-05-30",
    time: "09:00",
    duration: 75,
    price: 220,
    status: "confirmed",
    statusHistory: [
      { id: "h1", from: "created", to: "scheduled", changedAt: "2026-05-29T08:00:00.000Z" },
      { id: "h2", from: "scheduled", to: "confirmed", changedAt: "2026-05-29T08:15:00.000Z" }
    ]
  },
  {
    id: "2",
    clientName: "Bianca Prado",
    service: "Drenagem linfatica",
    startsAt: "2026-05-30",
    time: "11:00",
    duration: 60,
    price: 180,
    status: "scheduled",
    statusHistory: [
      { id: "h3", from: "created", to: "scheduled", changedAt: "2026-05-29T10:00:00.000Z" }
    ]
  },
  {
    id: "3",
    clientName: "Clara Mendes",
    service: "Design de sobrancelhas",
    startsAt: "2026-05-31",
    time: "15:30",
    duration: 45,
    price: 95,
    status: "rescheduled",
    statusHistory: [
      { id: "h4", from: "created", to: "scheduled", changedAt: "2026-05-28T14:00:00.000Z" },
      { id: "h5", from: "scheduled", to: "rescheduled", changedAt: "2026-05-29T14:30:00.000Z" }
    ]
  }
];

export const transactions: Transaction[] = [
  { id: "1", kind: "income", description: "Limpeza de pele - Marina", amount: 220, occurredAt: "2026-05-30", category: "Atendimento" },
  { id: "2", kind: "income", description: "Drenagem - Bianca", amount: 180, occurredAt: "2026-05-30", category: "Atendimento" },
  { id: "3", kind: "expense", description: "Produtos descartaveis", amount: 64, occurredAt: "2026-05-30", category: "Insumos" },
  { id: "4", kind: "income", description: "Sobrancelhas - Clara", amount: 95, occurredAt: "2026-05-29", category: "Atendimento" },
  { id: "5", kind: "expense", description: "Impulsionamento Instagram", amount: 40, occurredAt: "2026-05-29", category: "Marketing" }
];

export const revenueSeries = [
  { label: "Seg", receita: 360, lucro: 252 },
  { label: "Ter", receita: 420, lucro: 304 },
  { label: "Qua", receita: 280, lucro: 198 },
  { label: "Qui", receita: 510, lucro: 382 },
  { label: "Sex", receita: 620, lucro: 476 },
  { label: "Sab", receita: 400, lucro: 336 },
  { label: "Dom", receita: 160, lucro: 128 }
];
