# 505Local.com

Premium domain sales site for **505local.com** — a geo-local exact-match `.com` for New Mexico’s 505 area code (Albuquerque, Santa Fe, Rio Rancho, and central NM).

Built with Astro, Tailwind CSS, and Cloudflare Workers static assets.

## Site flow (conversion)

1. **Hero** — brand-first offer + primary CTA  
2. **Why / Opportunity / Market / Value** — justify the asset  
3. **FAQ** — handle price, escrow, and buyer-fit objections  
4. **Insights** — SEO content for DA and education  
5. **Acquire + final CTA** — three-step purchase path + offer modal  

Inquiries go to `sales@desertrich.com` (mailto from the offer form).

## Develop locally

```bash
npm ci
npm run dev -- --port 43125 --host 127.0.0.1
```

Open [http://127.0.0.1:43125](http://127.0.0.1:43125).

## Build & deploy

```bash
npm run build
npx wrangler deploy
```

Pushing to `main` on GitHub runs `.github/workflows/deploy.yml` (requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets).

## SEO / DA notes

- Canonical URLs, Open Graph, Twitter cards  
- `Product` + `Offer`, `Organization`, `WebSite`, `FAQPage`, `Article`, `BreadcrumbList` JSON-LD  
- Sitemap via `@astrojs/sitemap`  
- Insights articles for topical depth and internal links  
- Mobile-first layout, sticky mobile CTA, safe-area padding  
