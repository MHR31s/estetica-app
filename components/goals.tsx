import { Target, TrendingUp } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";
import { company, transactions } from "@/lib/mock-data";
import { currency } from "@/lib/metrics";

export function Goals() {
  const realized = transactions.filter((item) => item.kind === "income").reduce((sum, item) => sum + item.amount, 0);
  const dailyGoal = company.monthlyGoal / 26;
  const weeklyGoal = company.monthlyGoal / 4.3;
  const missing = Math.max(company.monthlyGoal - realized, 0);
  const percent = Math.min((realized / company.monthlyGoal) * 100, 100);

  return (
    <Card className="p-4">
      <SectionTitle eyebrow="Metas" title="Acompanhamento de metas" />
      <div className="grid gap-3 md:grid-cols-4">
        <GoalCard label="Meta diaria" value={currency.format(dailyGoal)} />
        <GoalCard label="Meta semanal" value={currency.format(weeklyGoal)} />
        <GoalCard label="Meta mensal" value={currency.format(company.monthlyGoal)} />
        <GoalCard label="Realizado" value={currency.format(realized)} />
      </div>
      <div className="mt-4 rounded-lg bg-cream p-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Target size={16} /> Progresso mensal</p>
          <strong className="text-jade">{percent.toFixed(0)}%</strong>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-mist">
          <div className="h-full rounded-full bg-jade" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-moss"><TrendingUp size={16} /> Faltam {currency.format(missing)} para atingir sua meta mensal.</p>
      </div>
    </Card>
  );
}

function GoalCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-black/5 bg-white p-4">
      <p className="text-xs font-semibold uppercase text-moss">{label}</p>
      <strong className="mt-1 block text-lg text-ink">{value}</strong>
    </div>
  );
}
