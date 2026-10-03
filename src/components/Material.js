import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { getRefractionMapDataUrl, REFRACTION_SCALE } from "../utils/refraction";
import "./Material.css";
import useMaterialPress from "./useMaterialPress";

const NOOP_MEDIA = { matches: false };

const getMediaQuery = (query) =>
  typeof window.matchMedia === "function"
    ? window.matchMedia(query)
    : NOOP_MEDIA;

const listenToMediaQuery = (query, listener) => {
  if (query.addEventListener) {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }
  if (query.addListener) {
    query.addListener(listener);
    return () => query.removeListener(listener);
  }
  return () => {};
};

const supportsBackdropRefraction = () => {
  const cssApi = window.CSS;
  return Boolean(
    cssApi?.supports?.("backdrop-filter", "url(#material-filter-probe)"),
  );
};

const readCornerRadius = (element, width, height) => {
  const rawRadius = window.getComputedStyle(element).borderTopLeftRadius || "0";
  const parsedRadius = Number.parseFloat(rawRadius);
  if (!Number.isFinite(parsedRadius)) return 0;
  if (rawRadius.includes("%")) {
    return (Math.min(width, height) * parsedRadius) / 100;
  }
  return parsedRadius;
};

const joinClassNames = (...names) => names.filter(Boolean).join(" ");

const Material = forwardRef(function Material(
  {
    as = "div",
    className,
    children,
    quiet = false,
    opaque = false,
    style: callerStyle,
    onPointerMove,
    onPointerLeave,
    onPointerDown,
    onKeyDown,
    ...nativeProps
  },
  forwardedRef,
) {
  const generatedId = useId();
  const filterId = `material-lens-${generatedId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const rootRef = useRef(null);
  const animationFrameRef = useRef(null);
  const pendingPointerRef = useRef(null);
  const pointerResponsiveRef = useRef(false);
  const lensPulseRef = useRef(null);
  const pointerDefaultsRef = useRef({
    lightX: "32%",
    lightY: "5%",
  });
  const pointerValuesRef = useRef({ ...pointerDefaultsRef.current });
  const [lensImage, setLensImage] = useState(null);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const animatePress = useMaterialPress(rootRef, motionAllowed);

  const setRootRef = useCallback(
    (element) => {
      rootRef.current = element;
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [forwardedRef],
  );

  const cancelPointerFrame = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    pendingPointerRef.current = null;
  }, []);

  const resetPointerLighting = useCallback(() => {
    cancelPointerFrame();
    const root = rootRef.current;
    if (!root) return;
    pointerValuesRef.current = { ...pointerDefaultsRef.current };
    root.style.setProperty("--light-x", pointerValuesRef.current.lightX);
    root.style.setProperty("--light-y", pointerValuesRef.current.lightY);
    root.style.removeProperty("--pointer-x");
    root.style.removeProperty("--pointer-y");
    root.style.removeProperty("--glaze-angle");
  }, [cancelPointerFrame]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const reducedMotionQuery = getMediaQuery(
      "(prefers-reduced-motion: reduce)",
    );
    const reducedTransparencyQuery = getMediaQuery(
      "(prefers-reduced-transparency: reduce)",
    );
    const coarsePointerQuery = getMediaQuery("(pointer: coarse)");
    const supportsLens = supportsBackdropRefraction();
    const hasIndependentLens =
      !root.parentElement?.closest(
        ".material-surface:not([data-material-quiet]):not([data-material-opaque])",
      ) || root.matches('[role="menu"], nav.material-surface');

    const updatePointerMode = () => {
      setMotionAllowed(
        !quiet &&
          !reducedMotionQuery.matches &&
          !reducedTransparencyQuery.matches,
      );
      pointerResponsiveRef.current =
        !quiet &&
        !reducedMotionQuery.matches &&
        !reducedTransparencyQuery.matches &&
        !coarsePointerQuery.matches;
      if (!pointerResponsiveRef.current) resetPointerLighting();
    };

    const updateLensMap = () => {
      if (
        quiet ||
        opaque ||
        !hasIndependentLens ||
        !supportsLens ||
        reducedTransparencyQuery.matches ||
        typeof window.ResizeObserver !== "function"
      ) {
        setLensImage(null);
        return;
      }

      const bounds = root.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0 || bounds.height > 180) {
        setLensImage(null);
        return;
      }

      const cornerRadius = readCornerRadius(root, bounds.width, bounds.height);
      const src = getRefractionMapDataUrl(
        bounds.width,
        bounds.height,
        cornerRadius,
      );
      if (!src) {
        setLensImage(null);
        return;
      }

      setLensImage((current) => {
        if (
          current?.src === src &&
          Math.abs(current.width - bounds.width) < 0.5 &&
          Math.abs(current.height - bounds.height) < 0.5
        ) {
          return current;
        }
        return { src, width: bounds.width, height: bounds.height };
      });
    };

    updatePointerMode();
    updateLensMap();

    let resizeObserver = null;
    if (
      !quiet &&
      !opaque &&
      hasIndependentLens &&
      supportsLens &&
      typeof window.ResizeObserver === "function"
    ) {
      resizeObserver = new window.ResizeObserver(updateLensMap);
      resizeObserver.observe(root);
    }

    const removeMotionListener = listenToMediaQuery(
      reducedMotionQuery,
      updatePointerMode,
    );
    const removeCoarseListener = listenToMediaQuery(
      coarsePointerQuery,
      updatePointerMode,
    );
    const updateTransparencyMode = () => {
      updatePointerMode();
      updateLensMap();
    };
    const removeTransparencyListener = listenToMediaQuery(
      reducedTransparencyQuery,
      updateTransparencyMode,
    );

    return () => {
      resizeObserver?.disconnect();
      removeMotionListener();
      removeCoarseListener();
      removeTransparencyListener();
      pointerResponsiveRef.current = false;
      cancelPointerFrame();
    };
  }, [quiet, opaque, cancelPointerFrame, resetPointerLighting]);

  const handlePointerMove = (event) => {
    onPointerMove?.(event);
    if (
      !pointerResponsiveRef.current ||
      event.pointerType === "touch" ||
      !Number.isFinite(event.clientX) ||
      !Number.isFinite(event.clientY)
    ) {
      return;
    }

    pendingPointerRef.current = {
      clientX: event.clientX,
      clientY: event.clientY,
    };
    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = window.requestAnimationFrame(() => {
      animationFrameRef.current = null;
      const pointer = pendingPointerRef.current;
      pendingPointerRef.current = null;
      const root = rootRef.current;
      if (!root || !pointer) return;

      const bounds = root.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;
      const lightX = Math.min(
        100,
        Math.max(0, ((pointer.clientX - bounds.left) / bounds.width) * 100),
      );
      const lightY = Math.min(
        100,
        Math.max(0, ((pointer.clientY - bounds.top) / bounds.height) * 100),
      );
      pointerValuesRef.current = {
        lightX: `${lightX.toFixed(2)}%`,
        lightY: `${lightY.toFixed(2)}%`,
      };
      root.style.setProperty("--light-x", pointerValuesRef.current.lightX);
      root.style.setProperty("--light-y", pointerValuesRef.current.lightY);
      // Shared normalized coordinates keep decorative responses out of React state.
      root.style.setProperty("--pointer-x", (lightX / 100).toFixed(3));
      root.style.setProperty("--pointer-y", (lightY / 100).toFixed(3));
      root.style.setProperty("--glaze-angle", `${145 + lightX * 0.5}deg`);
    });
  };

  const handlePointerLeave = (event) => {
    resetPointerLighting();
    onPointerLeave?.(event);
  };

  const pulseLens = (event) => {
    const nearestLens = event.target.closest?.(
      '[data-material-refraction="enabled"]',
    );
    if (
      motionAllowed &&
      nearestLens === rootRef.current &&
      event.target.closest?.("a, button, [role='button']")
    ) {
      // A finite SVG animation reuses the cached field, with no JS frame loop.
      lensPulseRef.current?.beginElement?.();
    }
  };

  const handlePointerDown = (event) => {
    onPointerDown?.(event);
    if (!event.defaultPrevented && event.button === 0) {
      animatePress(event);
      pulseLens(event);
    }
  };

  const handleKeyDown = (event) => {
    onKeyDown?.(event);
    if (
      !event.defaultPrevented &&
      !event.repeat &&
      (event.key === "Enter" || event.key === " ")
    ) {
      animatePress(event);
      pulseLens(event);
    }
  };

  const Component = as;
  const activeFilter =
    lensImage && !quiet && !opaque
      ? `url(#${filterId}) blur(1.5px)`
      : "blur(7px)";
  const style = {
    ...callerStyle,
    "--material-filter": activeFilter,
    "--light-x": pointerValuesRef.current.lightX,
    "--light-y": pointerValuesRef.current.lightY,
  };

  return React.createElement(
    Component,
    {
      ...nativeProps,
      ref: setRootRef,
      className: joinClassNames("material-surface", className),
      "data-material-quiet": quiet ? "" : undefined,
      "data-material-opaque": opaque ? "" : undefined,
      "data-material-refraction":
        lensImage && !quiet && !opaque ? "enabled" : "fallback",
      style,
      onPointerMove: handlePointerMove,
      onPointerLeave: handlePointerLeave,
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
    },
    children,
    <span className="material-lens" aria-hidden="true" />,
    <span className="material-shine" aria-hidden="true" />,
    lensImage && !quiet && !opaque
      ? React.createElement(
          "svg",
          {
            "aria-hidden": "true",
            focusable: "false",
            width: "0",
            height: "0",
            style: {
              position: "absolute",
              width: 0,
              height: 0,
              overflow: "hidden",
              pointerEvents: "none",
            },
          },
          <defs>
            <filter
              id={filterId}
              x="0"
              y="0"
              width={lensImage.width}
              height={lensImage.height}
              filterUnits="userSpaceOnUse"
              primitiveUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={lensImage.src}
                x="0"
                y="0"
                width={lensImage.width}
                height={lensImage.height}
                preserveAspectRatio="none"
                result="materialMap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="materialMap"
                scale={REFRACTION_SCALE}
                xChannelSelector="R"
                yChannelSelector="G"
              >
                {motionAllowed && (
                  <animate
                    ref={lensPulseRef}
                    attributeName="scale"
                    values={`${REFRACTION_SCALE};${REFRACTION_SCALE * 1.35};${REFRACTION_SCALE * 0.9};${REFRACTION_SCALE}`}
                    keyTimes="0;0.22;0.65;1"
                    calcMode="spline"
                    keySplines="0.2 0.7 0.3 1;0.3 0 0.3 1;0.3 0 0.4 1"
                    dur="420ms"
                    begin="indefinite"
                    repeatCount="1"
                  />
                )}
              </feDisplacementMap>
            </filter>
          </defs>,
        )
      : null,
  );
});

export default Material;
