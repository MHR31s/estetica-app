import { Download, FileText } from "lucide-react";
import { currency, getMetrics } from "@/lib/metrics";
import { Card, SectionTitle } from "@/components/ui";

const metrics = getMetrics();

const reports = [
  { title: "Diario", value: metrics.dailyRevenue, detail: "2 atendimentos, 1 saida registrada" },
  { title: "Semanal", value: metrics.weeklyRevenue, detail: "5 entradas, fluxo positivo" },
  { title: "Mensal", value: metrics.monthlyRevenue, detail: "Projecao baseada na semana atual" }
];

export function Reports() {
  return (
    <Card className="p-4">
      <SectionTitle eyebrow="Relatorios" title="Diario, semanal e mensal" />
      <div className="grid gap-3">
        {reports.map((report) => (
          <article key={report.title} className="flex items-center gap-3 rounded-lg border border-black/5 bg-cream p-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white text-jade">
              <FileText size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-ink">{report.title}</h3>
              <p className="text-sm text-moss">{report.detail}</p>
            </div>
            <div className="text-right">
              <strong className="block text-sm">{currency.format(report.value)}</strong>
              <button className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-jade"><Download size={13} /> PDF</button>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
