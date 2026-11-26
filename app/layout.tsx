import "@fontsource/albert-sans/400.css";
import "@fontsource/albert-sans/500.css";
import "@fontsource/albert-sans/600.css";
import "@fontsource/dm-mono/400.css";
import "@fontsource/noto-serif-sc/400.css";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import KitRuntime from "@/components/KitRuntime";
import { url } from "@/lib/site";
import { validateContent } from "@/lib/validate";

const SITE = "https://chenj926.github.io/portfolio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Jialuo Chen: AI researcher and engineer in Toronto",
  description:
    "Jialuo (Eric) Chen, AI researcher and engineer in Toronto: first author of HMITL at IEEE ICHI 2026, working on XR World Models, Surgical DeltaNet for linear attention and Bayesian optimization under uncertainty, and builder of an XR capstone with Magna, NeuroCommute and LineToLive.",
  icons: { icon: [{ url: url("/favicon.svg"), type: "image/svg+xml" }] },
  // absolute: metadataBase already holds /portfolio, so a base-path URL would double it
  openGraph: { type: "website", images: [{ url: `${SITE}/share.jpg`, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#141c29" },
  ],
};

// the palette start.mjs printed for the client's own colours (宣纸 and 墨), kept as printed
const BRAND = `:root {
  --p-bg: #f4f3ef; --p-surface: #eae8e2; --p-ink: #1b1a18; --p-muted: #69655e;
  --p-accent: #1b1a18; --p-accent-ink: #f4f3ef; --p-action: #1b1a18; --p-action-ink: #f4f3ef;
  --p-inv-bg: #1b1a18; --p-inv-surface: #272624; --p-inv-ink: #f4f3ef; --p-inv-muted: #999895;
  --p-inv-accent: #f4f3ef; --p-inv-accent-ink: #1b1a18; --p-inv-action: #f4f3ef; --p-inv-action-ink: #1b1a18;
  --font-display: "Albert Sans", system-ui, sans-serif;
  --font-text: "Albert Sans", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --display-weight: 500;
  --display-tracking: -0.025em;
  --display-tracking-xl: -0.035em;
}`;

// before the first paint: the grade the visitor chose (or their system's), the hero's words waiting for
// motion.js (motion.md), and the moments' guard (moments.md)
// The grade is kept twice: in localStorage, and in the tab's window.name, which survives the move from page to
// page where storage is refused or forgotten (a framed preview, a private window). The tab's own last choice
// wins, then the stored one, then the system's.
const HEAD = `(function(){var d=document.documentElement,t=null,m=/(?:^|;)jc-theme=(light|dark)/.exec(window.name||"");if(m)t=m[1];if(!t){try{t=localStorage.getItem("jc-theme")}catch(e){}}if(t!=="light"&&t!=="dark"){try{t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}catch(e){t="light"}}d.dataset.theme=t})();document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700);document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)`;

const KIT_CSS = ["/assets/system.css", "/assets/ui/cards.css", "/assets/motion/motion.css", "/assets/layout/layout.css", "/assets/icons/icon.css"];
const KIT_JS = ["/assets/system.js", "/assets/motion/motion.js", "/assets/layout/layout.js", "/assets/moments/moments.js", "/assets/moments/lib.js"];

export default function RootLayout({ children }: { children: ReactNode }) {
  validateContent();
  return (
    <html lang="en" data-type="software" data-radius="soft" data-buttons="solid" data-motion="" suppressHydrationWarning>
      <head>
        {/* a preview build only (NEXT_PUBLIC_PREVIEW=1): scripts/relativize.mjs sets each page's own way back to
            the site's root here, so the site runs under any path (an artifact, a review link) */}
        {process.env.NEXT_PUBLIC_PREVIEW === "1" && <base href="__SITE_ROOT__" />}
        <meta name="site-kind" content="software" />
        <meta name="page-type" content="software" />
        {KIT_CSS.map((h) => (
          <link key={h} rel="stylesheet" href={url(h)} />
        ))}
        <style dangerouslySetInnerHTML={{ __html: BRAND }} />
        <link rel="stylesheet" href={url("/site.css")} />
        <script dangerouslySetInnerHTML={{ __html: HEAD }} />
        {KIT_JS.map((h) => (
          <link key={h} rel="modulepreload" href={url(h)} />
        ))}
      </head>
      <body>
        {children}
        <KitRuntime />
      </body>
    </html>
  );
}
