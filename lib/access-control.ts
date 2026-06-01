import { CompanyPlan } from "@/lib/types";

export type ClientModule =
  | "dashboard"
  | "agenda"
  | "clientes"
  | "financeiro"
  | "relatorios"
  | "metas"
  | "marketing"
  | "whatsapp"
  | "configuracoes";

export const planAccess: Record<CompanyPlan, ClientModule[]> = {
  start: ["dashboard", "agenda", "clientes", "financeiro"],
  pro: ["dashboard", "agenda", "clientes", "financeiro", "relatorios", "metas", "whatsapp", "configuracoes"],
  premium: ["dashboard", "agenda", "clientes", "financeiro", "relatorios", "metas", "marketing", "whatsapp", "configuracoes"]
};

export function canAccessModule(plan: CompanyPlan, module: ClientModule) {
  return planAccess[plan].includes(module);
}
