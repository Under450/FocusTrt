# FocusTRT — Stage 1A

**Admin upload pipeline for research studies.**

Next.js 15 + Supabase + TypeScript. Matches the existing FocusTRT design language (navy / cream / copper, Cormorant Garamond + Didact Gothic).

---

## What Stage 1A does

- Admin signs in via email magic link
- Admin uploads studies as **pasted text**, **PDF/TXT file**, or **URL**
- Studies stored in Supabase Postgres with row-level security
- Uploaded files stored in private Supabase Storage bucket
- List + detail views with soft delete

## What Stage 1A does NOT do (yet)

- AI script generation → **Stage 1B**
- Doctor review workflow → **Stage 1C**
- Audio generation via TADA → **Stage 1D**
- Publishing to members forum → **Stage 1E**
- Email delivery → **Stage 1F**

Each stage ships independently. Do not skip ahead.

---

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (pick the London region for UK latency)
3. Wait ~2 minutes for provisioning to finish
4. Note your project URL and `anon` + `service_role` keys (Project Settings → API)

### 2. Run the database migration

1. In your Supabase dashboard, open the **SQL Editor**
2. Open `supabase/migrations/20260419000000_stage_1a_initial.sql` from this repo
3. Paste the entire contents into the SQL editor and click **Run**
4. Confirm it says "Success. No rows returned" — this is expected

This creates:
- `admins` table (whitelist)
- `studies` table
- `podcasts` table (placeholder for Stage 1B+)
- `study-uploads` storage bucket
- RLS policies
- `is_admin()` helper function

### 3. Configure environment variables

1. Copy `.env.example` to `.env.local` in the project root
2. Fill in values from your Supabase dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Never commit `.env.local`** — `.gitignore` already excludes it.

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

App will be at `http://localhost:3000`.

### 5. Create your first admin user

This is the only slightly fiddly part. You need to:

**a. Sign up via the app:**
- Go to `http://localhost:3000/login`
- Enter your email
- Click the magic link in the email you receive

You'll be bounced back to home with a "not authorised" error. That's expected — you've been *created* as an auth user but not *whitelisted* as admin yet.

**b. Whitelist yourself:**
- Open `supabase/seed_admin.sql`
- Replace `your-admin-email@example.com` with the email you just signed up with
- Run the entire script in the Supabase SQL Editor
- You should see your row in the verification SELECT output

**c. Sign out and sign in again:**
- Go to `/login` again
- Request a new magic link
- Click it
- You should now land on `/admin`

### 6. Add more admins later

Repeat step 5a–5b for each new admin.

Or, easier in the Supabase dashboard:
1. Authentication → Users → find the new user's UUID
2. Table Editor → `admins` → Insert row → paste `user_id`, `email`, `full_name`

---

## Project structure

```
app/
  (admin)/
    admin/
      admin.module.css        — sidebar styles
      actions.ts              — server actions (create/delete study, sign out)
      layout.tsx              — sidebar + main shell
      page.tsx                — dashboard with stats + recent studies
      studies/
        page.tsx              — list of all studies
        new/page.tsx          — upload form (text / PDF / URL)
        [id]/page.tsx         — study detail view
  (auth)/
    login/page.tsx            — magic link sign-in
  auth/
    callback/route.ts         — handles magic link click
  globals.css                 — design tokens + primitives
  layout.tsx                  — root layout
  page.tsx                    — public home page

lib/
  supabase/
    client.ts                 — browser client
    server.ts                 — server component / action client
    service.ts                — service-role client (bypasses RLS)

supabase/
  migrations/
    20260419000000_stage_1a_initial.sql  — DB schema + RLS policies
  seed_admin.sql              — one-time admin whitelist SQL

middleware.ts                 — refreshes session + protects /admin routes
```

---

## Deployment (later, when you're ready)

For local development, keep using `npm run dev`. For production:

1. Push this repo to GitHub (replace existing `Focus TRT` index.html)
2. Go to [vercel.com](https://vercel.com), import the GitHub repo
3. Add all `.env.local` variables in Vercel's project settings
4. Change `NEXT_PUBLIC_SITE_URL` to your Vercel URL (or custom domain)
5. In Supabase: **Authentication → URL Configuration** → add your Vercel URL to **Site URL** and **Redirect URLs**
6. Deploy

---

## Keeping the existing index.html

Your current `index.html` is the **member dashboard mockup**. It does not conflict with this Next.js admin app — they serve different users. Options:

**Option 1:** Keep `index.html` as a reference design file in `docs/` and build the real member dashboard in Stage 1E.

**Option 2:** Delete it now — the design tokens are already lifted into `app/globals.css`.

My recommendation: move it to `docs/design-reference.html` so it stays as a visual reference but isn't served as the live site.

---

## Stage 1A acceptance criteria

Before moving to Stage 1B, confirm:

- [ ] You can sign in at `/login` with magic link
- [ ] Non-admin users get bounced to `/` with "not authorised"
- [ ] Admin user can reach `/admin` dashboard
- [ ] Admin can create a study with pasted text
- [ ] Admin can create a study with PDF upload
- [ ] Admin can create a study with URL
- [ ] Study appears in `/admin/studies` list
- [ ] Study detail page renders all fields correctly
- [ ] PDF download link works and expires after 5 minutes
- [ ] Deleting a study removes both DB row and storage file

Once all boxes ticked, ask for **Stage 1B** (Claude AI script generation).

---

## Troubleshooting

**"Magic link doesn't arrive"**
Check spam folder. If still missing, go to Supabase Authentication → Users to confirm the user was created. You may need to configure SMTP in Project Settings → Authentication for reliable delivery.

**"Authenticated but bounced from /admin"**
You've signed up but not been whitelisted. Run `seed_admin.sql` with your email.

**"RLS policy violation on storage upload"**
The `study-uploads` bucket RLS policies rely on `is_admin()`. Make sure the migration ran completely — re-run if any errors appeared.

**"Middleware crash / infinite redirect"**
Clear cookies for `localhost:3000`, restart `npm run dev`, try again.
