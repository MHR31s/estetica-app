"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, CalendarDays, DatabaseBackup, Megaphone, Menu, MessageCircle, SettingsIcon, ShieldCheck, Sparkles, Target } from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { Clients } from "@/components/clients";
import { Dashboard } from "@/components/dashboard";
import { Finance } from "@/components/finance";
import { Goals } from "@/components/goals";
import { Marketing } from "@/components/marketing";
import { Reports } from "@/components/reports";
import { Schedule } from "@/components/schedule";
import { Settings } from "@/components/settings";
import { WhatsappAutomation } from "@/components/whatsapp-automation";
import { canAccessModule, ClientModule } from "@/lib/access-control";
import { company } from "@/lib/mock-data";
import { CompanyPlan } from "@/lib/types";

type TabId = ClientModule;

const nav: { id: TabId; label: string; icon: typeof BarChart3 }[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "agenda", label: "Agenda", icon: CalendarDays },
  { id: "clientes", label: "Clientes", icon: Sparkles },
  { id: "financeiro", label: "Financeiro", icon: ShieldCheck },
  { id: "relatorios", label: "Relatorios", icon: DatabaseBackup },
  { id: "metas", label: "Metas", icon: Target },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "configuracoes", label: "Configuracoes", icon: SettingsIcon }
];

const titles: Record<TabId, { eyebrow: string; title: string; subtitle: string }> = {
  dashboard: {
    eyebrow: "Painel inicial",
    title: `Bom dia, ${company.name}`,
    subtitle: "Sabado, 30 de maio - indicadores gerais"
  },
  clientes: {
    eyebrow: "CRM",
    title: "Clientes",
    subtitle: "Cadastros, contatos, historico e observacoes"
  },
  agenda: {
    eyebrow: "Agenda",
    title: "Atendimentos",
    subtitle: "Calendario, horarios, confirmacoes e lembretes"
  },
  financeiro: {
    eyebrow: "Financeiro",
    title: "Fluxo de caixa",
    subtitle: "Entradas, saidas, lucro e distribuicao automatica"
  },
  relatorios: {
    eyebrow: "Relatorios",
    title: "Fechamentos",
    subtitle: "Visoes diaria, semanal e mensal"
  },
  whatsapp: {
    eyebrow: "Automacoes",
    title: "WhatsApp",
    subtitle: "Confirmacoes, lembretes e backup automatico"
  },
  metas: {
    eyebrow: "Crescimento",
    title: "Metas",
    subtitle: "Meta diaria, semanal, mensal e valor faltante"
  },
  marketing: {
    eyebrow: "Retencao",
    title: "Marketing",
    subtitle: "Recuperacao de clientes inativas e campanhas"
  },
  configuracoes: {
    eyebrow: "Empresa",
    title: "Configuracoes",
    subtitle: "Marca, cores, mensagens automaticas e plano"
  }
};

export function AppShell() {
  const searchParams = useSearchParams();
  const queryPlan = searchParams.get("plan") as CompanyPlan | null;
  const initialPlan = queryPlan && ["start", "pro", "premium"].includes(queryPlan) ? queryPlan : company.plan;
  const [selectedPlan, setSelectedPlan] = useState<CompanyPlan>(initialPlan);
  const [activeTab, setActiveTab] = useState<TabId>("agenda");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeTitle = titles[activeTab];
  const allowedModules = nav.filter((item) => canAccessModule(selectedPlan, item.id));

  useEffect(() => {
    if (queryPlan && ["start", "pro", "premium"].includes(queryPlan)) {
      setSelectedPlan(queryPlan);
      window.localStorage.setItem("estetica.selectedPlan", queryPlan);
      return;
    }

    const savedPlan = window.localStorage.getItem("estetica.selectedPlan") as CompanyPlan | null;
    if (savedPlan && ["start", "pro", "premium"].includes(savedPlan)) {
      setSelectedPlan(savedPlan);
    }
  }, [queryPlan]);

  useEffect(() => {
    if (!canAccessModule(selectedPlan, activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, selectedPlan]);

  return (
    <main className="min-h-screen">
      <aside
        className={`fixed inset-y-0 right-0 z-20 border-l border-black/10 bg-white/95 px-2 py-3 shadow-soft backdrop-blur transition-all duration-300 ease-out ${
          sidebarOpen ? "w-64" : "w-[74px]"
        } lg:px-3 lg:py-5`}
      >
        <div className={`mb-5 flex items-center ${sidebarOpen ? "justify-between gap-3" : "justify-center"}`}>
          {sidebarOpen ? (
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-jade">Studio</p>
              <h1 className="truncate text-lg font-bold text-ink">{company.name}</h1>
              <p className="text-xs font-semibold uppercase text-moss">Plano {selectedPlan}</p>
            </div>
          ) : null}
          <button
            onClick={() => setSidebarOpen((current) => !current)}
            className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-ink text-white shadow-soft transition hover:bg-jade"
            type="button"
            aria-label={sidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="grid gap-2">
          {allowedModules.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex h-12 items-center rounded-lg text-sm font-semibold transition ${
                sidebarOpen ? "justify-start gap-3 px-3" : "justify-center px-0"
              } ${
                activeTab === item.id ? "bg-mist text-jade" : "text-moss hover:bg-mist hover:text-jade"
              }`}
              type="button"
              title={item.label}
            >
              <item.icon size={20} className="shrink-0" />
              <span className={`truncate transition-all duration-200 ${sidebarOpen ? "max-w-40 opacity-100" : "max-w-0 opacity-0"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div
        className={`px-4 pb-8 pt-5 transition-all duration-300 ease-out ${
          sidebarOpen ? "pr-[90px] lg:pr-72" : "pr-[90px] lg:pr-24"
        } lg:px-8 lg:pb-10`}
      >
        <header className="mb-5 grid gap-4 xl:grid-cols-[1fr_360px]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade">{activeTitle.eyebrow}</p>
            <h2 className="mt-1 text-3xl font-bold text-ink sm:text-4xl">{activeTitle.title}</h2>
            <p className="mt-2 text-sm text-moss">{activeTitle.subtitle}</p>
          </div>
          <div className="rounded-lg border border-black/5 bg-white/85 p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
              <DatabaseBackup size={17} className="text-jade" />
              Login Supabase
            </div>
            <AuthPanel />
          </div>
        </header>

        <section aria-live="polite">
          {activeTab === "dashboard" ? <Dashboard /> : null}
          {activeTab === "clientes" ? <Clients /> : null}
          {activeTab === "agenda" ? <Schedule /> : null}
          {activeTab === "financeiro" ? <Finance /> : null}
          {activeTab === "relatorios" ? <Reports /> : null}
          {activeTab === "whatsapp" ? <WhatsappAutomation /> : null}
          {activeTab === "metas" ? <Goals /> : null}
          {activeTab === "marketing" ? <Marketing /> : null}
          {activeTab === "configuracoes" ? <Settings /> : null}
        </section>
      </div>
    </main>
  );
}
