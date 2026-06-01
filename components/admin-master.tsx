import { Building2, CircleDollarSign, Crown, Users } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { currency } from "@/lib/metrics";

const planRows = [
  { plan: "Start", companies: 12, price: 50 },
  { plan: "Pro", companies: 8, price: 79 },
  { plan: "Premium", companies: 4, price: 129 }
];

export function AdminMaster() {
  const totalCompanies = planRows.reduce((sum, row) => sum + row.companies, 0);
  const mrr = planRows.reduce((sum, row) => sum + row.companies * row.price, 0);

  return (
    <Card className="p-4">
      <SectionTitle eyebrow="Admin Master" title="Gestao SaaS" />
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="Empresas" value={String(totalCompanies)} icon={Building2} />
        <Metric label="Ativas" value="22" icon={Users} />
        <Metric label="Inativas" value="2" icon={Crown} />
        <Metric label="MRR" value={currency.format(mrr)} icon={CircleDollarSign} />
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-black/5">
        {planRows.map((row) => (
          <div key={row.plan} className="grid grid-cols-3 gap-3 border-b border-black/5 bg-cream p-3 last:border-b-0">
            <strong className="text-ink">{row.plan}</strong>
            <span className="text-moss">{row.companies} empresas</span>
            <span className="text-right font-semibold text-jade">{currency.format(row.companies * row.price)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Building2 }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-4">
      <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-mist text-jade">
        <Icon size={18} />
      </div>
      <p className="text-xs font-semibold uppercase text-moss">{label}</p>
      <strong className="text-xl text-ink">{value}</strong>
    </div>
  );
}
