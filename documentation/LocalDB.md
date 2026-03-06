# LocalDB.md

## Purpose

This document explains the full process we went through to create a **local database environment** for SchoolEm, starting from the first attempt with a plain PostgreSQL Docker container and pgAdmin, then moving to the better solution: **running a local Supabase stack with Docker and the Supabase CLI**.

The goal is to help someone else follow the same process without repeating the same confusion, errors, and dead ends.

---

## Developer Notice !!!! — Docker Desktop Required for Local Supabase

If you plan to use the **Supabase CLI for local development**, you must have **Docker Desktop** installed and running on your machine.

### Why this is required

The Supabase CLI does **not** run the local Supabase services by itself.

Instead, the CLI acts like an **orchestrator**:

1. You run a command like `supabase start`
2. The **Supabase CLI** reads your local project config
3. The CLI talks to **Docker Desktop**
4. Docker Desktop pulls the required Supabase service images
5. Docker Desktop starts each image as a container
6. Those containers together form the **local Supabase stack**

### Local workflow logic

```text
supabase start
    ↓
Supabase CLI reads local config
    ↓
Supabase CLI talks to Docker Desktop / Docker daemon
    ↓
Docker pulls Supabase service images
    ↓
Docker starts containers such as:
  - db
  - auth
  - storage
  - realtime
  - studio
  - kong
  - postgrest
    ↓
```

Your local Supabase environment is now running

---

### Big Picture

We originally wanted to:

1. Take the schema from our hosted Supabase project
2. Export it as SQL / DDL
3. Load it into a local PostgreSQL Docker container
4. Connect pgAdmin to that local database
5. Use it as a test database

At first, that sounded simple because **Supabase uses PostgreSQL underneath**.

But the problem was that our schema was not just using plain PostgreSQL features. It also depended on **Supabase-specific pieces**, especially things related to:

- `auth.uid()`
- the `auth` schema
- Supabase-managed functionality tied to authentication
- other Supabase platform assumptions

That is why the plain PostgreSQL Docker approach started breaking down.

So we changed strategies.

Instead of trying to force a Supabase-based schema into plain PostgreSQL, we moved to the correct setup:

- **Supabase CLI**
- **local Supabase stack**
- **Docker containers for each Supabase service**
- a local environment that behaves much more like the real hosted Supabase project

That solved the compatibility problems.

---

## Table of Contents

- [Part 1 — The Original Plan](#part-1--the-original-plan)
- [Part 2 — Exporting the Schema From Supabase](#part-2--exporting-the-schema-from-supabase)
- [Part 3 — Installing PostgreSQL Tools Locally](#part-3--installing-postgresql-tools-locally)
- [Part 4 — The First Restore Attempt Into Plain PostgreSQL Docker](#part-4--the-first-restore-attempt-into-plain-postgresql-docker)
- [Part 5 — The Real Failure: Supabase Auth Dependencies](#part-5--the-real-failure-supabase-auth-dependencies)
- [Part 6 — Why We Transitioned to a Different Approach](#part-6--why-we-transitioned-to-a-different-approach)
- **[Part 7 — What Supabase CLI Is](#part-7--what-supabase-cli-is)**
- [Part 8 — What a Supabase Stack Is](#part-8--what-a-supabase-stack-is)
- [Part 9 — Setting Up Local Supabase](#part-9--setting-up-local-supabase)
- [Part 10 — Pulling the Cloud Database Schema Into Local Migrations](#part-10--pulling-the-cloud-database-schema-into-local-migrations)
- [Part 11 — Starting the Local Supabase Stack](#part-11--starting-the-local-supabase-stack)
- [Part 12 — Connecting pgAdmin to Local Supabase](#part-12--connecting-pgadmin-to-local-supabase)
- [Part 13 — Why pgAdmin Works Now](#part-13--why-pgadmin-works-now)
- [Part 14 — Why This Second Approach Was Better](#part-14--why-this-second-approach-was-better)
- [Part 15 — Commands Used Throughout the Process](#part-15--commands-used-throughout-the-process)
- [Part 16 — What To Tell a Friend Following This Process](#part-16--what-to-tell-a-friend-following-this-process)
- [Part 17 — Current Recommended Workflow](#part-17--current-recommended-workflow)
- [Part 18 — Final Takeaway](#part-18--final-takeaway)

# Part 1 — The Original Plan

## What we were trying to do

We wanted to export the schema from the cloud-hosted Supabase project and restore it into a local PostgreSQL Docker container so pgAdmin could connect to it.

The idea was:

```text
Hosted Supabase DB
    ↓
Export schema.sql
    ↓
Import into local PostgreSQL Docker container
    ↓
Connect with pgAdmin
```

This was supposed to act as a local test DB.

---

## Why that seemed like it should work

Because Supabase is built on PostgreSQL.

So it was reasonable to think:

> “If Supabase is Postgres underneath, I should be able to export the SQL schema and restore it into another Postgres instance.”

That is partly true.

A plain PostgreSQL instance can absolutely understand things like:

- tables
- constraints
- indexes
- triggers
- functions
- views
- sequences

So exporting a schema from one PostgreSQL database and loading it into another is normal.

---

## The first important pieces we found

We found the **Supabase project reference ID**.

You can find it in **Supabase Dashboard → Project Settings → General**:

```text
<PROJECT_REF>
```

That is the project ref used in Supabase URLs and CLI linking.

We also needed the **database password** for direct Postgres connections.

Ask **Daniel Briseno** for the database password.

Important distinction:

- **Project ref** is not the password
- **Database password** is used for direct Postgres connections

---

## The first Docker-based local database idea

We created a plain PostgreSQL container to act as our local test database.

The idea was:

- local machine port `5433`
- forwarded to container Postgres port `5432`

That is a standard Docker port mapping setup.

The command we originally used was:

```bash
docker run --name test-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=<LOCAL_DB_PASSWORD> \
  -e POSTGRES_DB=testdb \
  -p 5433:5432 \
  -d postgres:16
```

Windows Command (PowerShell):

```powershell
docker run --name test-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=<LOCAL_DB_PASSWORD> `
  -e POSTGRES_DB=testdb `
  -p 5433:5432 `
  -d postgres:16
```

### What this means

- `POSTGRES_USER=postgres` creates the database user
- `POSTGRES_PASSWORD=<LOCAL_DB_PASSWORD>` sets the password
- `POSTGRES_DB=testdb` creates the database
- `-p 5433:5432` maps local port `5433` to container port `5432`
- `postgres:16` uses the PostgreSQL 16 image

Then pgAdmin could connect to:

- Host: `localhost` or `127.0.0.1`
- Port: `5433`
- Database: `testdb`
- Username: `postgres`
- Password: `<LOCAL_DB_PASSWORD>`

So far, that part was fine.

---

# Part 2 — Exporting the Schema From Supabase

## The plan

We wanted to use `pg_dump` to export the schema from the hosted Supabase database.

The first attempt was to use a full connection string.

The proper form looked like:

```text
postgresql://postgres:<DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres
```

But two things caused confusion:

1. The connection string by itself is **not a command**
2. Passwords with special characters (like `$`) need careful quoting in `zsh`

---

## Mistake: trying to run the connection string as a shell command

We initially pasted the connection string directly into the terminal like this:

```bash
postgresql://postgres:<DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres
```

Windows Command (PowerShell):

```powershell
postgresql://postgres:<DB_PASSWORD>@db.<PROJECT_REF>.supabase.co:5432/postgres
```

That failed because the shell tried to interpret it as a command.

The shell response was essentially:

- “no such file or directory”
- because a connection string is not an executable command

---

## Correct approach: use the connection details inside `pg_dump`

The safer command we used was:

```bash
PGPASSWORD='<DB_PASSWORD>' pg_dump \
  -h db.<PROJECT_REF>.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --schema-only \
  --schema=public \
  --no-owner \
  --no-privileges \
  > schema.sql
```

Windows Command (PowerShell):

```powershell
$env:PGPASSWORD = "<DB_PASSWORD>"
pg_dump -h db.<PROJECT_REF>.supabase.co -p 5432 -U postgres -d postgres --schema-only --schema=public --no-owner --no-privileges > schema.sql
```

Replace `<PROJECT_REF>` with the value from **Supabase Dashboard → Project Settings → General**.  
Ask **Daniel Briseno** for `<DB_PASSWORD>`.

### What this command does

- `PGPASSWORD='...'` supplies the password safely
- `pg_dump` exports the schema
- `-h` is the host
- `-p` is the port
- `-U` is the database user
- `-d` is the database name
- `--schema-only` exports only structure, not row data
- `--schema=public` limits the dump to the public schema
- `--no-owner` avoids ownership commands
- `--no-privileges` avoids GRANT/REVOKE privilege commands
- `> schema.sql` writes the output to a file

The file ended up in the current working directory, which in our case was the home directory:

```text
/Users/wuzi/schema.sql
```

---

## Why `pg_dump` did not work at first

The problem was not the database. It was the shell environment.

When we first ran `pg_dump`, the terminal said:

```text
zsh: command not found: pg_dump
```

That happened because PostgreSQL client tools were not installed yet, or were not visible in the shell’s `PATH`.

---

# Part 3 — Installing PostgreSQL Tools Locally

## We installed PostgreSQL tools with Homebrew

Command used:

```bash
brew install postgresql@18
```

Windows Command (PowerShell):

```powershell
winget install --id PostgreSQL.PostgreSQL
```

This installed PostgreSQL client tools such as:

- `pg_dump`
- `psql`

But Homebrew installed them as **keg-only**, meaning they were not automatically added to the shell path.

---

## The PATH problem

Even after installation, these commands failed:

```bash
which pg_dump
pg_dump --version
```

because the shell still did not know where `pg_dump` lived.

Homebrew told us the binaries were here:

```text
/opt/homebrew/opt/postgresql@18/bin
```

So we fixed the path temporarily with:

```bash
export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"
```

Windows Command (PowerShell):

```powershell
$env:Path = "C:\\Program Files\\PostgreSQL\\18\\bin;$env:Path"
```

Then verification worked:

```bash
which pg_dump
pg_dump --version
```

Windows Command (PowerShell):

```powershell
where pg_dump
pg_dump --version
```

and `pg_dump` became available.

### What `export PATH=...` fixed

It told `zsh` to search that PostgreSQL tools directory when looking for commands.

Before that, `pg_dump` was installed but invisible to the shell.

---

# Part 4 — The First Restore Attempt Into Plain PostgreSQL Docker

## Restoring into the local Docker database

After creating `schema.sql`, we tried to load it into the plain PostgreSQL Docker container.

The intended form was:

```bash
PGPASSWORD='<LOCAL_DB_PASSWORD>' psql \
  -h localhost \
  -p 5433 \
  -U postgres \
  -d testdb \
  -f schema.sql
```

Windows Command (PowerShell):

```powershell
$env:PGPASSWORD = "<LOCAL_DB_PASSWORD>"
psql -h localhost -p 5433 -U postgres -d testdb -f schema.sql
```

This means:

- connect to local Postgres on `5433`
- use user `postgres`
- use database `testdb`
- execute the SQL file `schema.sql`

---

## First restore issue: `transaction_timeout`

We hit an error like:

```text
ERROR:  unrecognized configuration parameter "transaction_timeout"
```

### Why that happened

The schema dump was created by a newer PostgreSQL tool / source environment, but our Docker container was running:

```text
postgres:16
```

The dump contained a line like:

```sql
SET transaction_timeout = 0;
```

PostgreSQL 16 did not recognize that setting.

### Fix we used

We removed the line from the SQL file.

Command:

```bash
sed -i '' '/transaction_timeout/d' ~/schema.sql
```

Windows Command (PowerShell):

```powershell
(Get-Content "$HOME\\schema.sql") | Where-Object { $_ -notmatch "transaction_timeout" } | Set-Content "$HOME\\schema.sql"
```

That removed the incompatible line from the dump.

---

# Part 5 — The Real Failure: Supabase Auth Dependencies

## The major error

Then we hit the more important error:

```text
ERROR:  schema "auth" does not exist
LINE 932:     (p.author_id = ( SELECT auth.uid() AS uid)) AS can_delet...
```

### What this told us

This was the real clue that the schema was not just plain PostgreSQL.

It depended on Supabase features such as:

- the `auth` schema
- the function `auth.uid()`
- probably policies or views expecting Supabase authentication behavior

---

## Why plain PostgreSQL failed here

A plain PostgreSQL Docker container knows nothing about Supabase Auth by default.

So while Postgres understands SQL in general, it does **not** automatically have:

- `auth.uid()`
- Supabase auth helper functions
- Supabase auth schemas
- auth-managed tables the way Supabase provides them
- storage / realtime / auth platform conventions

That is why loading the schema into plain Postgres started failing.

---

## Important lesson

The problem was not:

> “Postgres is broken.”

The real issue was:

> “We were trying to restore a Supabase-aware schema into a plain PostgreSQL environment that did not include Supabase’s platform pieces.”

That is a huge difference.

---

# Part 6 — Why We Transitioned to a Different Approach

## Why the first approach was not ideal

The plain PostgreSQL Docker approach was okay only if we wanted:

- plain tables
- plain indexes
- plain functions
- plain triggers

But our SchoolEm schema depended on more than that.

It expected Supabase-specific behavior.

So if we stayed with that first approach, we would have to keep manually patching or mocking things like:

- `auth.uid()`
- `auth.users`
- RLS-related assumptions
- possibly storage-related features later

That would have turned into a fake environment rather than a true local version of the real backend.

---

## The better solution

Instead of running only PostgreSQL in Docker, we moved to running the **local Supabase stack**.

That means we stopped thinking in terms of:

```text
Plain PostgreSQL container
```

and moved to:

```text
Supabase local development environment
```

That is the correct approach when the schema depends on Supabase platform features.

---

# **Part 7** — What Supabase CLI Is

## Supabase CLI

The **Supabase CLI** is the command-line tool that controls local and remote Supabase workflows.

We installed it with:

```bash
brew install supabase/tap/supabase
```

Windows Command (PowerShell):

```powershell
scoop install supabase
```

### What the CLI lets us do

It gives commands like:

- `supabase init`
- `supabase login`
- `supabase link`
- `supabase db pull`
- `supabase start`
- `supabase stop`
- `supabase db reset`
- `supabase db push`

The CLI itself is not the whole backend.

It is the tool that orchestrates and manages the backend workflow.

---

# Part 8 — What a Supabase Stack Is

## If you care to understand

A **Supabase stack** means the full collection of services that make Supabase work together.

Supabase is **not just PostgreSQL**.

It is a platform built around PostgreSQL.

So locally, Supabase runs multiple services, usually each inside its own Docker container.

Examples include:

- database container
- auth container
- storage container
- realtime container
- studio container
- API-related containers

Each container has its own job.

Together, they form the **local Supabase stack**.

### Simple mental model

```text
Supabase stack = many containers working together
One stack container = one service in that group
```

---

## Why this matters

When we first used a plain Postgres container, we only had:

```text
database only
```

When we switched to the Supabase stack, we got:

```text
database + auth + storage + realtime + studio + API layer + supporting services
```

That is why the local setup became compatible with our real Supabase-backed schema.

---

# Part 9 — Setting Up Local Supabase

## Create a project folder

We made a local folder for the environment:

```bash
mkdir -p ~/Desktop/SchoolEm-local
cd ~/Desktop/SchoolEm-local
```

Windows Command (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\\Desktop\\SchoolEm-local"
Set-Location "$env:USERPROFILE\\Desktop\\SchoolEm-local"
```

---

## Initialize Supabase locally

Command:

```bash
supabase init
```

Windows Command (PowerShell):

```powershell
supabase init
```

That created the local Supabase project structure.

---

## Log in to Supabase CLI

Command:

```bash
supabase login
```

Windows Command (PowerShell):

```powershell
supabase login
```

This opened the browser-based login and authenticated the CLI against the Supabase account.

---

## Link the local project to the hosted cloud project

Command:

```bash
supabase link --project-ref <PROJECT_REF>
```

Windows Command (PowerShell):

```powershell
supabase link --project-ref <PROJECT_REF>
```

This linked the local folder to the hosted Supabase project using the project ref.

---

# Part 10 — Pulling the Cloud Database Schema Into Local Migrations

## Pull the remote database schema

Command:

```bash
supabase db pull
```

Windows Command (PowerShell):

```powershell
supabase db pull
```

### What this did

This is one of the most important steps.

It did **not** simply create another ad-hoc SQL dump like `pg_dump`.

It connected to the hosted Supabase database and generated a migration file like:

```text
supabase/migrations/20260306031013_remote_schema.sql
```

### Why this matters

This means the database structure is now represented as a migration file inside the local project.

That gives us:

- repeatability
- versioned schema tracking
- something we can commit to Git later
- a cleaner workflow than raw dump and patching

When prompted:

```text
Update remote migration history table? [Y/n]
```

we accepted it.

---

# Part 11 — Starting the Local Supabase Stack

## Command used

```bash
supabase start
```

Windows Command (PowerShell):

```powershell
supabase start
```

This is the command that actually started the **local Supabase stack** through Docker.

### What it pulled / started

From the terminal output, it started containers such as:

- `db`
- `auth`
- `storage`
- `edgeRuntime`
- `realtime`
- `studio`
- `logflare`
- `mailpit`
- `imgproxy`
- `kong`
- `postgres-meta`
- `postgrest`

This is why local Supabase is more than plain PostgreSQL.

It is a full local backend ecosystem.

---

## The output it gave us

The local stack printed useful connection info.

### Studio

```text
http://127.0.0.1:54323
```

### Project URL / API

```text
http://127.0.0.1:54321
```

### Local database

```text
postgresql://postgres:<LOCAL_DB_PASSWORD>@127.0.0.1:54322/postgres
```

This is the important database connection for pgAdmin.

---

# Part 12 — Connecting pgAdmin to Local Supabase

## Correct pgAdmin connection values

Use these in pgAdmin:

### General
```text
Name: Supabase Local
```

### Connection
```text
Host: localhost
Port: 54322
Database: postgres
Username: postgres
Password: <LOCAL_DB_PASSWORD>
```

Use the password shown in the `supabase start` output for your local stack.

You can also use:

```text
Host: 127.0.0.1
```

instead of `localhost`.

They mean the same machine.

---

## Important mistake we made

We accidentally tried:

```text
localhost:127.0.0.1
```

inside the host field.

That is invalid because the host field should contain only one hostname or IP.

Correct examples are:

- `localhost`
- `127.0.0.1`

and the port should go in the separate **Port** field.

---

# Part 13 — Why pgAdmin Works Now

pgAdmin still connects only to PostgreSQL.

It does **not** connect directly to “Supabase Auth.”

So why does it work now?

Because it is connecting to the **PostgreSQL instance inside the local Supabase stack**, not to a plain standalone Postgres container.

That local Postgres instance has been initialized in a Supabase-aware environment.

So database objects expected by the schema make sense there.

### Before

```text
pgAdmin
   ↓
Plain PostgreSQL Docker container
   ↓
Missing auth schema and auth.uid()
```

### Now

```text
pgAdmin
   ↓
PostgreSQL inside local Supabase stack
   ↓
Compatible with auth/storage/realtime-related assumptions
```

---

# Part 14 — Why This Second Approach Was Better

## What the second approach offered

The local Supabase stack gave us:

- a local database that matches the cloud architecture better
- local auth compatibility
- local storage compatibility
- local realtime compatibility
- migration-based workflow
- a repeatable environment
- a safer place to test without touching production

Instead of constantly patching SQL files and mocking missing pieces, we now have a development environment much closer to the real thing.

---

## Why we switched

We switched because the first approach failed for the right reasons.

The SchoolEm schema was built in a Supabase environment, so the most correct local environment is also a Supabase environment.

This was not just a convenience decision.

It was an architecture compatibility decision.

---

# Part 15 — Commands Used Throughout the Process

## Plain PostgreSQL Docker container approach

### Run the original Postgres test container
```bash
docker run --name test-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=<LOCAL_DB_PASSWORD> \
  -e POSTGRES_DB=testdb \
  -p 5433:5432 \
  -d postgres:16
```

Windows Command (PowerShell):

```powershell
docker run --name test-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=<LOCAL_DB_PASSWORD> `
  -e POSTGRES_DB=testdb `
  -p 5433:5432 `
  -d postgres:16
```

### Export Supabase schema with `pg_dump`
```bash
PGPASSWORD='<DB_PASSWORD>' pg_dump \
  -h db.<PROJECT_REF>.supabase.co \
  -p 5432 \
  -U postgres \
  -d postgres \
  --schema-only \
  --schema=public \
  --no-owner \
  --no-privileges \
  > schema.sql
```

Windows Command (PowerShell):

```powershell
$env:PGPASSWORD = "<DB_PASSWORD>"
pg_dump -h db.<PROJECT_REF>.supabase.co -p 5432 -U postgres -d postgres --schema-only --schema=public --no-owner --no-privileges > schema.sql
```

### Remove incompatible `transaction_timeout` line
```bash
sed -i '' '/transaction_timeout/d' ~/schema.sql
```

Windows Command (PowerShell):

```powershell
(Get-Content "$HOME\\schema.sql") | Where-Object { $_ -notmatch "transaction_timeout" } | Set-Content "$HOME\\schema.sql"
```

### Restore schema into local plain PostgreSQL Docker DB
```bash
PGPASSWORD='<LOCAL_DB_PASSWORD>' psql \
  -h localhost \
  -p 5433 \
  -U postgres \
  -d testdb \
  -f schema.sql
```

Windows Command (PowerShell):

```powershell
$env:PGPASSWORD = "<LOCAL_DB_PASSWORD>"
psql -h localhost -p 5433 -U postgres -d testdb -f schema.sql
```

---

## Local Supabase workflow

### Install Supabase CLI
```bash
brew install supabase/tap/supabase
```

Windows Command (PowerShell):

```powershell
scoop install supabase
```

### Create local project folder
```bash
mkdir -p ~/Desktop/SchoolEm-local
cd ~/Desktop/SchoolEm-local
```

Windows Command (PowerShell):

```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\\Desktop\\SchoolEm-local"
Set-Location "$env:USERPROFILE\\Desktop\\SchoolEm-local"
```

### Initialize local Supabase project
```bash
supabase init
```

Windows Command (PowerShell):

```powershell
supabase init
```

### Log in
```bash
supabase login
```

Windows Command (PowerShell):

```powershell
supabase login
```

### Link local project to hosted Supabase project
```bash
supabase link --project-ref <PROJECT_REF>
```

Windows Command (PowerShell):

```powershell
supabase link --project-ref <PROJECT_REF>
```

### Pull remote cloud database schema into local migration files
```bash
supabase db pull
```

Windows Command (PowerShell):

```powershell
supabase db pull
```

### Start local Supabase stack
```bash
supabase start
```

Windows Command (PowerShell):

```powershell
supabase start
```

---

## PostgreSQL tooling setup

### Install PostgreSQL tools
```bash
brew install postgresql@18
```

Windows Command (PowerShell):

```powershell
winget install --id PostgreSQL.PostgreSQL
```

### Temporarily expose PostgreSQL binaries in PATH
```bash
export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"
```

Windows Command (PowerShell):

```powershell
$env:Path = "C:\\Program Files\\PostgreSQL\\18\\bin;$env:Path"
```

### Check pg_dump
```bash
which pg_dump
pg_dump --version
```

Windows Command (PowerShell):

```powershell
where pg_dump
pg_dump --version
```

---

# Part 16 — What To Tell a Friend Following This Process

If your schema uses only plain PostgreSQL features, then the original Docker Postgres + pgAdmin approach may be enough.

But if your schema depends on Supabase features such as:

- `auth.uid()`
- auth schemas
- Supabase platform expectations
- storage / auth / realtime integrations

then skip the plain PostgreSQL-only approach and use **local Supabase** from the start.

That will save a lot of time.

---

# Part 17 — Current Recommended Workflow

For SchoolEm, the recommended workflow now is:

```text
Hosted Supabase project
    ↓
supabase db pull
    ↓
local migration file
    ↓
supabase start
    ↓
local Supabase stack in Docker
    ↓
pgAdmin connects to local Supabase Postgres
```

This is much cleaner than:

```text
Hosted Supabase
    ↓
raw pg_dump
    ↓
patch SQL manually
    ↓
fight missing auth functionality
```

---

# Part 18 — Final Takeaway

The biggest lesson from this whole process is:

> Supabase is not just PostgreSQL.

Supabase is a full platform built around PostgreSQL.

So if your database schema depends on Supabase-specific behavior, then a plain PostgreSQL Docker container is not enough to accurately recreate your real environment.

That is why the first approach partially worked but eventually failed.

The second approach worked because we stopped trying to imitate Supabase manually and instead ran the actual local Supabase stack that Supabase expects developers to use.

---

# End Summary

We first tried to export the hosted Supabase schema with `pg_dump` and restore it into a plain PostgreSQL Docker container connected through pgAdmin. That worked for the general idea of schema export and local restore, but it broke when the schema referenced Supabase-specific features like `auth.uid()` and the `auth` schema. We also had to deal with tooling issues such as missing `pg_dump`, shell PATH configuration, and a version-related `transaction_timeout` setting. Because the SchoolEm schema depended on more than plain PostgreSQL, we shifted to the proper solution: installing the Supabase CLI, linking the local project to the hosted project, pulling the remote schema into migration files, and starting a full local Supabase stack in Docker. That gave us a local environment with the database, auth, storage, realtime, and other supporting services all working together. pgAdmin now connects to the PostgreSQL instance inside that local Supabase stack, which is why the schema behaves correctly. This second workflow is the right long-term approach for a Supabase-based app because it is repeatable, migration-driven, and much closer to the real cloud environment.
