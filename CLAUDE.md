# Fish Selling

Marketing website for a small home breeding farm selling aquarium fish in Vietnam.
Current lineup: Pleco L144, Molly Sakura Caramel, Molly Sanke.
Customers browse on mobile and close the sale via Zalo/Messenger, so the Zalo button is the most important call to action. There is no cart or online payment in the MVP.

Full requirements live in `docs/spec.md`. Read it before starting any feature.

## Stack

- Next.js (App Router) + TypeScript (strict) + Tailwind CSS
- Fish data is a static file: `data/fish.json` (no backend/database in the MVP)
- Hosting: Vercel (auto deploy from `main`, preview deploy per PR)
- CI: GitHub Actions (`.github/workflows/ci.yml`)

## Commands

- `npm run dev`: dev server
- `npm run lint`: ESLint
- `npx tsc --noEmit`: type check
- `npm run build`: production build

## Project layout

Follow the layout that `create-next-app` generated (check whether `src/` exists). Intended structure:

- `app/`: routes (`/`, `/ca/[slug]`, `/chinh-sach`, `/lien-he`, `sitemap.ts`, `robots.ts`)
- `components/`: reusable UI components
- `lib/fish.ts`: typed loader and helpers for `data/fish.json` (single source of truth for types)
- `data/fish.json`: all fish content
- `data/site.json`: site name, contact details and policy sections
- `public/images/<slug>/`: fish photos, one folder per fish
- `docs/`: specs and notes

## Language

- UI copy shown to customers: Vietnamese
- Code, identifiers, comments, commit messages, PR text: English
- URLs stay ASCII (`/ca/molly-sanke`, `/chinh-sach`)

## Conventions

- Mobile-first: design for ~390px width first, then scale up
- Use `next/image` for every image; always provide Vietnamese `alt` text
- Prices are integers in VND (never floats); format with `Intl.NumberFormat("vi-VN")`
- `price: null` means "ask on Zalo": show "Liên hệ" and never render 0 or NaN
- `stock: null` means unknown: do not show a stock number
- An empty `images` array must render a neutral placeholder, never a broken image
- Prefer server components; add `"use client"` only when interactivity requires it
- Contact details (phone, Zalo, social links) and policy text live in `data/site.json`, read through `lib/site.ts`; never hardcode them in components. The only env var is `NEXT_PUBLIC_SITE_URL`
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)

## Rules

- Never commit to `main`. Work on `feat/*`, `fix/*` or `chore/*` branches and open a PR
- One PR = one concern. Keep diffs small and reviewable
- Do not add dependencies without asking first
- Do not invent business facts: prices, stock, parent fish, shipping and refund policy come from the owner. Leave a clear placeholder or `null` instead of guessing
- Never commit secrets or `.env*` files; keep `.env.example` with variable names only
- Do not change the folder structure or tooling config unless the task requires it
- Ask before deleting files or running destructive commands
- The development machine is Windows: avoid bash-only scripts in `package.json`

## Definition of done

Before saying a task is finished:

1. `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass
2. The page works at mobile width (390px) and desktop width
3. No console errors or hydration warnings
4. Changes are committed on the feature branch with a clear message

## Workflow

1. Read `docs/spec.md` and this file
2. For any non-trivial task, propose a short plan and wait for approval
3. Implement step by step, committing after each working step
4. Run the checks above, then open a PR describing what changed and how to verify it

## Learned rules

Add a one-line rule here every time the AI repeats a mistake.

- (empty for now)