import { useCallback, useEffect, useRef } from "react";

// A control owns one finite animation and only listens for release while held.
// No React frame updates, timers, pointer capture, or idle animation loop.
export default function useMaterialPress(rootRef, enabled) {
  const animationRef = useRef(null);
  const removeReleaseRef = useRef(() => {});

  const cancel = useCallback(() => {
    removeReleaseRef.current();
    removeReleaseRef.current = () => {};
    animationRef.current?.cancel();
    animationRef.current = null;
    rootRef.current?.removeAttribute("data-material-pressed");
  }, [rootRef]);

  useEffect(() => {
    if (!enabled) cancel();
    return cancel;
  }, [enabled, cancel]);

  return useCallback(
    (event) => {
      const root = rootRef.current;
      if (
        !enabled ||
        !root?.animate ||
        event.target.closest?.(".pressable") !== root
      )
        return;
      const currentTransform = window.getComputedStyle(root).transform;
      cancel();

      const settle = (transform) => {
        animationRef.current?.cancel();
        const animation = root.animate(
          [
            { transform, offset: 0 },
            { transform: "scale(1.026, 1.014)", offset: 0.42 },
            { transform: "scale(0.997, 0.998)", offset: 0.72 },
            { transform: "scale(1)", offset: 1 },
          ],
          { duration: 460, easing: "cubic-bezier(.2,.7,.25,1)" },
        );
        animationRef.current = animation;
        animation.onfinish = () => {
          if (animationRef.current === animation) animationRef.current = null;
        };
      };

      if (event.type === "keydown") {
        settle("scale(.972, .936)");
        return;
      }

      root.setAttribute("data-material-pressed", "");
      animationRef.current = root.animate(
        [
          {
            transform:
              currentTransform === "none" ? "scale(1)" : currentTransform,
          },
          { transform: "scale(.972, .936)" },
        ],
        { duration: 110, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" },
      );
      const pointerId = event.pointerId;
      const release = (releaseEvent) => {
        if (
          releaseEvent.type !== "blur" &&
          releaseEvent.pointerId !== pointerId
        )
          return;
        removeReleaseRef.current();
        removeReleaseRef.current = () => {};
        const transform = window.getComputedStyle(root).transform;
        root.removeAttribute("data-material-pressed");
        if (
          releaseEvent.type === "pointercancel" ||
          releaseEvent.type === "blur"
        )
          cancel();
        else settle(transform === "none" ? "scale(.972, .936)" : transform);
      };
      document.addEventListener("pointerup", release);
      document.addEventListener("pointercancel", release);
      window.addEventListener("blur", release);
      removeReleaseRef.current = () => {
        document.removeEventListener("pointerup", release);
        document.removeEventListener("pointercancel", release);
        window.removeEventListener("blur", release);
      };
    },
    [rootRef, enabled, cancel],
  );
}
