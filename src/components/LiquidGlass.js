import React, { useEffect, useId, useRef, useState } from "react";

const defaultConfig = {
<<<<<<< codex/replace-liquid-glass-with-liquid-glass-react-viqfua
  displacementScale: 70,
  blurAmount: 0.0625,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0.15,
  cornerRadius: 999,
=======
  displacementScale: 46,
  blurAmount: 0.18,
  saturation: 176,
  aberrationIntensity: 1.35,
  elasticity: 0.18,
  cornerRadius: 28,
>>>>>>> main
  padding: undefined,
  overLight: false,
};

const LiquidGlassFilter = ({ id, displacementScale, aberrationIntensity }) => (
  <svg className="ios-liquid-glass-filter" aria-hidden="true" focusable="false">
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
      <feTurbulence
        type="fractalNoise"
<<<<<<< codex/replace-liquid-glass-with-liquid-glass-react-viqfua
        baseFrequency="0.009 0.014"
        numOctaves="3"
=======
        baseFrequency="0.012 0.018"
        numOctaves="2"
>>>>>>> main
        seed="8"
        result="noise"
      />
      <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale={displacementScale}
        xChannelSelector="R"
        yChannelSelector="G"
        result="refracted"
      />
      <feOffset in="refracted" dx={aberrationIntensity} dy="0" result="redShift" />
      <feOffset in="refracted" dx={-aberrationIntensity} dy="0" result="blueShift" />
      <feBlend in="redShift" in2="refracted" mode="screen" result="warmEdge" />
      <feBlend in="warmEdge" in2="blueShift" mode="screen" result="chromatic" />
      <feGaussianBlur in="chromatic" stdDeviation="0.16" />
    </filter>
  </svg>
);

const LiquidGlass = ({
  children,
  className = "",
  style,
  displacementScale = defaultConfig.displacementScale,
  blurAmount = defaultConfig.blurAmount,
  saturation = defaultConfig.saturation,
  aberrationIntensity = defaultConfig.aberrationIntensity,
  elasticity = defaultConfig.elasticity,
  cornerRadius = defaultConfig.cornerRadius,
  padding = defaultConfig.padding,
  overLight = defaultConfig.overLight,
  onClick,
  as: Component = "div",
  ...rest
}) => {
  const filterId = useId().replace(/:/g, "");
  const ref = useRef(null);
  const [pointer, setPointer] = useState({ x: 50, y: 0, scaleX: 1, scaleY: 1, liftX: 0, liftY: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const handlePointerMove = (event) => {
      const rect = element.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normalizedX = (localX - centerX) / Math.max(rect.width, 1);
      const normalizedY = (localY - centerY) / Math.max(rect.height, 1);
      const pull = Math.min(Math.hypot(normalizedX, normalizedY) * 2, 1);

      setPointer({
        x: (localX / Math.max(rect.width, 1)) * 100,
        y: (localY / Math.max(rect.height, 1)) * 100,
        scaleX: 1 + Math.abs(normalizedX) * elasticity * 0.42 - Math.abs(normalizedY) * elasticity * 0.12,
        scaleY: 1 + Math.abs(normalizedY) * elasticity * 0.42 - Math.abs(normalizedX) * elasticity * 0.12,
        liftX: normalizedX * elasticity * 14 * pull,
        liftY: normalizedY * elasticity * 14 * pull,
      });
    };

    const handlePointerLeave = () => {
      setPointer({ x: 50, y: 0, scaleX: 1, scaleY: 1, liftX: 0, liftY: 0 });
      setIsActive(false);
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [elasticity]);

  return (
    <Component
      ref={ref}
      className={`liquid-glass ${className}`.trim()}
      data-over-light={overLight ? "true" : undefined}
      onPointerDown={() => setIsActive(true)}
      onPointerUp={() => setIsActive(false)}
      onClick={onClick}
      style={{
        ...style,
        "--lg-filter": `url(#${filterId})`,
<<<<<<< codex/replace-liquid-glass-with-liquid-glass-react-viqfua
        "--lg-blur": `${Math.round((overLight ? 12 : 4) + blurAmount * 32)}px`,
=======
        "--lg-blur": `${Math.round((overLight ? 18 : 10) + blurAmount * 72)}px`,
>>>>>>> main
        "--lg-saturation": `${saturation}%`,
        "--lg-radius": `${cornerRadius}px`,
        "--lg-padding": padding,
        "--lg-highlight-x": `${pointer.x}%`,
        "--lg-highlight-y": `${pointer.y}%`,
        "--lg-transform": `translate3d(${pointer.liftX}px, ${pointer.liftY}px, 0) scaleX(${pointer.scaleX}) scaleY(${pointer.scaleY}) ${isActive && onClick ? "scale(0.975)" : ""}`,
      }}
      {...rest}
    >
      <LiquidGlassFilter
        id={filterId}
        displacementScale={displacementScale}
        aberrationIntensity={aberrationIntensity}
      />
      <span className="liquid-glass__backdrop" aria-hidden="true" />
      <span className="liquid-glass__sheen" aria-hidden="true" />
      <span className="liquid-glass__content">{children}</span>
    </Component>
  );
};

export default LiquidGlass;
