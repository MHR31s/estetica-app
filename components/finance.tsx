"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, Check, Edit3, Plus } from "lucide-react";
import { transactions as initialTransactions } from "@/lib/mock-data";
import { Transaction } from "@/lib/types";
import { currency, getMetrics } from "@/lib/metrics";
import { Card, SectionTitle } from "@/components/ui";

export function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === "undefined") return initialTransactions;
    const saved = window.localStorage.getItem("estetica.transactions");
    return saved ? JSON.parse(saved) as Transaction[] : initialTransactions;
  });
  const [selectedId, setSelectedId] = useState(transactions[0]?.id ?? "");
  const selectedTransaction = transactions.find((transaction) => transaction.id === selectedId) ?? transactions[0];

  useEffect(() => {
    window.localStorage.setItem("estetica.transactions", JSON.stringify(transactions));
  }, [transactions]);
  const totals = useMemo(() => {
    const income = transactions.filter((transaction) => transaction.kind === "income").reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = transactions.filter((transaction) => transaction.kind === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);
    return { income, expense, cashFlow: income - expense };
  }, [transactions]);

  function updateSelected(field: keyof Transaction, value: string | number) {
    setTransactions((current) => current.map((transaction) => (transaction.id === selectedTransaction.id ? { ...transaction, [field]: value } : transaction)));
  }

  function addTransaction() {
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      kind: "income",
      description: "Novo lancamento",
      amount: 0,
      occurredAt: "2026-05-30",
      category: ""
    };
    setTransactions((current) => [newTransaction, ...current]);
    setSelectedId(newTransaction.id);
  }

  return (
    <Card className="p-4">
      <SectionTitle
        eyebrow="Financeiro"
        title="Entradas, saidas e caixa"
        action={<button onClick={addTransaction} className="flex items-center gap-2 rounded-lg bg-jade px-3 py-2 text-sm font-semibold text-white"><Plus size={16} /> Lancar</button>}
      />
      <div className="mb-4 rounded-lg bg-mist p-3 text-sm font-semibold text-moss">
        Selecione um lancamento para alterar valor, data, categoria ou tipo de movimentacao.
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Summary label="Entradas" value={totals.income} />
        <Summary label="Saidas" value={totals.expense} />
        <Summary label="Caixa" value={totals.cashFlow} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-2">
          {transactions.map((transaction) => (
            <button
              key={transaction.id}
              onClick={() => setSelectedId(transaction.id)}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${transaction.id === selectedTransaction?.id ? "border-jade bg-mist" : "border-black/5 bg-cream hover:border-jade/40"}`}
              type="button"
            >
              <div className={`flex size-9 items-center justify-center rounded-lg ${transaction.kind === "income" ? "bg-emerald-50 text-emerald-700" : "bg-blush text-coral"}`}>
                {transaction.kind === "income" ? <ArrowUpCircle size={18} /> : <ArrowDownCircle size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{transaction.description}</p>
                <p className="text-xs text-moss">{transaction.category || "Sem categoria"} - {transaction.occurredAt}</p>
              </div>
              <strong className="text-sm">{currency.format(transaction.amount)}</strong>
            </button>
          ))}
        </div>

        {selectedTransaction ? (
          <div className="rounded-lg border border-jade/20 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-ink"><Edit3 size={18} /> Editar lancamento</h3>
              <button className="flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"><Check size={16} /> Salvar</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-sm font-semibold text-moss sm:col-span-2">
                Tipo
                <select value={selectedTransaction.kind} onChange={(event) => updateSelected("kind", event.target.value)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade">
                  <option value="income">Entrada</option>
                  <option value="expense">Saida</option>
                </select>
              </label>
              <EditField label="Descricao" value={selectedTransaction.description} onChange={(value) => updateSelected("description", value)} />
              <EditField label="Categoria" value={selectedTransaction.category} onChange={(value) => updateSelected("category", value)} />
              <EditField label="Valor" type="number" value={String(selectedTransaction.amount)} onChange={(value) => updateSelected("amount", Number(value))} />
              <EditField label="Data" type="date" value={selectedTransaction.occurredAt} onChange={(value) => updateSelected("occurredAt", value)} />
            </div>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-mist p-3">
      <p className="text-xs text-moss">{label}</p>
      <strong className="block text-sm text-ink sm:text-base">{currency.format(value)}</strong>
    </div>
  );
}

function EditField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-moss">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade" />
    </label>
  );
}
