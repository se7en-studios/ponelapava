-- Run this in the Supabase dashboard → SQL Editor for the "ponelapava" project
-- (São Paulo region), BEFORE deploying the rate-limit changes.
-- Safe to run once; `if not exists` makes it a no-op on re-run.
--
-- Registro de pedidos a los endpoints públicos (seguimiento, cupones, pedidos,
-- carrito abandonado) para limitar cuántos hace una misma IP por ventana.
-- Sólo se guarda sha256(ip), nunca la IP. Lo usa src/lib/rateLimit.ts.
--
-- Mientras esta tabla no exista, el límite "falla abierto": las rutas
-- responden igual que antes y el error queda en los logs del servidor.

create table if not exists public.rate_limit_hits (
  id bigint generated always as identity primary key,
  bucket text not null,
  key_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists rate_limit_hits_bucket_key_created_idx
  on public.rate_limit_hits (bucket, key_hash, created_at desc);

-- Sin políticas: sólo la service-role key (server-side) lee o escribe.
alter table public.rate_limit_hits enable row level security;
