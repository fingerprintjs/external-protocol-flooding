create table statistics (
    id BIGSERIAL,
    fingerprint text,
    visitorId text,
    apps jsonb,
    hash text,
    created_at timestamp with time zone default now()
);
