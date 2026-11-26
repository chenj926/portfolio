# 加内容：project、research、work、学历、news

这份是之后往网站里加东西的固定流程。每种内容都有一个 template，照着填就行。

## 先记住三条

1. **所有内容都在 `content/*.ts`，页面从这里生成。** 加一条 entry 之后，它的 detail page（`/projects/<slug>/`、`/research/<slug>/`）、home 上的位置、Research menu 和 footer 都会自己出现。不要在 `app/` 的 page 文件里为某个 slug 写特例。
2. **`npm run build` 会先检查内容**（`lib/validate.ts`）。缺图、缺 icon、slug 重复、news 链到不存在的页面、h1 太长、steps 和 step pictures 数量对不上，都会让 build 直接失败，并告诉你是哪一条。CI 跑的也是同一个 build。
3. **只写真的事实。** 数字和说法要能在 CV、repo 的 README 或 result notes 里找到。没有 public link 就不放 link；结果没测过就不写结果。

## 每种内容放在哪

| 要加的 | 文件 | 会出现在 |
| --- | --- | --- |
| Paper（已发表或 manuscript） | `content/research.ts`，`kind: "paper"` | `/research/` 的 papers、home 的 Research、menu、footer、自己的 detail page |
| 进行中的 research | `content/research.ts`，`kind: "work"` | home 的 Current research（前两条）、`/research/` 的 Current research、menu、detail page |
| Project | `content/projects.ts` | `/projects/`（数组顺序就是页面顺序）、home 前六个、footer 前四个、detail page |
| Research position | `content/experience.ts` 的 `positions` | home 的 Experience、`/research/` 的 Advisors |
| Work（industry job） | `content/experience.ts` 的 `jobs` | home 的 Experience |
| 学历 | `content/experience.ts` 的 `education` | hero 下面的 education band（第一条）、Experience |
| News | `content/experience.ts` 的 `updates` | home 前四条、`/about/#news` 全部 |
| CV、Résumé | `public/docs/` 和 `content/docs.ts` | hero 的两份文件、`/cv/` |
| 学校或公司的 logo | `public/images/marks/` 和 `content/marks.ts` | position、job、education 旁边的小 plate |
| Brand icon | `scripts/build-icons.mjs` | stack、links、header |

所有 list 都是**新的在前**。

## 一个 project

在 `content/projects.ts` 的 `projects` 里加一条。放在哪个位置，它在网站上就排在哪。

```ts
{
  slug: "my-project", // URL /projects/my-project/；小写，用 - 连接
  name: "My Project",
  h1: "My Project, what it is in plain words", // 55 个字符以内
  line: "One sentence for the card: what it does and one number.",
  summary: "Two sentences at most: what it does, for whom, and how it turned out.",
  statement: "12 to 40 words that restate facts from below. On the page they light up word by word.",
  card: { k: "What the number measures", v: "The number" }, // hero 上那张小卡片
  when: "January 2027 to April 2027",
  year: "2027",
  tags: ["AI and ML"], // "AI and ML"、"Software"、"Competition"
  facts: [
    // 正好四条
    { label: "Data", value: "2,520 pairs" },
    { label: "Model", value: "U-Net, three stages" },
    { label: "Team", value: "Four, as technical lead" },
    { label: "Result", value: "Top 1%" },
  ],
  stepsHeading: "How it works",
  steps: [
    // 三到四步，每步一句到两句
    { title: "First step", body: "What happens, in one or two sentences." },
    { title: "Second step", body: "..." },
    { title: "Third step", body: "..." },
  ],
  // 可选：每一步一张图，steps 就会变成随 scroll 切换的 pinned chapters
  // stepVisuals: [{ pic: {...} }, { pic: {...} }, { pic: {...} }],
  // stepsShape: "wide", // 这几张图共用的形状："wide"、"square"、"plate"
  // stepsScreens: 2, // 检查说 steps section 超过一屏时才加
  stack: [
    { label: "Python", icon: "python" },
    { label: "PyTorch", icon: "pytorch" },
  ],
  links: [
    // 第一个是 hero 的主按钮。label 写成动词加东西
    { label: "Watch the demo", href: "https://youtu.be/..." },
    { label: "See the code", href: "https://github.com/chenj926/...", icon: "github" },
  ],
  cover: { name: "my-project-43", widths: [800, 1200], w: 1200, h: 900, alt: "What the picture shows." }, // 4:3，卡片用
  hero: { name: "my-project", widths: [800, 1600], w: 1600, h: 900, alt: "What the picture shows." }, // detail page 的主图
  // 没有图就给一个 diagram（在 components/Diagrams.tsx 里画），例如 diagram: "case",
},
```

Projects 页 hero 里的两个 demo 窗口在 `app/projects/page.tsx` 的 `FILMS` 里指定。新 project 有 demo 视频、而且想放进 hero 时，才需要改那里。

## 一项 research

在 `content/research.ts` 的 `research` 里加一条。Paper 用 `kind: "paper"`，进行中的用 `kind: "work"`。

```ts
{
  slug: "my-paper",
  kind: "paper", // 进行中的写 "work"
  short: "MyMethod", // menu、footer、窗口标题栏里的短名
  title: "The Full Title as Published",
  h1: "MyMethod, what it does in plain words", // 55 个字符以内
  status: "NeurIPS 2027", // 或 "Manuscript"、"In progress"
  year: "2027",
  period: "January 2027 to now", // 进行中的 work 必填
  authors: ["Jialuo Chen", "..."], // paper 填
  institution: "University of Toronto",
  advisor: "Prof. ...",
  summary: "One or two sentences. On a phone the first sentence is the page's lead.",
  statement: "12 to 40 words on the idea; they light up word by word.",
  pointsHeading: "How the method works",
  points: [
    { title: "A part with a name", body: "What it does, one or two sentences." },
    // 三到五条
  ],
  card: { k: "What the number measures", v: "The number" },
  figures: [
    // 三个会滚动出现的数字；没有 results table 时必填
    { v: "37M", k: "parameters in each model", note: "a short note" },
    { v: "1B", k: "training tokens" },
    { v: "16K", k: "tokens in the longest test" },
  ],
  resultsHead: { title: "The study in numbers.", run: "University of Toronto, since January 2027." },
  links: [{ label: "Read the paper", href: "https://..." }], // 第一个是主按钮；没有 public link 就留空
  figure: { name: "my-paper-figure", widths: [700, 1000], w: 1000, h: 1400, alt: "..." }, // 或 diagram: "..."
  bibtex: `@inproceedings{...}`, // 有的话，会多一个 Cite section
  pages: "100 to 110",
  tile: { title: "Short title for the home tile", line: "One sentence." }, // work 在 home 上的 tile
},
```

`/research/` 页一屏放一篇 paper，两篇一个 section；第三篇会自动开第二个 section。Papers 标题旁那句 `PAPERS_RUN`（在 `app/research/page.tsx`）是手写的，加了 paper 或 status 改了时要一起改。

## 一个 research position、一份 work、一个学历、一条 news

都在 `content/experience.ts`，新的放在 list 最前面。

```ts
// positions
{
  role: "AI Research Assistant",
  institution: "University of Toronto",
  mark: "uoft", // content/marks.ts 里的 key
  advisor: "Prof. ...",
  group: "The lab's own name", // 只作小字记录，页面不突出 lab
  when: "May 2027 to now",
  topic: "What the research is about, in a line",
  research: "my-paper", // 对应的 research slug；还没有页面就不写
},

// jobs
{
  org: "Company",
  role: "Machine Learning Engineer Intern",
  when: "May 2027 to August 2027",
  where: "Toronto, Ontario",
  mark: "company", // 可选；没有的话显示公司名首字母
  topic: "What the work was about, in a line",
  points: ["One sentence: did A with B, got C."],
},

// education：第一条就是 hero 下面 band 里那一条
{
  school: "University of Toronto",
  mark: "uoft",
  degree: "MASc in Industrial Engineering",
  focus: "Thesis-based, in machine learning",
  when: "September 2027 to now",
  short: "2027 to now",
  // minors、thesis、honours、courses 都可选
},

// updates (news)
{ when: "May 2027", what: "Began research with Prof. ... on ...", href: "/research/my-paper/" },
```

学历变成两条时，Experience 那一栏的标题会自动从学校名变成 "Education"。

## 图片

```bash
python3 scripts/add-image.py ~/Downloads/demo-frame.png my-project-43 --ratio 4:3 --widths 800,1200 --alt "What it shows"
python3 scripts/add-image.py ~/Downloads/demo-frame.png my-project --widths 800,1600 --alt "What it shows"
```

它会把 WebP 写进 `public/images/`，并打印可以直接粘贴的 entry。比 source 更宽的 width 会被跳过，所以图不会被放大。

- Card cover 用 4:3，宽度至少 800。Detail page 的主图尽量 1200 以上。
- 用 demo 视频当封面时，从原视频里截一帧：`ffmpeg -ss 00:00:12 -i demo.mp4 -frames:v 1 frame.png`，再交给 `add-image.py`。从 YouTube 只能拿到最大 1280 宽的 thumbnail。
- 不要用黑白的图片或视频。
- `--alt` 写图里真正有什么，一句话。

## CV 和 Résumé

1. 用同样的文件名替换 `public/docs/Jialuo_Chen_CV.pdf` 或 `Jialuo_Chen_Resume.pdf`。
2. 跑 `python3 scripts/doc-pages.py public/docs/Jialuo_Chen_CV.pdf cv`（Résumé 用 `resume`）。PDF 里只要有电话号码或带门牌号的地址，它就停下、什么都不写。这时重新导出一份不含这些信息的 PDF；需要 redaction 的话，要把文字真正删掉，不能只盖一个色块。
3. 页数变了的话，把它打印的 `pages` 填进 `content/docs.ts`。

## 新的学校或公司 logo、新的 icon

- Logo：把文件放进 `public/images/marks/`，在 `content/marks.ts` 加一行（`src`、原图 `w` 和 `h`、`name`），entry 里用它的 key。
- Brand icon：在 `scripts/build-icons.mjs` 的 `ICONS` 里加一行。有彩色版本时用 `logos:<name>`（@iconify-json/logos），没有时用 simple-icons 的 `si:si<Name>`。黑色的 icon 加 `:ink`，同时加进 `components/Media.tsx` 的 `INK`，dark mode 才会把它反白。`npm run build` 会先重新生成 icons。

## 写字的规则

- 一句话写一件事，数字放进句子里，不放括号。
- Button 和 link 写成动词加东西：Read the paper、Watch the demo、See the code。
- 标题要说出它是什么（产品名、方法名、section 名），不要只写一句口号。
- 不写没测过的结果，不夸大。还在计划里的事不写。

## 发布前检查

```bash
npm run typecheck
npm run build      # 内容检查也在这里跑
npm run dev        # 打开 http://localhost:3000 看一遍，light 和 dark 都看
npm run preview    # 可选：做一份用相对路径的 copy（preview/），可以放在任何路径下预览
```

确认没问题后，开一个 pull request 到 `main`。CI 会跑 typecheck 和 build，merge 之后部署到 https://chenj926.github.io/portfolio/。

## 手写的总述句

下面这些句子会概括全部内容，不会自动更新。加了重要内容以后，记得回来检查：

- Home hero 的 lead，以及各 section 标题旁边的 run（`app/page.tsx`）
- `/research/` 的 hero lead、statement 和 `PAPERS_RUN`（`app/research/page.tsx`）
- `/projects/` 的 hero lead（`app/projects/page.tsx`）
- 网站的 description（`app/layout.tsx`）
