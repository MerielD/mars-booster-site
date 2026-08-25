# Mars Booster website v2

Bilingual, image-led company site based on the July 2026 Chinese and English company-profile decks.

## Local preview

```bash
npm ci
npm run dev
```

Chinese: `/zh/`  
English: `/en/`

## GitHub Pages

This directory is ready to be used as the root of a GitHub repository.

1. Push it to a repository whose default branch is `main`.
2. In the repository settings, choose **Pages → Source → GitHub Actions**.
3. The included `.github/workflows/deploy-pages.yml` workflow builds and publishes the site.

To generate the same static artifact locally:

```bash
npm run build:pages
```

The deployable output is written to `pages-dist/`. All routes and assets use repository-subpath-safe relative URLs.
