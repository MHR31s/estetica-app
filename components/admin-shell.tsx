"use client";

import { useState } from "react";
import { BarChart3, Building2, CreditCard, Menu, SettingsIcon, TrendingUp } from "lucide-react";
import { AdminMaster } from "@/components/admin-master";
import { Card, SectionTitle } from "@/components/ui";

type AdminTab = "dashboard" | "empresas" | "assinaturas" | "mrr" | "estatisticas" | "configuracoes";

const adminNav: { id: AdminTab; label: string; icon: typeof BarChart3 }[] = [
  { id: "dashboard", label: "Dashboard SaaS", icon: BarChart3 },
  { id: "empresas", label: "Empresas", icon: Building2 },
  { id: "assinaturas", label: "Assinaturas", icon: CreditCard },
  { id: "mrr", label: "Receita Recorrente", icon: TrendingUp },
  { id: "estatisticas", label: "Estatisticas", icon: BarChart3 },
  { id: "configuracoes", label: "Configuracoes Globais", icon: SettingsIcon }
];

export function AdminShell() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <main className="min-h-screen bg-cream">
      <aside
        className={`fixed inset-y-0 right-0 z-20 border-l border-black/10 bg-ink px-2 py-3 text-white shadow-soft transition-all duration-300 ${
          sidebarOpen ? "w-72" : "w-[74px]"
        }`}
      >
        <div className={`mb-5 flex items-center ${sidebarOpen ? "justify-between gap-3" : "justify-center"}`}>
          {sidebarOpen ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Admin Master</p>
              <h1 className="text-lg font-bold">Plataforma SaaS</h1>
            </div>
          ) : null}
          <button onClick={() => setSidebarOpen((current) => !current)} className="flex size-11 items-center justify-center rounded-lg bg-white text-ink" type="button">
            <Menu size={20} />
          </button>
        </div>
        <nav className="grid gap-2">
          {adminNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex h-12 items-center rounded-lg text-sm font-semibold transition ${
                sidebarOpen ? "justify-start gap-3 px-3" : "justify-center"
              } ${activeTab === item.id ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              type="button"
            >
              <item.icon size={20} />
              <span className={`truncate transition-all ${sidebarOpen ? "max-w-48 opacity-100" : "max-w-0 opacity-0"}`}>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className={`px-4 py-5 transition-all duration-300 ${sidebarOpen ? "pr-[300px]" : "pr-[90px]"} lg:px-8`}>
        <header className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade">Acesso exclusivo</p>
          <h2 className="mt-1 text-3xl font-bold text-ink">Painel Admin Master</h2>
          <p className="mt-2 text-sm text-moss">Empresas, assinaturas, receita recorrente, logs e configuracoes globais.</p>
        </header>
        {activeTab === "dashboard" ? <AdminMaster /> : <AdminPlaceholder title={adminNav.find((item) => item.id === activeTab)?.label ?? ""} />}
      </div>
    </main>
  );
}

function AdminPlaceholder({ title }: { title: string }) {
  return (
    <Card className="p-4">
      <SectionTitle eyebrow="Admin Master" title={title} />
      <p className="text-sm text-moss">Area restrita ao proprietario da plataforma. No Supabase, o acesso sera validado por role `master_admin` no backend e no middleware.</p>
    </Card>
  );
}
