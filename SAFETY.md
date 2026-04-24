# FocusTRT Safety & Recovery Guide

## How to restore the last known-good version

If the site breaks or something gets deleted, you can always restore to the stable tagged version.

### Option 1 — Restore from a tag (safest)

```bash
git fetch origin --tags
git checkout v0.1-stage1a-live
```

This drops you into a "detached HEAD" state showing that exact version. To make it your working branch, create a new branch from it.

### Option 2 — See all stable tags

```bash
git tag -l "v*"
```

### Option 3 — Check what's on GitHub

Visit https://github.com/Under450/FocusTrt/tags

## Safe development workflow

Before making any risky change:

1. Create a branch:

```bash
git checkout -b feature/what-im-doing
```

2. Make changes, commit, push to the branch
3. Test on Vercel preview deployment (Vercel builds every branch automatically)
4. Only merge into main once verified

If the branch breaks, delete it and main is untouched:

```bash
git checkout main
git branch -D feature/what-im-doing
```

## Never work directly on main for new features

Main is your live production code. Vercel auto-deploys it. If main breaks, the live site breaks.
