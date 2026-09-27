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
npm ci
npm run build
npx wrangler deploy
```

Pushing to `main` runs `.github/workflows/deploy.yml`.

### GitHub Actions secrets required

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | API token with **Edit Cloudflare Workers** (Account → Workers Scripts: Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |

If deploy fails with `Authentication error [code: 10000]` or `Invalid access token [code: 9109]`, recreate the API token in the Cloudflare dashboard and update the repo secret, then re-run the failed workflow:

```bash
gh workflow run "Deploy Worker" --repo Mrerg7/505local-com-v1
# or re-run a failed run:
gh run rerun <run-id> --repo Mrerg7/505local-com-v1 --failed
```

Live site: https://505local.com/

## SEO / DA notes

- Canonical URLs, Open Graph, Twitter cards  
- `Product` + `Offer`, `Organization`, `WebSite`, `FAQPage`, `Article`, `BreadcrumbList` JSON-LD  
- Sitemap via `@astrojs/sitemap`  
- Insights articles for topical depth and internal links  
- Mobile-first layout, sticky mobile CTA, safe-area padding  
