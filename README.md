# Souvik Mukherjee — Portfolio

A personal site for a quant & low-latency systems engineer. Terminal / trading-desk
aesthetic with a live simulated order book, animated impact metrics, and motion that
respects `prefers-reduced-motion`. Built with **Next.js 14 (App Router)**, **Tailwind CSS**,
**Framer Motion**, and `next/font`.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Editing content

All copy lives in **`lib/data.ts`** — profile, metrics, experience, projects, skills,
and credentials. Update there and the whole site follows. No content is hard-coded in
components.

Your résumé is served from `public/Souvik_Mukherjee_Resume.pdf` (linked from the nav
and hero "Résumé" buttons). Replace that file to update the download.

## Contact form

Works with **zero config**: if no backend is set, the form opens the visitor's mail
client pre-filled to your address. To enable real delivery, copy `.env.example` to
`.env.local` and set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` to a [Formspree](https://formspree.io)
(or compatible JSON) endpoint.

## Deploy to Vercel

This is a standard Next.js app — deploy in one step:

```bash
npm i -g vercel     # if you don't have the CLI
vercel              # follow prompts; deploys a preview
vercel --prod       # promote to production
```

Or push to GitHub and import the repo at [vercel.com/new](https://vercel.com/new).
If you set a contact endpoint, add `NEXT_PUBLIC_FORMSPREE_ENDPOINT` under
**Project → Settings → Environment Variables**.

Update the canonical URL in `app/layout.tsx` (`const url`) once you have a domain.

## Project structure

```
app/            layout, page, global styles, favicon
components/     Hero, OrderBook, MetricsStrip, About, Experience,
                Projects, Skills, Credentials, Contact, Footer, …
lib/            data.ts (content), fonts.ts
public/         résumé PDF
```

## Notes

- **Project source links** point to your GitHub profile (`github.com/souvik150`).
  Swap the `href` values in `lib/data.ts` for exact repo URLs when ready.
- The order-book panel is a deterministic simulation — animation starts only after
  mount (no hydration mismatch) and is disabled under reduced-motion.
