# Committing Stage 1A to your FocusTrt repo

Your existing repo has one static `index.html`. This Stage 1A code is a full Next.js project. Here's the clean way to merge them.

## Option A — Replace contents, keep index.html as reference (recommended)

```bash
# 1. Clone your existing repo (if not already local)
git clone https://github.com/Under450/FocusTrt.git
cd FocusTrt

# 2. Create a new branch for Stage 1A
git checkout -b stage-1a-admin-upload

# 3. Move existing index.html to docs as design reference
mkdir -p docs
git mv index.html docs/design-reference.html

# 4. Copy all Stage 1A files into the repo root
# (copy contents of the focustrt/ zip into the repo root)

# 5. Stage everything
git add .
git status  # check what you're about to commit

# 6. Commit
git commit -m "Stage 1A: Next.js + Supabase admin upload pipeline

- Magic link auth with admin whitelist
- Studies table + storage bucket with RLS
- Admin pages: dashboard, list, upload, detail
- Placeholder schema for podcasts (Stage 1B+)

Design language matches existing index.html (navy/cream/copper,
Cormorant Garamond + Didact Gothic)."

# 7. Push the branch
git push origin stage-1a-admin-upload

# 8. On GitHub, open a Pull Request from stage-1a-admin-upload into main
#    Review the diff yourself before merging
```

## Option B — Keep index.html at root (if the live site is already serving it)

If GitHub Pages is serving the `index.html` live to anyone:

```bash
git checkout -b stage-1a-admin-upload

# Move index.html to public/ so Next.js can still serve the HTML
# (works because public/ is served as static files)
mkdir -p public
git mv index.html public/preview.html

# Then copy Stage 1A files and commit as above
```

The old static HTML becomes available at `/preview.html` while the new Next.js app takes over the root.

## Critical before you commit

1. **Never commit `.env.local`** — it's in `.gitignore`, but double-check
2. **Do commit `.env.example`** — so others know what env vars to set
3. **Supabase service role key** must stay out of Git — if it leaks, rotate it immediately in Supabase dashboard

## If Vercel deploys on push

If you've already connected the repo to Vercel, merging to `main` triggers a build. Before merging:

1. Add all env vars in Vercel project settings (Production environment)
2. Confirm Supabase has your Vercel URL in Authentication → URL Configuration
3. Merge to `main`

The first deploy will fail if env vars aren't set. That's fine — fix and redeploy.
