create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  whatsapp text,
  history text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
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
  user_id uuid not null references auth.users(id) on delete cascade,
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  from_status text not null,
  to_status text not null,
  changed_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('income', 'expense')),
  description text not null,
  amount numeric(12,2) not null,
  occurred_at date not null default current_date,
  category text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.financial_allocations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid references public.transactions(id) on delete cascade,
  operation_amount numeric(12,2) not null,
  pro_labore_amount numeric(12,2) not null,
  reserve_amount numeric(12,2) not null,
  created_at timestamptz not null default now()
);

alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.appointment_status_history enable row level security;
alter table public.transactions enable row level security;
alter table public.financial_allocations enable row level security;

create policy "clients are owned by user" on public.clients
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "appointments are owned by user" on public.appointments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "appointment status history is owned by user" on public.appointment_status_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "transactions are owned by user" on public.transactions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "allocations are owned by user" on public.financial_allocations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.create_financial_allocation()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.kind = 'income' then
    insert into public.financial_allocations (
      user_id,
      transaction_id,
      operation_amount,
      pro_labore_amount,
      reserve_amount
    ) values (
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
