# Jialuo (Eric) Chen — Portfolio

AI/ML research, software projects, and contact information. React 19, Chakra UI 2, and Create React App; existing project and publication detail routes use URL hashes.

## Local development

```powershell
npm install
npm start
```

Open http://localhost:3000/portfolio/. To check a release:

```powershell
$env:CI = "true"
npm test -- --watchAll=false --runInBand
npm run build
```

The existing deployment target is GitHub Pages at `/portfolio/`. Building does not publish the site.

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
