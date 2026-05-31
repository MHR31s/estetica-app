"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, CircleDollarSign, PiggyBank, TrendingUp, WalletCards } from "lucide-react";
import { revenueSeries } from "@/lib/mock-data";
import { currency, getMetrics } from "@/lib/metrics";
import { Card, SectionTitle } from "@/components/ui";

const metrics = getMetrics();

const cards = [
  { label: "Receita diaria", value: currency.format(metrics.dailyRevenue), icon: CircleDollarSign },
  { label: "Receita semanal", value: currency.format(metrics.weeklyRevenue), icon: TrendingUp },
  { label: "Receita mensal", value: currency.format(metrics.monthlyRevenue), icon: CalendarDays },
  { label: "Lucro", value: currency.format(metrics.profit), icon: WalletCards },
  { label: "Ticket medio", value: currency.format(metrics.averageTicket), icon: PiggyBank }
];

export function Dashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.label} className="p-4">
            <div className="mb-4 flex size-9 items-center justify-center rounded-lg bg-mist text-jade">
              <card.icon size={18} />
            </div>
            <p className="text-sm text-moss">{card.label}</p>
            <strong className="mt-1 block text-xl text-ink">{card.value}</strong>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Card className="p-4">
          <SectionTitle eyebrow="Indicadores" title="Receita e lucro da semana" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ left: -18, right: 10, top: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="receita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2f9b7c" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2f9b7c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e4ebe7" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                <Tooltip formatter={(value) => currency.format(Number(value))} />
                <Area dataKey="receita" stroke="#2f9b7c" fill="url(#receita)" strokeWidth={3} />
                <Area dataKey="lucro" stroke="#dc6f61" fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <SectionTitle eyebrow="Distribuicao" title="Financeiro automatico" />
          <div className="grid gap-3">
            <Allocation label="Operacao" value={metrics.allocation.operation} percent={60} color="bg-jade" />
            <Allocation label="Pro-labore" value={metrics.allocation.proLabore} percent={20} color="bg-coral" />
            <Allocation label="Reserva" value={metrics.allocation.reserve} percent={20} color="bg-ink" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Allocation({ label, value, percent, color }: { label: string; value: number; percent: number; color: string }) {
  return (
    <div className="rounded-lg border border-black/5 bg-cream p-3">
      <div className="mb-2 flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-moss">{percent}%</span>
      </div>
      <div className="mb-2 h-2 overflow-hidden rounded-full bg-mist">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
      <strong className="text-lg">{currency.format(value)}</strong>
    </div>
  );
}
