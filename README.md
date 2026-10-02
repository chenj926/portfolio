# Jialuo (Eric) Chen — Portfolio

AI/ML research, software projects, and contact information. React 19, Chakra UI 2, and Create React App; existing project and publication detail routes use URL hashes.

## Local development

Use the Node.js version in [.node-version](.node-version), which is also used by CI.

```powershell
npm ci
npm start
```

Open http://localhost:3000/portfolio/. To check a release:

```powershell
$env:CI = "true"
npm test -- --watchAll=false --runInBand
npm run build
```

The deployment target is [GitHub Pages](https://chenj926.github.io/portfolio/) at `/portfolio/`. Building locally does not publish the site.

## Release workflow

Open a pull request into `main`. The **Test and build** job rejects unresolved merge conflicts, installs the lockfile with `npm ci`, runs the tests, and builds with `CI=true`. npm downloads are cached by the lockfile; newer PR runs cancel obsolete checks.

After merging, the workflow validates `main` and uploads that build as a short-lived Pages artifact. A separate **Deploy and verify** job uses GitHub's Pages/OIDC permissions and checks that the live `deployment.json` reports the deployed commit. Production runs are serialized, so a new push cannot interrupt an active deployment. The Actions page also supports a manual run on `main`.

Repository configuration: **Settings → Pages → Source: GitHub Actions**; the `github-pages` environment allows deployments from the `main` branch. The repository's default workflow token is read-only, with deployment permissions granted only to the deploy job. Action versions are pinned to commit SHAs and maintained by grouped Dependabot pull requests.

To roll back an application change, revert its commit through a new pull request and merge after validation. Re-running an old workflow would intentionally redeploy that old revision; use the current `main` workflow for a deployment retry.

## Change the current status

Edit **only `profile.currentStatus` in [src/data/profile.js](src/data/profile.js)**:

| Value           | Public label          |
| --------------- | --------------------- |
| `opportunities` | Open to opportunities |
| `collaborate`   | Open to collaborate   |
| `communicate`   | Open to communicate   |
| `vacation`      | Currently on vacation |

The page displays one status. Visitors cannot select a status, and it never rotates automatically. Light and dark icon materials follow the visitor's theme. Each option has a label and sprite position; there is no role subtitle. The opportunities state uses a quiet green glow and overlapping layers.

The same file owns the homepage biography, email, social destinations (including Google Scholar), and document imports. The CV is `src/assets/resume/Jialuo_Chen_CV.pdf`; Resume is a separate document.

## Design and assets

Design drafts, publication proposals, and local review records are excluded from Git. Production artwork, document downloads, fonts, and their licenses remain versioned with the application.

The production homepage uses WebP artwork and locally hosted OFL fonts. `Material` owns shared control optics and pointer feedback: opaque porcelain in light mode, translucent glass with progressive SVG edge refraction in dark mode. Small displacement maps are cached and rebuilt only on resize. Pointer work is coalesced into one animation frame; no permanent render loop or 3D dependency is added. Flowers greet briefly when first visible and respond to pointer entry; reduced motion disables both. Temporary browser screenshots are removed after review.
