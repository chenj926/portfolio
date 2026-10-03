import { useEffect, useRef, useState } from "react";

const DRAW_INTERVAL = 1 / 60;

// Visibility and input belong here; the lazily loaded renderer owns the GPU.
// Animation time survives suspension, so resuming never skips ahead in the river.
export default function useWaterSurface(canvasRef, { paused, theme }) {
  const settings = useRef({ paused, theme });
  const synchronize = useRef(null);
  const [playback, setPlayback] = useState({
    ready: false,
    running: false,
    reducedMotion: false,
  });

  useEffect(() => {
    settings.current = { paused, theme };
    synchronize.current?.();
  }, [paused, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    let renderer = null;
    let loading = false;
    let unavailable = false;
    let lost = false;
    let disposed = false;
    let visible = false;
    let width = 0;
    let height = 0;
    let frame = null;
    let previousTick = null;
    let accumulatedTime = DRAW_INTERVAL;
    const sample = {
      time: 0,
      theme: settings.current.theme,
      pointer: { x: 0.5, y: 0.5 },
      rippleAge: -1,
    };
    let rippleAt = null;

    const canDraw = () =>
      renderer && visible && !document.hidden && width > 0 && height > 0;
    const canAnimate = () =>
      canDraw() && !settings.current.paused && !motion?.matches;

    const publish = () => {
      const next = {
        ready: Boolean(renderer),
        running: Boolean(canAnimate()),
        reducedMotion: Boolean(motion?.matches),
      };
      setPlayback((current) =>
        current.ready === next.ready &&
        current.running === next.running &&
        current.reducedMotion === next.reducedMotion
          ? current
          : next,
      );
    };

    const draw = () => {
      sample.theme = settings.current.theme;
      sample.rippleAge = rippleAt === null ? -1 : sample.time - rippleAt;
      renderer.draw(sample);
    };

    const stop = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousTick = null;
      accumulatedTime = DRAW_INTERVAL;
    };

    const animate = (now) => {
      frame = null;
      if (!canAnimate()) {
        stop();
        publish();
        return;
      }
      const delta =
        previousTick === null ? 0 : Math.min((now - previousTick) / 1000, 0.05);
      previousTick = now;
      sample.time += delta;
      accumulatedTime += delta;
      // Keep fractional frame time: rounding each interval down would turn a
      // 144 Hz display into 48 fps. The drawing budget averages at most 60 fps.
      if (accumulatedTime >= DRAW_INTERVAL) {
        accumulatedTime %= DRAW_INTERVAL;
        draw();
      }
      frame = window.requestAnimationFrame(animate);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      renderer?.resize(width, height, window.devicePixelRatio || 1);
      reconcile();
    };

    const initialize = async () => {
      loading = true;
      try {
        const { createWaterRenderer } = await import("../utils/waterRenderer");
        if (disposed || lost || !visible || document.hidden) return;
        renderer = createWaterRenderer(canvas);
        unavailable = !renderer;
        renderer?.resize(width, height, window.devicePixelRatio || 1);
      } catch {
        // The existing static drawing also covers unavailable WebGL/chunks.
        unavailable = true;
      } finally {
        loading = false;
        if (!disposed) reconcile();
      }
    };

    function reconcile() {
      if (disposed) return;
      if (
        visible &&
        !document.hidden &&
        width > 0 &&
        height > 0 &&
        !renderer &&
        !loading &&
        !unavailable &&
        !lost
      ) {
        initialize();
      }
      if (!canAnimate()) stop();
      if (canDraw()) draw();
      if (canAnimate() && frame === null)
        frame = window.requestAnimationFrame(animate);
      publish();
    }

    const ripple = (event) => {
      if (!canAnimate() || (event.type === "pointerdown" && event.button > 0))
        return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      sample.pointer.x = (event.clientX - bounds.left) / bounds.width;
      sample.pointer.y = 1 - (event.clientY - bounds.top) / bounds.height;
      rippleAt = sample.time;
    };

    const loseContext = (event) => {
      event.preventDefault();
      lost = true;
      stop();
      renderer?.dispose();
      renderer = null;
      publish();
    };
    const restoreContext = () => {
      lost = false;
      unavailable = false;
      reconcile();
    };

    synchronize.current = reconcile;
    const intersection =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            reconcile();
          })
        : null;
    const sizing =
      typeof ResizeObserver === "function" ? new ResizeObserver(resize) : null;
    intersection?.observe(canvas);
    sizing?.observe(canvas);
    if (!intersection) visible = true;
    if (motion?.addEventListener) motion.addEventListener("change", reconcile);
    else motion?.addListener?.(reconcile);
    document.addEventListener("visibilitychange", reconcile);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerenter", ripple, { passive: true });
    canvas.addEventListener("pointerdown", ripple, { passive: true });
    canvas.addEventListener("webglcontextlost", loseContext);
    canvas.addEventListener("webglcontextrestored", restoreContext);
    resize();

    return () => {
      disposed = true;
      synchronize.current = null;
      stop();
      intersection?.disconnect();
      sizing?.disconnect();
      if (motion?.removeEventListener)
        motion.removeEventListener("change", reconcile);
      else motion?.removeListener?.(reconcile);
      document.removeEventListener("visibilitychange", reconcile);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerenter", ripple);
      canvas.removeEventListener("pointerdown", ripple);
      canvas.removeEventListener("webglcontextlost", loseContext);
      canvas.removeEventListener("webglcontextrestored", restoreContext);
      renderer?.dispose();
    };
  }, [canvasRef]);

  return playback;
}
