import React, { useId, useRef, useState } from "react";
import { useColorMode } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import Material from "./Material";
import useWaterSurface from "./useWaterSurface";
import "./InkStream.css";

const InkStream = () => {
  const canvas = useRef(null);
  const gradientId = `stream-${useId().replace(/:/g, "")}`;
  const { colorMode } = useColorMode();
  const [paused, setPaused] = useState(false);
  const { ready, running, reducedMotion } = useWaterSurface(canvas, {
    paused,
    theme: colorMode,
  });

  return (
    <div className="ink-stream" data-running={running}>
      <div
        className="ink-stream__water"
        data-renderer={ready ? "webgl" : "fallback"}
        aria-hidden="true"
      >
        <svg
          className="ink-stream__fallback"
          viewBox="0 0 800 170"
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0" stopColor="var(--stream-shallow)" />
              <stop offset="0.47" stopColor="var(--stream-deep)" />
              <stop offset="1" stopColor="var(--stream-shallow)" />
            </linearGradient>
          </defs>
          <path
            className="ink-stream__bank"
            d="M-12 95C66 56 127 47 198 65c90 23 128 62 224 43 78-15 125-55 206-47 66 7 113 50 189 23v78H-12Z"
          />
          <path
            fill={`url(#${gradientId})`}
            d="M-16 77C62 42 126 35 199 54c93 24 123 58 222 38 86-17 121-53 204-45 76 8 111 43 191 18v71c-76 18-132-17-203-19-75-3-126 34-211 42-107 10-150-18-227-39-68-19-116-10-191 22Z"
          />
          <path
            className="ink-stream__reflection"
            d="M5 70c76-30 132-30 197-11 88 25 125 53 217 32 82-18 122-44 202-36 69 7 119 37 174 22M77 100c51-8 91 1 134 14 50 15 91 20 147 8m156-25c51-12 97-14 140 0"
          />
        </svg>
        <canvas ref={canvas} className="ink-stream__canvas" />
      </div>
      {ready && !reducedMotion && (
        <Material
          as="button"
          className="ink-stream__control pressable"
          type="button"
          aria-label={paused ? "Play water animation" : "Pause water animation"}
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
        >
          <FontAwesomeIcon
            icon={paused ? faPlay : faPause}
            aria-hidden="true"
          />
        </Material>
      )}
    </div>
  );
};

export default InkStream;
