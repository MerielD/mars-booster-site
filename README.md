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

The production site is deployed to the `marsbooster` Cloudflare Pages project.

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

## GitHub Pages (legacy workflow)

This directory is ready to be used as the root of a GitHub repository.

1. Push it to a repository whose default branch is `main`.
2. In the repository settings, choose **Pages → Source → GitHub Actions**.
3. The included `.github/workflows/deploy-pages.yml` workflow builds and publishes the site.

To generate the same static artifact locally:

```bash
npm run build:pages
```

The deployable output is written to `pages-dist/`. All routes and assets use repository-subpath-safe relative URLs.
