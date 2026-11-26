# Jialuo (Eric) Chen — Portfolio

Research, projects, CV and contact for Jialuo (Eric) Chen, live at https://chenj926.github.io/portfolio/.
A Next.js 16 App Router site with React 19 and TypeScript, built as a static export for GitHub Pages.

## Local development

Use the Node.js version in [.node-version](.node-version), which CI uses too.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run typecheck
npm run build      # checks the content, then writes the static site to out/
npm run preview    # optional: a copy in preview/ that finds its files by relative path, for any host path
```

`npm run build` regenerates the brand icons first (`scripts/build-icons.mjs`) and then checks the content
(`lib/validate.ts`): a missing picture, icon or page link stops the build with a plain message.

## Adding content

Every project, paper, research position, job, degree and news item is one entry in `content/*.ts`; the pages,
the menus and the footer are built from those files. The templates and the steps for pictures, the CV and icons
are in [docs/ADDING-CONTENT.md](docs/ADDING-CONTENT.md).

## Layout

- `app/`: the pages (home, research, projects, about, cv, and the detail pages generated from the content)
- `components/`: the header and footer, tiles, pictures, diagrams, the hero painting and the CV reader
- `content/`: the site's data
- `lib/`: site helpers, the hero painter and the content check
- `public/`: pictures, documents, icons, the site's CSS and the design kit in `public/assets`
- `scripts/`: icons, pictures, the CV's page images and the preview copy

## Release workflow

Open a pull request into `main`. The **Test and build** job rejects unresolved merge conflicts, installs the
lockfile with `npm ci`, checks types and builds the static export with `SITE_BASE_PATH=/portfolio`. Newer PR runs
cancel obsolete checks.

After merging, the workflow builds `main` and uploads it as a short-lived Pages artifact. A separate **Deploy and
verify** job uses GitHub's Pages/OIDC permissions and checks that the live `deployment.json` reports the deployed
commit. Production runs are serialized, so a new push cannot interrupt an active deployment. The Actions page also
supports a manual run on `main`.

Repository configuration: **Settings → Pages → Source: GitHub Actions**; the `github-pages` environment allows
deployments from the `main` branch. To roll back, revert the commit through a new pull request and merge it after
validation.

## Privacy

The published CV and résumé leave out the phone number and street address. `scripts/doc-pages.py` refuses a PDF
that still holds either before it renders the pages.
