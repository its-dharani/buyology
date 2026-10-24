# Buyology — Buy, Wait, or Skip

Buyology is a personal shopping decision investigator. Instead of showing raw ratings, it analyses available evidence — review insights, pros and cons, price observations, and user preferences — and delivers a transparent **BUY / WAIT / SKIP** verdict with clear reasoning.

## Features

- **Product search** by name or URL (fuzzy matching across the demo dataset)
- **Evidence-backed verdict** (Buy, Wait, or Skip) with rule-based, explainable logic
- **Pros / cons breakdown** drawn from curated review summaries
- **Alternatives comparison** — up to three side-by-side alternatives
- **Price tracking** — manually record price observations against a target price
- **Saved investigations** — persist analysis sessions in browser localStorage
- **Preference filters** — budget, eco-friendly, brand loyalty, and more
- Responsive desktop and mobile layout with a blush-pink / lavender design system

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS v3 · Zustand · Vitest + Testing Library

## Running locally

```bash
npm install
npm run dev
```

The app is served at `http://localhost:5173`.

## Running tests

```bash
npm run test        # watch mode
npm run test -- --run   # single run (CI)
```

88 tests across 14 files covering verdict logic, fuzzy matching, URL parsing, storage, and UI components.

## Building for production

```bash
npm run build
```

Output is written to `dist/` (~247 kB JS, ~14 kB CSS before gzip).

---

> Demo data is clearly labelled as sample data throughout the UI. No price history is fabricated or presented as real market data.
