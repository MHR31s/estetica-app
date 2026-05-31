import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estetica Atendimentos",
  description: "Gestao de agenda, clientes, financeiro e WhatsApp para estetica."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
