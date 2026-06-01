"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { authenticateDemo, demoAccounts } from "@/lib/demo-auth";

export function DemoLogin() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const initialAccount = demoAccounts.find((account) => account.plan === plan) ?? demoAccounts[0];
  const [email, setEmail] = useState(initialAccount.email);
  const [password, setPassword] = useState(initialAccount.password);
  const [message, setMessage] = useState("");

  function login() {
    const account = authenticateDemo(email, password);

    if (!account) {
      setMessage("Login ou senha incorretos.");
      return;
    }

    window.localStorage.setItem("estetica.demoAccount", JSON.stringify(account));
    if (account.role === "master_admin") {
      window.localStorage.setItem("estetica.adminAuthorized", "true");
    }
    window.location.href = account.redirectTo;
  }

  function useAccount(accountEmail: string, accountPassword: string) {
    setEmail(accountEmail);
    setPassword(accountPassword);
    setMessage("");
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-48px)] max-w-6xl items-center gap-6 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade">CRM Beauty Pro</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold text-ink sm:text-5xl">Acesso demo por plano</h1>
          <p className="mt-3 max-w-2xl text-sm text-moss">Use um dos logins abaixo para ver a separacao entre Start, Pro, Premium e Admin Master.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                onClick={() => useAccount(account.email, account.password)}
                className="rounded-lg border border-black/5 bg-white/85 p-4 text-left shadow-soft transition hover:border-jade"
                type="button"
              >
                <strong className="block text-ink">{account.label}</strong>
                <span className="mt-1 block text-sm text-moss">{account.email}</span>
                <span className="mt-1 block text-sm font-semibold text-jade">{account.password}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-black/5 bg-white p-5 shadow-soft">
          <h2 className="text-xl font-bold text-ink">Entrar</h2>
          <div className="mt-4 grid gap-3">
            <label className="grid gap-1 text-sm font-semibold text-moss">
              Email
              <span className="flex items-center gap-2 rounded-lg border border-black/10 bg-cream px-3 py-3 text-ink">
                <Mail size={16} />
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent outline-none" />
              </span>
            </label>
            <label className="grid gap-1 text-sm font-semibold text-moss">
              Senha
              <span className="flex items-center gap-2 rounded-lg border border-black/10 bg-cream px-3 py-3 text-ink">
                <Lock size={16} />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full bg-transparent outline-none" />
              </span>
            </label>
            <button onClick={login} className="rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-jade">
              Acessar demo
            </button>
            {message ? <p className="text-sm font-semibold text-coral">{message}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
