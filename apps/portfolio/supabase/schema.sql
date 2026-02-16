-- Create a projects table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  slug text unique not null,
  image_url text,
  tags text[],
  github_url text,
  live_url text,
  is_featured boolean default false
);

-- Set up Row Level Security (RLS)
alter table projects enable row level security;

-- Create a policy that allows anyone to read projects
create policy "Allow public read access" on projects
  for select using (true);
