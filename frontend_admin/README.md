# Admin Frontend

React + Vite + Tailwind + Redux admin panel.

## Quick start

1. Install deps
2. Run dev server

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview prod build
- `npm run lint` — lint source

## Tailwind

Configured via `tailwind.config.js` and `src/styles/index.css`.

## Authentication

No authentication is wired by default. See `DOCUMENTATION.md` → “Adding Authentication” for guidance when you’re ready to integrate an IdP.

## Troubleshooting

- Port conflicts: if 5173 is busy, Vite will choose another port; check the console output.
- CSS not applied: ensure Tailwind is installed and `index.css` is imported in `main.jsx`.
