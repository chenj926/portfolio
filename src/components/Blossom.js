import { useEffect, useRef, useState } from "react";

/** Decorative motion stays local: one short greeting, then interaction only. */
export default function Blossom() {
  const element = useRef(null);
  const reducedMotion = useRef(false);
  const hasGreeted = useRef(false);
  const [motion, setMotion] = useState(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches) setMotion(null);
    };
    const stopWhenHidden = () => {
      if (document.hidden) setMotion(null);
    };
    updatePreference();
    preference.addEventListener("change", updatePreference);
    document.addEventListener("visibilitychange", stopWhenHidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setMotion(null);
      } else if (
        !hasGreeted.current &&
        !preference.matches &&
        !document.hidden
      ) {
        hasGreeted.current = true;
        setMotion("enter");
      }
    });
    observer.observe(element.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
      document.removeEventListener("visibilitychange", stopWhenHidden);
    };
  }, []);

  return (
    <div
      ref={element}
      className="home-blossom"
      aria-hidden="true"
      data-motion={motion || undefined}
      onPointerEnter={() => {
        if (!reducedMotion.current && !document.hidden) setMotion("bounce");
      }}
    >
      <div
        className="home-blossom-art"
        onAnimationEnd={() => setMotion(null)}
      />
    </div>
  );
}
