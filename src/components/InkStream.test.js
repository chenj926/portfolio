import { act, fireEvent, render, screen } from "@testing-library/react";
import InkStream from "./InkStream";
import { createWaterRenderer } from "../utils/waterRenderer";

let mockTheme = "light";
jest.mock("@chakra-ui/react", () => ({
  useColorMode: () => ({ colorMode: mockTheme }),
}));
jest.mock("../utils/waterRenderer", () => ({ createWaterRenderer: jest.fn() }));
jest.mock("./Material", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: ({ as, ...props }) => React.createElement(as, props),
  };
});

let intersect;
let resize;
let media;
let changeMotion;
let callbacks;
let nextFrame;
let renderers;
let bounds;
let intersectionDisconnect;
let resizeDisconnect;
const originalObserver = window.IntersectionObserver;
const originalResize = window.ResizeObserver;
const originalMedia = window.matchMedia;
const hiddenDescriptor = Object.getOwnPropertyDescriptor(document, "hidden");

beforeEach(() => {
  mockTheme = "light";
  callbacks = new Map();
  nextFrame = 0;
  renderers = [];
  bounds = { width: 800, height: 196, left: 0, top: 0 };
  intersectionDisconnect = jest.fn();
  resizeDisconnect = jest.fn();
  window.IntersectionObserver = class {
    constructor(callback) {
      intersect = callback;
    }
    observe() {}
    disconnect = intersectionDisconnect;
  };
  window.ResizeObserver = class {
    constructor(callback) {
      resize = callback;
    }
    observe() {}
    disconnect = resizeDisconnect;
  };
  media = {
    matches: false,
    addEventListener: (_event, handler) => {
      changeMotion = handler;
    },
    removeEventListener: jest.fn(),
  };
  window.matchMedia = () => media;
  Object.defineProperty(document, "hidden", {
    configurable: true,
    value: false,
  });
  jest
    .spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect")
    .mockImplementation(() => bounds);
  jest.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callbacks.set(++nextFrame, callback);
    return nextFrame;
  });
  jest
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation((id) => callbacks.delete(id));
  createWaterRenderer.mockReset().mockImplementation(() => {
    const samples = [];
    const renderer = {
      samples,
      draw: jest.fn((sample) =>
        samples.push({ ...sample, pointer: { ...sample.pointer } }),
      ),
      resize: jest.fn(),
      dispose: jest.fn(),
    };
    renderers.push(renderer);
    return renderer;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  window.IntersectionObserver = originalObserver;
  window.ResizeObserver = originalResize;
  window.matchMedia = originalMedia;
  if (hiddenDescriptor)
    Object.defineProperty(document, "hidden", hiddenDescriptor);
  else delete document.hidden;
});

const setVisible = async (visible) => {
  await act(async () => {
    intersect([{ isIntersecting: visible }]);
  });
};
const advance = (now) =>
  act(() => {
    const pending = Array.from(callbacks.values());
    callbacks.clear();
    pending.forEach((callback) => callback(now));
  });
const hideDocument = (hidden) =>
  act(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: hidden,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });

test("loads only on entry, freezes offscreen/hidden/paused, and resumes without jumping", async () => {
  const { container, unmount } = render(<InkStream />);
  const stream = container.firstChild;
  expect(createWaterRenderer).not.toHaveBeenCalled();
  expect(callbacks.size).toBe(0);
  await setVisible(true);
  const renderer = renderers[0];
  expect(stream).toHaveAttribute("data-running", "true");
  advance(0);
  advance(17);
  const time = renderer.samples.at(-1).time;
  expect(time).toBeGreaterThan(0);
  fireEvent.click(
    screen.getByRole("button", { name: "Pause water animation" }),
  );
  expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  expect(callbacks.size).toBe(0);
  fireEvent.click(screen.getByRole("button", { name: "Play water animation" }));
  advance(10000);
  expect(renderer.samples.at(-1).time).toBe(time);
  hideDocument(true);
  expect(stream).toHaveAttribute("data-running", "false");
  expect(callbacks.size).toBe(0);
  hideDocument(false);
  expect(callbacks.size).toBe(1);
  await setVisible(false);
  expect(callbacks.size).toBe(0);
  unmount();
  expect(renderer.dispose).toHaveBeenCalledTimes(1);
  expect(intersectionDisconnect).toHaveBeenCalledTimes(1);
  expect(resizeDisconnect).toHaveBeenCalledTimes(1);
  expect(media.removeEventListener).toHaveBeenCalledWith(
    "change",
    changeMotion,
  );
});

test("reduced motion keeps a static themed surface and restores the user's pause choice", async () => {
  const view = render(<InkStream />);
  await setVisible(true);
  fireEvent.click(screen.getByRole("button"));
  act(() => {
    media.matches = true;
    changeMotion();
  });
  expect(callbacks.size).toBe(0);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  mockTheme = "dark";
  view.rerender(<InkStream />);
  expect(renderers[0].samples.at(-1).theme).toBe("dark");
  expect(callbacks.size).toBe(0);
  act(() => {
    media.matches = false;
    changeMotion();
  });
  expect(
    screen.getByRole("button", { name: "Play water animation" }),
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button"));
  expect(callbacks.size).toBe(1);
});

test("sizing and ripple input update the same renderer without frame-by-frame DOM reads", async () => {
  const { container } = render(<InkStream />);
  await setVisible(true);
  const canvas = container.querySelector("canvas");
  bounds.width = 400;
  act(() => resize());
  expect(renderers[0].resize).toHaveBeenLastCalledWith(
    400,
    196,
    window.devicePixelRatio,
  );
  fireEvent(
    canvas,
    new MouseEvent("pointerenter", { clientX: 100, clientY: 98 }),
  );
  const readsBeforeAnimation = canvas.getBoundingClientRect.mock.calls.length;
  advance(0);
  advance(17);
  expect(canvas.getBoundingClientRect).toHaveBeenCalledTimes(
    readsBeforeAnimation,
  );
  expect(renderers[0].samples.at(-1).pointer).toEqual({ x: 0.25, y: 0.5 });
  expect(renderers[0].samples.at(-1).rippleAge).toBeGreaterThan(0);
  expect(createWaterRenderer).toHaveBeenCalledTimes(1);
});

test("context loss stops drawing and restoration rebuilds resources without losing pause state", async () => {
  const { container } = render(<InkStream />);
  await setVisible(true);
  fireEvent.click(screen.getByRole("button"));
  const canvas = container.querySelector("canvas");
  const loss = new Event("webglcontextlost", { cancelable: true });
  fireEvent(canvas, loss);
  expect(loss.defaultPrevented).toBe(true);
  expect(renderers[0].dispose).toHaveBeenCalledTimes(1);
  expect(callbacks.size).toBe(0);
  expect(container.querySelector("[data-renderer]")).toHaveAttribute(
    "data-renderer",
    "fallback",
  );
  await act(async () => {
    fireEvent(canvas, new Event("webglcontextrestored"));
  });
  expect(createWaterRenderer).toHaveBeenCalledTimes(2);
  expect(
    screen.getByRole("button", { name: "Play water animation" }),
  ).toBeInTheDocument();
  expect(callbacks.size).toBe(0);
});

test("unavailable WebGL leaves a static fallback with no unusable controls or retry loop", async () => {
  createWaterRenderer.mockReturnValue(null);
  const { container } = render(<InkStream />);
  await setVisible(true);
  expect(container.querySelector("[data-renderer]")).toHaveAttribute(
    "data-renderer",
    "fallback",
  );
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
  expect(callbacks.size).toBe(0);
  await setVisible(false);
  await setVisible(true);
  expect(createWaterRenderer).toHaveBeenCalledTimes(1);
});

test("an import completing after unmount does not allocate a renderer", async () => {
  const { unmount } = render(<InkStream />);
  await act(async () => {
    intersect([{ isIntersecting: true }]);
    unmount();
  });
  expect(createWaterRenderer).not.toHaveBeenCalled();
  expect(callbacks.size).toBe(0);
});

test("high refresh displays retain a smooth 60 fps budget without rounding down to 48", async () => {
  render(<InkStream />);
  await setVisible(true);
  const initialDraws = renderers[0].samples.length;
  for (let tick = 0; tick <= 144; tick += 1) advance((tick * 1000) / 144);
  const draws = renderers[0].samples.length - initialDraws;
  expect(draws).toBeGreaterThanOrEqual(59);
  expect(draws).toBeLessThanOrEqual(61);
  expect(renderers[0].samples.at(-1).time).toBeCloseTo(1, 1);
});
