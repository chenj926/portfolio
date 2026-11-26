// Writes the real brand icons the site names into public/icons, in their own colours.
// Sources (both CC0 drawings, both from npm so the build needs no CDN): the gilbarbara "logos" set through
// @iconify-json/logos first, simple-icons painted in the brand hex only where no colour mark exists.
// Every mark stays its owner's trademark (nominative use); the footer says so.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const logos = JSON.parse(readFileSync(require.resolve("@iconify-json/logos/icons.json"), "utf8"));
const si = await import("simple-icons");

// name on the site -> source; "ink" marks are black and turn light on the dark grade
export const ICONS = {
  "google-scholar": "si:siGooglescholar",
  github: "logos:github-icon:ink",
  linkedin: "logos:linkedin-icon",
  instagram: "si-gradient:siInstagram",
  rednote: "si:siXiaohongshu",
  reddit: "logos:reddit-icon",
  python: "logos:python",
  pytorch: "logos:pytorch-icon",
  react: "logos:react",
  typescript: "logos:typescript-icon",
  javascript: "logos:javascript",
  fastapi: "logos:fastapi-icon",
  spring: "logos:spring-icon",
  java: "logos:java",
  csharp: "logos:c-sharp",
  dotnet: "logos:dotnet",
  postgresql: "logos:postgresql",
  docker: "logos:docker-icon",
  git: "logos:git-icon",
  linux: "logos:linux-tux",
  numpy: "logos:numpy",
  pandas: "logos:pandas-icon",
  "scikit-learn": "si:siScikitlearn",
  opencv: "logos:opencv",
  jupyter: "logos:jupyter",
  chrome: "logos:chrome",
  claude: "logos:claude-icon",
  openai: "logos:openai-icon:ink",
  "hugging-face": "logos:hugging-face-icon",
  openstreetmap: "si:siOpenstreetmap",
  qwen: "si:siQwen",
  langchain: "si:siLangchain",
  c: "logos:c",
  r: "logos:r-lang",
  shopify: "logos:shopify",
  jira: "logos:jira",
  meta: "logos:meta-icon",
  kotlin: "logos:kotlin-icon",
  cpp: "logos:c-plusplus",
};

const out = "public/icons";
mkdirSync(out, { recursive: true });
const credits = [];
for (const [name, spec] of Object.entries(ICONS)) {
  const [set, id, tone] = spec.split(":");
  let svg;
  if (set === "logos") {
    const ic = logos.icons[id];
    if (!ic) throw new Error(`logos:${id} is not in @iconify-json/logos`);
    const w = ic.width ?? logos.width ?? 256, h = ic.height ?? logos.height ?? 256;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${tone ? ' data-ic="ink"' : ""}>${ic.body}</svg>`;
    credits.push({ file: `${name}.svg`, set: "logos (gilbarbara/logos via @iconify-json/logos)", licence: "CC0-1.0", trademark: true });
  } else if (set === "si-gradient") {
    // the glyph in the app's own gradient (yellow at the lower left through orange and magenta to blue), as
    // Instagram's brand pages show it; no colour mark of it exists in either set
    const ic = si[id];
    if (!ic) throw new Error(`simple-icons ${id} is missing`);
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><defs><radialGradient id="g" cx="0.3" cy="1.07" r="1.2"><stop offset="0" stop-color="#fdf497"/><stop offset="0.05" stop-color="#fdf497"/><stop offset="0.45" stop-color="#fd5949"/><stop offset="0.6" stop-color="#d6249f"/><stop offset="0.9" stop-color="#285aeb"/></radialGradient></defs><path fill="url(#g)" d="${ic.path}"/></svg>`;
    credits.push({ file: `${name}.svg`, set: `simple-icons (${ic.title}), in the brand's gradient`, licence: "CC0-1.0", trademark: true });
  } else {
    const ic = si[id];
    if (!ic) throw new Error(`simple-icons ${id} is missing`);
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#${ic.hex}" d="${ic.path}"/></svg>`;
    credits.push({ file: `${name}.svg`, set: `simple-icons (${ic.title})`, licence: "CC0-1.0", trademark: true });
  }
  writeFileSync(`${out}/${name}.svg`, svg);
}
writeFileSync(`${out}/icons-credits.json`, JSON.stringify(credits, null, 2));
console.log(`icons: ${Object.keys(ICONS).length} written to ${out}`);
