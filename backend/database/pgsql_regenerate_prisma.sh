#!/usr/bin/env bash

cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd

DB_NAME="hcmanagement"

export PGPASSWORD="Huyy47b1"

psql -U postgres -h localhost -v ON_ERROR_STOP=1 postgres <<SQL
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '$DB_NAME';

DROP DATABASE IF EXISTS $DB_NAME;

CREATE DATABASE $DB_NAME
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = icu
    ICU_LOCALE = 'vi'
    TEMPLATE = template0;
SQL

cd ..

unset PGPASSWORD
pnpm dlx prisma generate
pnpm dlx prisma db push
pnpm dlx prisma db seed
