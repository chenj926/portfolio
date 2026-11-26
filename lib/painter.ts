// The hero's one effect: a wintersweet (腊梅) branch in ink whose blossoms open by softmax attention to
// the pointer, the pointer being the query and every blossom a key. Pure drawing code: it runs in the
// browser on a <canvas> and in Node (@napi-rs/canvas) to print the still posters.

export type Theme = "light" | "dark";
type Ctx = CanvasRenderingContext2D;
type Pt = { x: number; y: number };
type StrokePt = { x: number; y: number; w: number };

export interface CanvasLike {
  width: number;
  height: number;
  getContext(kind: "2d"): Ctx | null;
}

export interface PainterOptions {
  width: number;
  height: number;
  dpr: number;
  theme: Theme;
  makeCanvas: (w: number, h: number) => CanvasLike;
  /** on a screen held upright: the y above which the branch must not reach (the foot of the words) */
  safeTop?: number;
  /** on a wide screen: the y below which the branch must not reach (the top of the hero's foot band), left of
      safeRight (the band's right end); the branch may hang lower beyond it */
  safeBottom?: number;
  safeRight?: number;
}

interface Flower {
  x: number;
  y: number;
  rot: number;
  size: number;
  kind: 0 | 1 | 2; // 0 open with a dark heart, 1 open and plain, 2 seen from the side
  base: number; // resting openness
  open: number;
  target: number;
  delay: number; // entrance order, 0..1
  weight: number;
  cool: number;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  life: number;
  size: number;
}

interface Stroke {
  pts: StrokePt[];
  start: number;
  seed: number;
  dry: number; // how fast the brush runs dry along this stroke
}

const LEVELS = 12;

const INK: Record<Theme, { branch: [number, number, number]; wash: number; hair: number; moss: number }> = {
  light: { branch: [22, 19, 16], wash: 0.38, hair: 0.84, moss: 0.9 },
  dark: { branch: [200, 190, 172], wash: 0.16, hair: 0.5, moss: 0.62 },
};

// wax yellow petals with a fine outline (双勾), a dark purple heart (檀心) on half of them
const PETAL: Record<Theme, { fill0: string; fill1: string; line: string; heart: string; calyx: string; stamen: string; glow: string; blur: number }> = {
  light: { fill0: "rgba(230,180,58,0.95)", fill1: "rgba(246,222,150,0.84)", line: "rgba(122,88,42,0.6)", heart: "rgba(98,36,30,0.92)", calyx: "rgba(74,56,40,0.9)", stamen: "rgba(118,70,24,0.95)", glow: "rgba(0,0,0,0)", blur: 0 },
  dark: { fill0: "rgba(236,188,70,0.96)", fill1: "rgba(250,228,160,0.9)", line: "rgba(255,236,186,0.45)", heart: "rgba(150,58,42,0.95)", calyx: "rgba(150,124,96,0.9)", stamen: "rgba(255,226,150,0.95)", glow: "rgba(240,190,80,0.4)", blur: 12 },
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// smooth 1D value noise, for brush hairs that run dry in streaks rather than in dots
function noise1(seed: number) {
  const R = rng(seed);
  const v = Array.from({ length: 64 }, () => R());
  return (t: number) => {
    const x = t * 9, i = Math.floor(x), f = x - i;
    const a = v[((i % 64) + 64) % 64], b = v[(((i + 1) % 64) + 64) % 64];
    const u = f * f * (3 - 2 * f);
    return a + (b - a) * u;
  };
}

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

// a polyline through control points with gently rounded corners (梅枝 turn sharply), resampled to n points
function brushPath(ctrl: Pt[], n: number, w0: number, w1: number): StrokePt[] {
  const dense: Pt[] = [];
  for (let k = 0; k < ctrl.length - 1; k++) {
    const a = ctrl[k], b = ctrl[k + 1];
    for (let i = 0; i < 12; i++) {
      const t = i / 12;
      dense.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  dense.push(ctrl[ctrl.length - 1]);
  // soften the corners with two passes of a small moving average
  for (let pass = 0; pass < 2; pass++)
    for (let i = 1; i < dense.length - 1; i++) {
      dense[i] = { x: (dense[i - 1].x + dense[i].x * 2 + dense[i + 1].x) / 4, y: (dense[i - 1].y + dense[i].y * 2 + dense[i + 1].y) / 4 };
    }
  let total = 0;
  const acc = [0];
  for (let i = 1; i < dense.length; i++) {
    total += Math.hypot(dense[i].x - dense[i - 1].x, dense[i].y - dense[i - 1].y);
    acc.push(total);
  }
  const out: StrokePt[] = [];
  let j = 0;
  for (let i = 0; i <= n; i++) {
    const d = (i / n) * total;
    while (j < acc.length - 2 && acc[j + 1] < d) j++;
    const seg = acc[j + 1] - acc[j] || 1;
    const t = (d - acc[j]) / seg;
    const f = i / n;
    out.push({
      x: dense[j].x + (dense[j + 1].x - dense[j].x) * t,
      y: dense[j].y + (dense[j + 1].y - dense[j].y) * t,
      w: w0 + (w1 - w0) * Math.pow(f, 0.7),
    });
  }
  return out;
}

export class WintersweetPainter {
  private o: PainterOptions;
  private W = 0;
  private H = 0;
  private strokes: Stroke[] = [];
  private moss: { x: number; y: number; r: number; at: number }[] = [];
  private flowers: Flower[] = [];
  private petals: Petal[] = [];
  private sprites: CanvasLike[][] = []; // [kind][level]
  private petalSprite: CanvasLike | null = null;
  private branchLayer: CanvasLike | null = null;
  private q: Pt | null = null;
  private qSeen = 0; // seconds since the pointer last moved
  private threadAlpha = 0;
  private scale = 1;
  portrait = false;

  constructor(o: PainterOptions) {
    this.o = o;
    this.resize(o.width, o.height, o.dpr);
  }

  setTheme(theme: Theme) {
    this.o.theme = theme;
    this.buildSprites();
    this.branchLayer = null;
  }

  resize(width: number, height: number, dpr: number, safeTop = this.o.safeTop ?? 0, safeBottom = this.o.safeBottom ?? 0, safeRight = this.o.safeRight ?? 0) {
    this.o.width = width;
    this.o.height = height;
    this.o.dpr = dpr;
    this.o.safeTop = safeTop;
    this.o.safeBottom = safeBottom;
    this.o.safeRight = safeRight;
    this.W = width;
    this.H = height;
    this.compose(1);
    // upright: every point sits at H - (0.2 + v) * s, so its distance from the foot scales with s; one
    // second pass shrinks the branch about its anchor until its highest twig or blossom clears safeTop
    if (this.portrait && safeTop > 0) {
      let top = Infinity;
      for (const st of this.strokes) for (const q of st.pts) top = Math.min(top, q.y - q.w);
      for (const f of this.flowers) top = Math.min(top, f.y - this.scale * 0.03);
      if (top < safeTop) this.compose(Math.max(0.35, (this.H - safeTop) / (this.H - top)));
    }
    // wide: every point sits at (0.12 + v) * s below the top, so its depth scales with s; the same second
    // pass shrinks the branch until its lowest twig or blossom stays above safeBottom
    if (!this.portrait && safeBottom > 0) {
      const over = (x: number) => !safeRight || x < safeRight;
      let foot = 0;
      for (const st of this.strokes) for (const q of st.pts) if (over(q.x - q.w)) foot = Math.max(foot, q.y + q.w);
      for (const f of this.flowers) if (over(f.x - this.scale * 0.03)) foot = Math.max(foot, f.y + this.scale * 0.03);
      if (foot > safeBottom) this.compose(Math.max(0.5, safeBottom / foot));
    }
    this.buildSprites();
    this.branchLayer = null;
  }

  // ------------------------------------------------------------------ composition
  private compose(fit: number) {
    const W = this.W, H = this.H;
    this.portrait = W / H < 0.95;
    const R = rng(1216);
    this.strokes = [];
    this.moss = [];
    this.flowers = [];
    // sized from the hero and anchored to one side: the branch enters from the right edge near the top on a
    // wide screen (the words sit on the left), from the right edge near the foot on a phone held upright
    const s = (this.portrait ? Math.min(W * 1.05, H * 0.62) : Math.min(W * 0.6, H * 1.05)) * fit;
    this.scale = s;
    const ax = W + s * 0.03;
    const ay = this.portrait ? H - s * 0.2 : s * 0.12;
    const fy = this.portrait ? -1 : 1;
    const P = (u: number, v: number): Pt => ({ x: ax - u * s, y: ay + fy * v * s });

    let order = 0;
    let seed = 11;
    const add = (ctrl: Pt[], w0: number, w1: number, dry: number, n = 48) => {
      const pts = brushPath(ctrl, n, w0 * s, w1 * s);
      this.strokes.push({ pts, start: order, seed: (seed += 17), dry });
      order += 0.07;
      return pts;
    };
    const flower = (p: Pt, size: number, delay: number, kind?: 0 | 1 | 2, bud = false) => {
      if (p.x < 4 || p.x > W - 4 || p.y < 4 || p.y > H - 4) return;
      for (const f of this.flowers) if (Math.hypot(f.x - p.x, f.y - p.y) < s * 0.022) return;
      const k = kind ?? (R() < 0.42 ? 2 : R() < 0.55 ? 0 : 1);
      const base = bud ? 0.1 + R() * 0.12 : 0.4 + R() * 0.32;
      this.flowers.push({ x: p.x, y: p.y, rot: (R() - 0.5) * 1.6 + (k === 2 ? -0.4 : 0), size: size * (0.85 + R() * 0.3), kind: k as 0 | 1 | 2, base, open: base, target: base, delay, weight: 0, cool: 0 });
    };
    const at = (pts: StrokePt[], t: number) => pts[Math.max(0, Math.min(pts.length - 1, Math.round(t * (pts.length - 1))))];
    const normal = (pts: StrokePt[], t: number) => {
      const i = Math.max(0, Math.min(pts.length - 2, Math.round(t * (pts.length - 1))));
      const dx = pts[i + 1].x - pts[i].x, dy = pts[i + 1].y - pts[i].y, l = Math.hypot(dx, dy) || 1;
      return { x: -dy / l, y: dx / l, ang: Math.atan2(dy, dx) };
    };
    // blossoms cluster along a twig: pairs on either side, buds towards the tip
    const bloomAlong = (pts: StrokePt[], from: number, to: number, count: number, delay0: number) => {
      for (let i = 0; i < count; i++) {
        const t = from + ((to - from) * (i + R() * 0.6)) / count;
        const p = at(pts, t), nm = normal(pts, t);
        const side = i % 2 ? 1 : -1;
        const off = s * (0.008 + R() * 0.006) * side;
        const tip = t > 0.88;
        flower({ x: p.x + nm.x * off, y: p.y + nm.y * off }, tip ? 0.8 : 1, delay0 + t * 0.4, undefined, tip || R() < 0.18);
      }
    };
    // a twig leaves its parent at an angle and runs nearly straight (new wood on a plum tree does)
    const twig = (parent: StrokePt[], t: number, side: number, len: number, w: number, blooms: number) => {
      const p = at(parent, t), nm = normal(parent, t);
      const ang = nm.ang + side * (0.5 + R() * 0.5);
      const L = len * s;
      const mid = { x: p.x + Math.cos(ang) * L * 0.55, y: p.y + Math.sin(ang) * L * 0.55 };
      const a2 = ang + (R() - 0.5) * 0.5;
      const end = { x: mid.x + Math.cos(a2) * L * 0.45, y: mid.y + Math.sin(a2) * L * 0.45 };
      const d0 = order;
      const pts = add([p, mid, end], w, 0.0012, 0.9, 22);
      if (R() < 0.5) this.moss.push({ x: p.x + nm.x * p.w * 0.5, y: p.y + nm.y * p.w * 0.5, r: Math.max(1, p.w * 0.16), at: d0 });
      bloomAlong(pts, 0.25, 1, blooms, d0);
    };

    // the wood: an old limb entering from the edge with sharp elbows, one limb falling, one long new shoot
    // reaching up and left; only twigs and blossoms come from the seeded generator
    const main = add([P(-0.05, 0.02), P(0.1, 0.07), P(0.2, 0.21), P(0.34, 0.24), P(0.47, 0.37), P(0.63, 0.41), P(0.76, 0.52)], 0.05, 0.003, 0.5, 70);
    const fall = add([at(main, 0.36), P(0.3, 0.42), P(0.34, 0.58), P(0.29, 0.74)], 0.02, 0.002, 0.7, 40);
    const shoot = add([at(main, 0.5), P(0.43, 0.15), P(0.55, 0.02), P(0.66, -0.06)], 0.012, 0.0015, 0.85, 36);
    const spur = add([at(main, 0.18), P(0.12, 0.25), P(0.09, 0.36)], 0.014, 0.0016, 0.75, 22);
    for (const [pts, t] of [[main, 0.18], [main, 0.36], [main, 0.5], [main, 0.66]] as [StrokePt[], number][]) {
      const p = at(pts, t);
      for (let k = 0; k < 3; k++) this.moss.push({ x: p.x + (R() - 0.5) * p.w * 1.2, y: p.y + (R() - 0.5) * p.w * 1.2, r: Math.max(0.9, p.w * (0.08 + R() * 0.08)), at: 0.1 });
    }
    twig(main, 0.3, -1, 0.11, 0.0045, 3);
    twig(main, 0.44, 1, 0.1, 0.004, 3);
    twig(main, 0.58, -1, 0.12, 0.0036, 4);
    twig(main, 0.72, 1, 0.09, 0.003, 3);
    twig(main, 0.86, -1, 0.08, 0.0026, 2);
    twig(fall, 0.45, 1, 0.09, 0.003, 3);
    twig(fall, 0.75, -1, 0.07, 0.0026, 2);
    twig(shoot, 0.4, -1, 0.07, 0.0026, 2);
    twig(shoot, 0.7, 1, 0.06, 0.0022, 2);
    twig(spur, 0.6, 1, 0.06, 0.0026, 2);
    bloomAlong(main, 0.62, 1, 5, 0.3);
    bloomAlong(fall, 0.3, 1, 5, 0.35);
    bloomAlong(shoot, 0.35, 1, 4, 0.4);
    bloomAlong(spur, 0.4, 1, 3, 0.25);

    const maxStart = order || 1;
    for (const st of this.strokes) st.start /= maxStart;
    for (const m of this.moss) m.at = clamp(m.at / maxStart);
    for (const f of this.flowers) f.delay = clamp(f.delay / (maxStart + 0.4));
  }

  // ------------------------------------------------------------------ sprites
  private flowerRadius() {
    return Math.max(6, this.scale * 0.0175);
  }

  private buildSprites() {
    const { dpr, theme, makeCanvas } = this.o;
    const r = this.flowerRadius();
    const pal = PETAL[theme];
    const pad = pal.blur ? pal.blur * 1.5 : 3;
    const size = Math.ceil((r * 2.8 + pad * 2) * dpr);
    this.sprites = [];
    for (let kind = 0; kind < 3; kind++) {
      const row: CanvasLike[] = [];
      for (let l = 0; l < LEVELS; l++) {
        const c = makeCanvas(size, size);
        const g = c.getContext("2d")!;
        g.translate(size / 2, size / 2);
        g.scale(dpr, dpr);
        this.drawBlossom(g, r, l / (LEVELS - 1), kind as 0 | 1 | 2, theme);
        row.push(c);
      }
      this.sprites.push(row);
    }
    const ps = Math.ceil(r * 1.3 * dpr);
    const pc = makeCanvas(ps, ps);
    const pg = pc.getContext("2d")!;
    pg.translate(ps / 2, ps / 2);
    pg.scale(dpr, dpr);
    this.petalShape(pg, 0, 0, r * 0.3, r * 0.46, 0, pal);
    this.petalSprite = pc;
  }

  private petalShape(g: Ctx, x: number, y: number, rx: number, ry: number, rot: number, pal: (typeof PETAL)[Theme]) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    const grad = g.createLinearGradient(0, ry, 0, -ry);
    grad.addColorStop(0, pal.fill0);
    grad.addColorStop(1, pal.fill1);
    g.fillStyle = grad;
    g.beginPath();
    // a rounded petal, a little wider at the tip than at the base
    g.moveTo(0, ry);
    g.bezierCurveTo(rx * 1.15, ry * 0.55, rx * 1.05, -ry * 0.95, 0, -ry);
    g.bezierCurveTo(-rx * 1.05, -ry * 0.95, -rx * 1.15, ry * 0.55, 0, ry);
    g.fill();
    g.strokeStyle = pal.line;
    g.lineWidth = Math.max(0.45, rx * 0.09);
    g.stroke();
    g.restore();
  }

  // one wintersweet flower: a closed bud below a quarter open, then a cup that opens; seen from the front
  // (kinds 0 and 1) or from the side (kind 2)
  private drawBlossom(g: Ctx, r: number, open: number, kind: 0 | 1 | 2, theme: Theme) {
    const pal = PETAL[theme];
    if (pal.blur) {
      g.shadowColor = pal.glow;
      g.shadowBlur = pal.blur * (0.35 + open * 0.65);
    }
    const calyx = () => {
      g.shadowBlur = 0;
      g.fillStyle = pal.calyx;
      for (let i = -1; i <= 1; i++) {
        g.beginPath();
        g.ellipse(i * r * 0.1, r * 0.42, r * 0.09, r * 0.13, i * 0.5, 0, Math.PI * 2);
        g.fill();
      }
    };
    if (open < 0.25) {
      const k = 0.55 + open * 1.6;
      this.petalShape(g, 0, -r * 0.05, r * 0.3 * k, r * 0.4 * k, 0, pal);
      calyx();
      return;
    }
    const o = (open - 0.25) / 0.75;
    if (kind === 2) {
      // from the side: a cup of three petals that opens outward
      const spread = 0.2 + o * 0.8;
      this.petalShape(g, -r * 0.2 * spread, -r * 0.1, r * 0.3, r * 0.52, -0.5 * spread, pal);
      this.petalShape(g, r * 0.2 * spread, -r * 0.1, r * 0.3, r * 0.52, 0.5 * spread, pal);
      this.petalShape(g, 0, -r * 0.05, r * 0.32, r * 0.5, 0, pal);
      if (o > 0.4) {
        g.shadowBlur = 0;
        g.fillStyle = pal.heart;
        g.beginPath();
        g.ellipse(0, -r * 0.2, r * 0.1 * o, r * 0.14 * o, 0, 0, Math.PI * 2);
        g.fill();
      }
      calyx();
      return;
    }
    const n = 6;
    const spread = 0.3 + o * 0.7;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (i % 2) * 0.12;
      const len = r * (0.4 + 0.12 * spread);
      this.petalShape(g, Math.sin(a) * len * spread * 0.95, -Math.cos(a) * len * spread * 0.95, r * (0.24 + 0.08 * spread), len, a, pal);
    }
    g.shadowBlur = 0;
    const ir = r * (0.2 + 0.08 * o);
    if (kind === 0) {
      g.fillStyle = pal.heart;
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        g.beginPath();
        g.ellipse(Math.sin(a) * ir * 0.4, -Math.cos(a) * ir * 0.4, ir * 0.28, ir * 0.42, a, 0, Math.PI * 2);
        g.fill();
      }
    }
    g.fillStyle = pal.stamen;
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.6;
      g.beginPath();
      g.arc(Math.sin(a) * ir * 0.22, -Math.cos(a) * ir * 0.22, Math.max(0.45, r * 0.035), 0, Math.PI * 2);
      g.fill();
    }
  }

  // ------------------------------------------------------------------ branches
  // a brush of many hairs: each hair keeps its own share of ink and runs dry in streaks, the edges first and
  // more towards the end of the stroke, which leaves the broken white of a dry brush (飞白)
  private drawStroke(g: Ctx, st: Stroke, upto: number) {
    const ink = INK[this.o.theme];
    const [r, gg, b] = ink.branch;
    const pts = st.pts;
    const n = Math.max(2, Math.floor(pts.length * upto));
    const maxW = pts[0].w;
    const R = rng(st.seed);
    // a light wash under the hairs gives the stroke its body
    g.fillStyle = `rgba(${r},${gg},${b},${ink.wash})`;
    g.beginPath();
    const L: Pt[] = [], Rt: Pt[] = [];
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)];
      let dx = q.x - o.x, dy = q.y - o.y;
      const l = Math.hypot(dx, dy) || 1;
      dx /= l; dy /= l;
      const fade = 1 - (i / (pts.length - 1)) * 0.35;
      const hw = p.w * 0.5 * fade;
      L.push({ x: p.x - dy * hw, y: p.y + dx * hw });
      Rt.push({ x: p.x + dy * hw, y: p.y - dx * hw });
    }
    g.moveTo(L[0].x, L[0].y);
    for (const p of L) g.lineTo(p.x, p.y);
    for (let i = Rt.length - 1; i >= 0; i--) g.lineTo(Rt[i].x, Rt[i].y);
    g.closePath();
    g.fill();

    const hairs = Math.max(2, Math.min(22, Math.round(maxW / 1.1)));
    g.lineCap = "round";
    for (let h = 0; h < hairs; h++) {
      const u = hairs === 1 ? 0 : h / (hairs - 1) - 0.5;
      const edge = Math.abs(u) * 2; // 0 in the middle of the brush, 1 at its edge
      const nz = noise1(st.seed * 31 + h * 7);
      const jit = noise1(st.seed * 53 + h * 11);
      const alpha = ink.hair * (0.3 + R() * 0.7) * (1 - edge * 0.3);
      g.strokeStyle = `rgba(${r},${gg},${b},${alpha.toFixed(3)})`;
      let pen = false;
      g.beginPath();
      for (let i = 0; i < n; i++) {
        const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)];
        let dx = q.x - p.x, dy = q.y - p.y;
        const l = Math.hypot(dx, dy) || 1;
        dx /= l; dy /= l;
        const t = i / (pts.length - 1);
        const dryness = st.dry * (0.25 + t * 0.85) * (0.35 + edge * 0.9);
        const inked = nz(t + h * 0.37) > dryness;
        const off = u * 0.92 + (jit(t * 1.7) - 0.5) * 0.09;
        const x = p.x - dy * p.w * off, y = p.y + dx * p.w * off;
        if (!inked) { if (pen) { g.stroke(); g.beginPath(); pen = false; } continue; }
        g.lineWidth = Math.max(0.55, (p.w / hairs) * 2.6);
        if (!pen) { g.moveTo(x, y); pen = true; } else g.lineTo(x, y);
      }
      if (pen) g.stroke();
    }
  }

  private paintBranches(g: Ctx, t: number) {
    for (const st of this.strokes) {
      const local = clamp((t - st.start * 0.65) / 0.35);
      if (local > 0) this.drawStroke(g, st, easeOut(local));
    }
    const ink = INK[this.o.theme];
    const [r, gg, b] = ink.branch;
    // moss dots (点苔) along the old wood
    for (const m of this.moss) {
      if (t < m.at * 0.65 + 0.3) continue;
      g.fillStyle = `rgba(${r},${gg},${b},${ink.moss})`;
      g.beginPath();
      g.ellipse(m.x, m.y, m.r, m.r * 0.72, 0.4, 0, Math.PI * 2);
      g.fill();
    }
  }

  // ------------------------------------------------------------------ attention
  // the pointer is the query, each blossom a key: weights are a softmax over -distance^2 / (2 sigma^2) / tau;
  // openness follows the weight, relative to the strongest key
  setQuery(p: Pt | null) {
    this.q = p;
    if (p) this.qSeen = 0;
    const F = this.flowers;
    if (!F.length) return;
    if (!this.q) {
      for (const f of F) { f.target = f.base; f.weight = 0; }
      return;
    }
    const sigma = this.scale * 0.15;
    const tau = 0.6;
    let mx = -Infinity;
    const sc = F.map((f) => {
      const d2 = (f.x - this.q!.x) ** 2 + (f.y - this.q!.y) ** 2;
      const v = -d2 / (2 * sigma * sigma) / tau;
      if (v > mx) mx = v;
      return v;
    });
    let sum = 0;
    const ex = sc.map((v) => { const e = Math.exp(v - mx); sum += e; return e; });
    let top = 0;
    F.forEach((f, i) => { f.weight = ex[i] / sum; if (f.weight > top) top = f.weight; });
    for (const f of F) {
      const rel = top > 0 ? Math.pow(f.weight / top, 0.5) : 0;
      f.target = clamp(f.base + (1 - f.base) * rel);
    }
  }

  // advance by dt seconds; returns true while anything is still moving
  step(dt: number): boolean {
    let moving = false;
    const k = 1 - Math.exp(-dt * 6);
    for (const f of this.flowers) {
      const d = f.target - f.open;
      if (Math.abs(d) > 0.002) { f.open += d * k; moving = true; } else f.open = f.target;
      f.cool = Math.max(0, f.cool - dt);
      if (this.q && f.open > 0.95 && f.cool === 0 && this.petals.length < 6) {
        f.cool = 3;
        this.petals.push({ x: f.x, y: f.y, vx: (Math.random() - 0.5) * 12, vy: 12 + Math.random() * 14, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 1.6, life: 0, size: 0.8 + Math.random() * 0.4 });
      }
    }
    if (this.q) {
      this.qSeen += dt;
      const want = this.qSeen < 1.4 ? 1 : 0;
      this.threadAlpha += (want - this.threadAlpha) * (1 - Math.exp(-dt * 5));
      if (this.qSeen > 2.4) this.setQuery(null);
      moving = true;
    } else if (this.threadAlpha > 0.01) {
      this.threadAlpha *= Math.exp(-dt * 5);
      moving = true;
    } else this.threadAlpha = 0;
    for (const p of this.petals) {
      p.life += dt;
      p.x += (p.vx + Math.sin(p.life * 2.2) * 9) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
    this.petals = this.petals.filter((p) => p.life < 3 && p.y < this.H + 20);
    if (this.petals.length) moving = true;
    return moving;
  }

  // draw everything; intro runs 0..1 on load (1 = the finished painting)
  draw(g: Ctx, intro = 1) {
    const { dpr } = this.o;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, this.W * dpr, this.H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (intro >= 1) {
      if (!this.branchLayer) {
        const c = this.o.makeCanvas(Math.ceil(this.W * dpr), Math.ceil(this.H * dpr));
        const bg = c.getContext("2d")!;
        bg.scale(dpr, dpr);
        this.paintBranches(bg, 1);
        this.branchLayer = c;
      }
      g.save();
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.drawImage(this.branchLayer as unknown as CanvasImageSource, 0, 0);
      g.restore();
    } else this.paintBranches(g, intro);

    // attention threads from the query to the three strongest keys
    if (this.q && this.threadAlpha > 0.01) {
      const top = [...this.flowers].sort((a, b) => b.weight - a.weight).slice(0, 3);
      const gold = this.o.theme === "light" ? "168,116,28" : "236,194,96";
      g.lineWidth = 0.8;
      for (const f of top) {
        const a = this.threadAlpha * clamp(0.18 + f.weight * 1.6, 0.18, 0.7);
        g.strokeStyle = `rgba(${gold},${a.toFixed(3)})`;
        g.beginPath();
        g.moveTo(this.q.x, this.q.y);
        g.lineTo(f.x, f.y);
        g.stroke();
      }
      g.fillStyle = `rgba(${gold},${(this.threadAlpha * 0.8).toFixed(3)})`;
      g.beginPath();
      g.arc(this.q.x, this.q.y, 2, 0, Math.PI * 2);
      g.fill();
    }

    for (const f of this.flowers) {
      const show = intro >= 1 ? 1 : easeOut((intro - f.delay * 0.7) / 0.3);
      if (show <= 0) continue;
      const open = intro >= 1 ? f.open : f.base * show;
      const lvl = Math.round(clamp(open) * (LEVELS - 1));
      const spr = this.sprites[f.kind][lvl];
      const s = (f.size * (0.6 + 0.4 * show)) / dpr;
      g.save();
      g.translate(f.x, f.y);
      g.rotate(f.rot);
      g.globalAlpha = clamp(show * 1.3);
      g.drawImage(spr as unknown as CanvasImageSource, (-spr.width / 2) * s, (-spr.height / 2) * s, spr.width * s, spr.height * s);
      g.restore();
    }
    if (this.petalSprite) {
      const ps = this.petalSprite;
      for (const p of this.petals) {
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.rot);
        g.globalAlpha = clamp(1 - p.life / 3) * 0.9;
        const s = p.size / dpr;
        g.drawImage(ps as unknown as CanvasImageSource, (-ps.width / 2) * s, (-ps.height / 2) * s, ps.width * s, ps.height * s);
        g.restore();
      }
      g.globalAlpha = 1;
    }
  }
}
