create table app_hashes (
    id bigserial primary key,
    visitor_id text,
    app_hash text not null,
    created_at timestamptz default now()
);
create index on app_hashes(app_hash);

