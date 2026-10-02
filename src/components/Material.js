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
  const pointerDefaultsRef = useRef({
    lightX: "50%",
    lightY: "40%",
    tiltX: "0deg",
    tiltY: "0deg",
  });
  const pointerValuesRef = useRef({ ...pointerDefaultsRef.current });
  const [lensImage, setLensImage] = useState(null);

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
    root.style.setProperty("--tilt-x", pointerValuesRef.current.tiltX);
    root.style.setProperty("--tilt-y", pointerValuesRef.current.tiltY);
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

    const updatePointerMode = () => {
      pointerResponsiveRef.current =
        !quiet && !reducedMotionQuery.matches && !coarsePointerQuery.matches;
      if (!pointerResponsiveRef.current) resetPointerLighting();
    };

    const updateLensMap = () => {
      if (
        quiet ||
        opaque ||
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
    const removeTransparencyListener = listenToMediaQuery(
      reducedTransparencyQuery,
      updateLensMap,
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
      const tiltX = Math.min(2, Math.max(-2, (50 - lightY) / 25));
      const tiltY = Math.min(2, Math.max(-2, (lightX - 50) / 25));

      pointerValuesRef.current = {
        lightX: `${lightX.toFixed(2)}%`,
        lightY: `${lightY.toFixed(2)}%`,
        tiltX: `${tiltX.toFixed(2)}deg`,
        tiltY: `${tiltY.toFixed(2)}deg`,
      };
      root.style.setProperty("--light-x", pointerValuesRef.current.lightX);
      root.style.setProperty("--light-y", pointerValuesRef.current.lightY);
      root.style.setProperty("--tilt-x", pointerValuesRef.current.tiltX);
      root.style.setProperty("--tilt-y", pointerValuesRef.current.tiltY);
    });
  };

  const handlePointerLeave = (event) => {
    resetPointerLighting();
    onPointerLeave?.(event);
  };

  const Component = as;
  const activeFilter =
    lensImage && !quiet && !opaque
      ? `url(#${filterId}) blur(1.5px)`
      : "blur(8px)";
  const style = {
    ...callerStyle,
    "--material-filter": activeFilter,
    "--light-x": pointerValuesRef.current.lightX,
    "--light-y": pointerValuesRef.current.lightY,
    "--tilt-x": pointerValuesRef.current.tiltX,
    "--tilt-y": pointerValuesRef.current.tiltY,
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
              />
            </filter>
          </defs>,
        )
      : null,
  );
});

export default Material;
