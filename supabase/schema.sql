create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  nome_empresa text not null,
  logo_url text default '',
  cor_primaria text not null default '#2f9b7c',
  cor_secundaria text not null default '#dc6f61',
  whatsapp text default '',
  email text default '',
  plano text not null default 'start' check (plano in ('start', 'pro', 'premium')),
  meta_mensal numeric(12,2) not null default 0,
  mensagem_confirmacao text not null default 'Seu horario esta confirmado.',
  mensagem_lembrete_24h text not null default 'Lembrando seu atendimento amanha.',
  mensagem_pos_atendimento text not null default 'Obrigada pela confianca.',
  mensagem_cliente_inativa text not null default 'Sentimos sua falta. Temos horarios disponiveis.',
  data_cadastro timestamptz not null default now(),
  ativo boolean not null default true
);

create table if not exists public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'professional')),
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  whatsapp text,
  birth_date date,
  photo_url text default '',
  last_appointment_at date,
  total_spent numeric(12,2) not null default 0,
  return_frequency_days int,
  tags text[] not null default '{}',
  history text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  service text not null,
  starts_at timestamptz not null,
  duration_minutes int not null default 60,
  price numeric(12,2) not null default 0,
  status text not null default 'scheduled' check (status in (
    'scheduled',
    'confirmed',
    'attended',
    'finished',
    'rescheduled',
    'cancelled_by_client',
    'cancelled_by_professional',
    'no_show'
  )),
  whatsapp_confirmed_at timestamptz,
  reminder_sent_at timestamptz,
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.appointment_status_history (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  from_status text not null,
  to_status text not null,
  changed_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('income', 'expense')),
  client_id uuid references public.clients(id) on delete set null,
  service text default '',
  payment_method text default '',
  description text not null,
  amount numeric(12,2) not null,
  occurred_at date not null default current_date,
  category text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.financial_allocations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid references public.transactions(id) on delete cascade,
  operation_amount numeric(12,2) not null,
  pro_labore_amount numeric(12,2) not null,
  reserve_amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan text not null check (plan in ('start', 'pro', 'premium')),
  amount numeric(12,2) not null,
  status text not null default 'active' check (status in ('active', 'past_due', 'cancelled')),
  current_period_start date not null default current_date,
  current_period_end date not null default (current_date + interval '30 days'),
  created_at timestamptz not null default now()
);

alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_status_history enable row level security;
alter table public.transactions enable row level security;
alter table public.financial_allocations enable row level security;
alter table public.subscriptions enable row level security;

create or replace function public.user_has_company_access(target_company_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members
    where company_members.company_id = target_company_id
      and company_members.user_id = auth.uid()
  );
$$;

create policy "members can read their companies" on public.companies
  for select using (public.user_has_company_access(id));

create policy "members can update their companies" on public.companies
  for update using (public.user_has_company_access(id)) with check (public.user_has_company_access(id));

create policy "company members are scoped" on public.company_members
  for all using (user_id = auth.uid() or public.user_has_company_access(company_id))
  with check (user_id = auth.uid() or public.user_has_company_access(company_id));

create policy "clients are scoped by company" on public.clients
  for all using (public.user_has_company_access(company_id)) with check (public.user_has_company_access(company_id));

create policy "appointments are scoped by company" on public.appointments
  for all using (public.user_has_company_access(company_id)) with check (public.user_has_company_access(company_id));

create policy "appointment history is scoped by company" on public.appointment_status_history
  for all using (public.user_has_company_access(company_id)) with check (public.user_has_company_access(company_id));

create policy "transactions are scoped by company" on public.transactions
  for all using (public.user_has_company_access(company_id)) with check (public.user_has_company_access(company_id));

create policy "allocations are scoped by company" on public.financial_allocations
  for all using (public.user_has_company_access(company_id)) with check (public.user_has_company_access(company_id));

create policy "subscriptions are scoped by company" on public.subscriptions
  for all using (public.user_has_company_access(company_id)) with check (public.user_has_company_access(company_id));

create or replace function public.create_financial_allocation()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.kind = 'income' then
    insert into public.financial_allocations (
      company_id,
      user_id,
      transaction_id,
      operation_amount,
      pro_labore_amount,
      reserve_amount
    ) values (
      new.company_id,
      new.user_id,
      new.id,
      round(new.amount * 0.60, 2),
      round(new.amount * 0.20, 2),
      round(new.amount * 0.20, 2)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists transactions_allocation_trigger on public.transactions;
create trigger transactions_allocation_trigger
after insert on public.transactions
for each row execute function public.create_financial_allocation();
