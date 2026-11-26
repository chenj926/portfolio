// Pictures, real icons and the small Chinese mark every section carries.
import type { CSSProperties } from "react";
import { type MarkId, marks } from "@/content/marks";
import { type Pic, src, srcSet, url } from "@/lib/site";

/** A school's or an employer's mark (content/marks.ts), for a paper plate beside its entry. */
export function Mark({ id }: { id: MarkId }) {
  const m = marks[id];
  return <img src={url(m.src)} width={m.w} height={m.h} alt="" loading="lazy" />;
}

export function Picture({
  pic,
  sizes,
  className,
  eager,
  style,
}: {
  pic: Pic;
  sizes: string;
  className?: string;
  eager?: boolean;
  style?: CSSProperties;
}) {
  return (
    <img
      className={className}
      src={src(pic)}
      srcSet={srcSet(pic)}
      sizes={sizes}
      width={pic.w}
      height={pic.h}
      alt={pic.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={style}
    />
  );
}

// a brand's real mark in its own colours (scripts/build-icons.mjs); black marks turn light on the dark grade
const INK = new Set(["github", "openai", "instagram"]);
export function Icon({ id, size = 20, label }: { id: string; size?: number; label?: string }) {
  return (
    <img
      className={`brand-ic${INK.has(id) ? " brand-ic--ink" : ""}`}
      src={url(`/icons/${id}.svg`)}
      width={size}
      height={size}
      alt={label ?? ""}
      loading="lazy"
    />
  );
}

// two characters set vertically at a section's top right, like the short inscription on a scroll (题款)
export function ZhMark({ text }: { text: string }) {
  return (
    <span className="zh-mark" lang="zh-Hans" aria-hidden="true">
      {text}
    </span>
  );
}

export function Arrow() {
  return (
    <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
      <path className="m-arrow__stem" d="M1 6h8" />
      <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
    </svg>
  );
}

export function Seal({ size = 30 }: { size?: number }) {
  return (
    <span className="seal" style={{ width: size, height: size }} aria-hidden="true">
      <img className="seal__light" src={url("/images/marks/seal_light.svg")} alt="" width={size} height={size} />
      <img className="seal__dark" src={url("/images/marks/seal_dark.svg")} alt="" width={size} height={size} />
    </span>
  );
}
