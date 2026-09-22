create table profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text not null default 'subscriber' check (role in ('subscriber', 'admin')),
  created_at timestamptz default now()
);

create table charities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  is_spotlighted boolean default false,
  created_at timestamptz default now()
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null check (status in ('active', 'inactive', 'cancelled', 'lapsed')),
  stripe_subscription_id text unique,
  charity_id uuid references charities(id),
  charity_contribution_pct numeric not null default 10 check (charity_contribution_pct >= 10),
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create table scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  score integer not null check (score between 1 and 45),
  score_date date not null,
  created_at timestamptz default now(),
  unique (user_id, score_date)
);

create table draws (
  id uuid primary key default gen_random_uuid(),
  draw_month date not null,
  mode text not null check (mode in ('random', 'algorithmic')),
  status text not null default 'draft' check (status in ('draft', 'simulated', 'published')),
  drawn_numbers integer[],
  total_pool numeric,
  pool_5 numeric,
  pool_4 numeric,
  pool_3 numeric,
  jackpot_rollover numeric default 0,
  created_at timestamptz default now(),
  published_at timestamptz
);

create table winners (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid references draws(id) not null,
  user_id uuid references profiles(id) not null,
  match_type text not null check (match_type in ('5', '4', '3')),
  amount numeric not null,
  proof_url text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'approved', 'rejected')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  created_at timestamptz default now()
);

alter table charities enable row level security;
create policy "Public read charities" on charities for select using (true);

alter table profiles enable row level security;
create policy "Users read own profile" on profiles for select using (auth.uid() = id);