-- טבלת הלידים של ביג קואוצ׳ — להרצה ב-SQL Editor של פרויקט ה-Supabase.
-- ה-API כותב עם service role; אין גישת קריאה/כתיבה אנונימית (RLS מופעל בלי policies).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  phone text not null,
  goal text not null default '',
  discount boolean not null default false,
  source text not null default 'bigcoach-website',
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create index if not exists leads_submitted_at_idx on public.leads (submitted_at desc);
create index if not exists leads_phone_idx on public.leads (phone);
