"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

export function AdminGate() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const account = window.localStorage.getItem("estetica.demoAccount");
    const parsed = account ? JSON.parse(account) as { role?: string } : null;
    setAuthorized(parsed?.role === "master_admin" || window.localStorage.getItem("estetica.adminAuthorized") === "true");
  }, []);

  if (authorized) {
    return <AdminShell />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md rounded-lg border border-black/5 bg-white p-6 shadow-soft">
        <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-ink text-white">
          <Lock size={22} />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade">Admin Master</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Acesso restrito</h1>
        <p className="mt-2 text-sm text-moss">Entre com o login demo do Admin Master. Na versao real, essa validacao vem do Supabase por role `master_admin`.</p>
        <a href="/login" className="mt-5 flex w-full items-center justify-center rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-jade">
          Ir para login
        </a>
      </section>
    </main>
  );
}
