import { ArrowRight, Check, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl flex-col justify-center">
        <header className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-ink text-white shadow-soft">
              <Sparkles size={22} />
            </div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade">CRM Beauty Pro</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold text-ink sm:text-5xl lg:text-6xl">Organize sua agenda, clientes e finanças em um só lugar.</h1>
          </div>
          <a href="/login" className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-6 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-jade">
            Começar Agora <ArrowRight size={17} />
          </a>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          <PlanCard
            name="START"
            plan="start"
            price="R$ 50/mês"
            features={["Agenda", "Clientes", "Financeiro", "Controle 60/20/20"]}
          />
          <PlanCard
            name="PRO"
            plan="pro"
            price="R$ 79/mês"
            featured
            features={["Tudo do Start", "WhatsApp Automático", "Metas", "Recuperação de Clientes"]}
          />
          <PlanCard
            name="PREMIUM"
            plan="premium"
            price="R$ 129/mês"
            features={["Tudo do Pro", "IA de Retenção", "Campanhas WhatsApp", "Dashboard Avançado"]}
          />
        </section>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 rounded-lg border border-black/5 bg-white/80 p-4 shadow-soft sm:flex-row">
          <p className="text-sm font-semibold text-moss">Já possui conta?</p>
          <a href="/login" className="inline-flex items-center justify-center rounded-lg border border-black/10 px-5 py-3 text-sm font-semibold text-ink transition hover:border-jade hover:text-jade">
            Entrar
          </a>
        </footer>
      </section>
    </main>
  );
}

function PlanCard({ name, plan, price, features, featured = false }: { name: string; plan: string; price: string; features: string[]; featured?: boolean }) {
  return (
    <article className={`rounded-lg border p-5 shadow-soft ${featured ? "border-jade bg-ink text-white" : "border-black/5 bg-white/85 text-ink"}`}>
      <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${featured ? "text-white/70" : "text-jade"}`}>{name}</p>
      <strong className="mt-3 block text-3xl">{price}</strong>
      <div className="mt-5 grid gap-3">
        {features.map((feature) => (
          <p key={feature} className={`flex items-center gap-2 text-sm font-medium ${featured ? "text-white/85" : "text-moss"}`}>
            <span className={`flex size-5 items-center justify-center rounded-full ${featured ? "bg-white text-ink" : "bg-mist text-jade"}`}>
              <Check size={13} />
            </span>
            {feature}
          </p>
        ))}
      </div>
      <a href={`/login?plan=${plan}`} className={`mt-6 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition ${featured ? "bg-white text-ink hover:bg-mist" : "bg-ink text-white hover:bg-jade"}`}>
        Assinar
      </a>
    </article>
  );
}
