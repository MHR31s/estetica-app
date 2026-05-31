# Estetica Atendimentos

Aplicativo web responsivo para gestao de atendimentos de estetica, com Next.js, Tailwind, Supabase Auth, Supabase Database e rotas preparadas para WhatsApp via Evolution API ou WhatsApp Cloud API.

## Recursos

- Login com Supabase Auth.
- Cadastro de clientes com telefone, WhatsApp, historico e observacoes.
- Agenda com calendario, horarios, confirmacao e lembrete 24h antes.
- Financeiro com entradas, saidas e fluxo de caixa.
- Dashboard com receita diaria, semanal, mensal, lucro e ticket medio.
- Distribuicao automatica: 60% operacao, 20% pro-labore, 20% reserva.
- Relatorios diario, semanal e mensal.
- Painel inicial com graficos e indicadores.
- Rota de backup automatico pronta para cron externo.

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Habilite o provedor de email em Authentication.
4. Copie `Project URL` e `anon public key` para `.env.local`.

## WhatsApp

A rota `POST /api/whatsapp/send` aceita:

```json
{
  "to": "5599999999999",
  "message": "Sua mensagem"
}
```

Use `WHATSAPP_PROVIDER=evolution` para Evolution API ou `WHATSAPP_PROVIDER=cloud` para WhatsApp Cloud API.

## Backup automatico

A rota `POST /api/backup` gera um pacote JSON com tabelas principais. Chame essa rota por cron externo, Supabase Edge Function, GitHub Actions ou agendador do provedor de deploy.
