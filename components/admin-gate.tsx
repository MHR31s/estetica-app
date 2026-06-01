"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

const demoMasterCode = "MASTER2026";

export function AdminGate() {
  const [code, setCode] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setAuthorized(window.localStorage.getItem("estetica.adminAuthorized") === "true");
  }, []);

  function enterAdmin() {
    if (code.trim() !== demoMasterCode) {
      setMessage("Codigo incorreto.");
      return;
    }

    window.localStorage.setItem("estetica.adminAuthorized", "true");
    setAuthorized(true);
  }

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
        <p className="mt-2 text-sm text-moss">Area exclusiva do proprietario da plataforma. Na versao real, essa validacao vem do Supabase por role `master_admin`.</p>
        <label className="mt-5 grid gap-1 text-sm font-semibold text-moss">
          Codigo master
          <input value={code} onChange={(event) => setCode(event.target.value)} className="rounded-lg border border-black/10 bg-cream px-3 py-3 text-base text-ink outline-none focus:border-jade" placeholder="Digite o codigo" />
        </label>
        <button onClick={enterAdmin} className="mt-4 w-full rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-jade">
          Entrar no Admin Master
        </button>
        {message ? <p className="mt-3 text-sm font-semibold text-coral">{message}</p> : null}
      </section>
    </main>
  );
}
