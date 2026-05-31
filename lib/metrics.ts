import { transactions } from "@/lib/mock-data";

export const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function getMetrics() {
  const income = transactions.filter((transaction) => transaction.kind === "income");
  const expenses = transactions.filter((transaction) => transaction.kind === "expense");
  const revenue = income.reduce((sum, transaction) => sum + transaction.amount, 0);
  const costs = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
  const profit = revenue - costs;
  const dailyRevenue = income
    .filter((transaction) => transaction.occurredAt === "2026-05-30")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    dailyRevenue,
    weeklyRevenue: revenue,
    monthlyRevenue: revenue * 4.2,
    profit,
    averageTicket: revenue / income.length,
    cashFlow: revenue - costs,
    allocation: {
      operation: revenue * 0.6,
      proLabore: revenue * 0.2,
      reserve: revenue * 0.2
    }
  };
}
