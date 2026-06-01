"use client";

import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function signIn() {
    setMessage("Conectando...");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Login realizado. Redirecionando...");
    window.location.href = "/";
  }

  async function signUp() {
    setMessage("Criando acesso...");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : "Conta criada. Verifique seu email se a confirmacao estiver ativa.");
  }

  return (
    <div className="grid gap-3">
      <label className="grid gap-1 text-sm font-medium text-moss">
        Email
        <span className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-ink">
          <Mail size={16} />
          <input className="w-full bg-transparent outline-none" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@studio.com" />
        </span>
      </label>
      <label className="grid gap-1 text-sm font-medium text-moss">
        Senha
        <span className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-ink">
          <Lock size={16} />
          <input className="w-full bg-transparent outline-none" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Minimo 6 caracteres" />
        </span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={signIn} className="rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white">Entrar</button>
        <button onClick={signUp} className="rounded-lg border border-black/10 px-4 py-2.5 text-sm font-semibold text-ink">Criar conta</button>
      </div>
      {message ? <p className="text-sm text-moss">{message}</p> : null}
    </div>
  );
}
