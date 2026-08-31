# Mars Booster website v2

Bilingual, image-led company site based on the July 2026 Chinese and English company-profile decks.

## Local preview

```bash
npm ci
npm run dev
```

Chinese: `/zh/`  
English: `/en/`

## Cloudflare Pages

The production site is deployed to the `mars-booster-site` Cloudflare Pages project.
Cloudflare is connected to the `MerielD/mars-booster-site` GitHub repository
and automatically deploys pushes to `main`.

Cloudflare build settings:

- Production branch: `main`
- Build command: `npm run build:pages`
- Build output directory: `pages-dist`
- Root directory: `/`

For a manual fallback deployment:

```bash
npm run deploy:pages
```

Canonical domain: `https://www.marsbooster.net`

The canonical hostname is proxied to Pages by a small domain Worker. The apex
`.net` domain and both `.global` hostnames are handled by the same Worker, so
every path and query string receives a permanent redirect to the canonical
domain:

```bash
npm run deploy:redirects
```

To generate the same static artifact locally:

```bash
npm run build:pages
```

The deployable output is written to `pages-dist/`. All routes and assets use repository-subpath-safe relative URLs.
