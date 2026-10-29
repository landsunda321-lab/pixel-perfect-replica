create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now()
);

grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;

alter table public.contact_messages enable row level security;

create policy "Pengunjung dapat mengirim pesan kontak"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);