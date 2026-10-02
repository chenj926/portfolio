import React, { createRef } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import Material from "./Material";

const windowPropertyDescriptors = [
  "matchMedia",
  "CSS",
  "ResizeObserver",
  "requestAnimationFrame",
  "cancelAnimationFrame",
].reduce((descriptors, property) => {
  descriptors[property] = Object.getOwnPropertyDescriptor(window, property);
  return descriptors;
}, {});

const restoreWindowProperty = (property) => {
  const descriptor = windowPropertyDescriptors[property];
  if (descriptor) Object.defineProperty(window, property, descriptor);
  else delete window[property];
};

const installBrowserMocks = ({
  supportsRefraction = false,
  reducedMotion = false,
  reducedTransparency = false,
  coarsePointer = false,
  resizeObserver = false,
} = {}) => {
  const mediaRecords = new Map();
  const initialMatches = {
    "(prefers-reduced-motion: reduce)": reducedMotion,
    "(prefers-reduced-transparency: reduce)": reducedTransparency,
    "(pointer: coarse)": coarsePointer,
  };

  window.matchMedia = jest.fn((media) => {
    if (!mediaRecords.has(media)) {
      const listeners = new Set();
      mediaRecords.set(media, {
        media,
        matches: Boolean(initialMatches[media]),
        addEventListener: (_type, listener) => listeners.add(listener),
        removeEventListener: (_type, listener) => listeners.delete(listener),
        addListener: (listener) => listeners.add(listener),
        removeListener: (listener) => listeners.delete(listener),
        dispatch: (matches) => {
          const record = mediaRecords.get(media);
          record.matches = matches;
          listeners.forEach((listener) => listener({ matches, media }));
        },
      });
    }
    return mediaRecords.get(media);
  });

  window.CSS = {
    supports: jest.fn(
      (property, value) =>
        property === "backdrop-filter" &&
        value === "url(#material-filter-probe)" &&
        supportsRefraction,
    ),
  };

  const observers = [];
  if (resizeObserver) {
    window.ResizeObserver = class MockResizeObserver {
      constructor(callback) {
        this.callback = callback;
        this.observe = jest.fn();
        this.disconnect = jest.fn();
        observers.push(this);
      }
    };
  } else {
    delete window.ResizeObserver;
  }

  const frames = new Map();
  let nextFrameId = 1;
  window.requestAnimationFrame = jest.fn((callback) => {
    const id = nextFrameId++;
    frames.set(id, callback);
    return id;
  });
  window.cancelAnimationFrame = jest.fn((id) => frames.delete(id));

  return {
    frames,
    observers,
    setMedia(media, matches) {
      window.matchMedia(media).dispatch(matches);
    },
  };
};

const setElementBounds = (element, width = 120, height = 80) => {
  Object.defineProperty(element, "getBoundingClientRect", {
    configurable: true,
    value: () => ({
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: width,
      bottom: height,
      width,
      height,
      toJSON: () => ({}),
    }),
  });
};

const firePointerMove = (
  element,
  { pointerType = "mouse", clientX = 110, clientY = 0 } = {},
) => {
  const event = new Event("pointermove", { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerType: { value: pointerType },
    clientX: { value: clientX },
    clientY: { value: clientY },
  });
  return fireEvent(element, event);
};

const fireMouseMove = (element, clientX = 110, clientY = 0) =>
  firePointerMove(element, { clientX, clientY });

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  Object.keys(windowPropertyDescriptors).forEach(restoreWindowProperty);
});

test("forwards native element refs, props, and caller pointer handlers", () => {
  const browser = installBrowserMocks();
  const ref = createRef();
  const onClick = jest.fn();
  const onPointerMove = jest.fn();
  const onPointerLeave = jest.fn();
  render(
    <Material
      as="button"
      ref={ref}
      type="button"
      className="custom-surface"
      data-purpose="test"
      data-testid="material-surface"
      onClick={onClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      Press
    </Material>,
  );

  const button = screen.getByRole("button", { name: "Press" });
  setElementBounds(button);
  expect(ref.current).toBe(button);
  expect(button).toHaveClass("material-surface", "custom-surface");
  expect(button).toHaveAttribute("data-purpose", "test");

  fireMouseMove(button);
  fireEvent.pointerLeave(button, { pointerType: "mouse" });
  fireEvent.click(button);

  expect(onPointerMove).toHaveBeenCalledTimes(1);
  expect(onPointerLeave).toHaveBeenCalledTimes(1);
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(browser.frames.size).toBe(0);
});

test("cancels queued pointer work on leave and unmount", () => {
  const browser = installBrowserMocks();
  const { unmount } = render(
    <Material data-testid="material-surface">Surface</Material>,
  );
  const surface = screen.getByTestId("material-surface");
  setElementBounds(surface);

  fireMouseMove(surface);
  expect(browser.frames.size).toBe(1);
  const firstFrameId = [...browser.frames.keys()][0];

  fireEvent.pointerLeave(surface, { pointerType: "mouse" });
  expect(window.cancelAnimationFrame).toHaveBeenCalledWith(firstFrameId);
  expect(browser.frames.size).toBe(0);
  expect(surface.style.getPropertyValue("--light-x")).toBe("50%");

  fireMouseMove(surface, 0, 80);
  expect(browser.frames.size).toBe(1);
  const secondFrameId = [...browser.frames.keys()][0];
  unmount();

  expect(window.cancelAnimationFrame).toHaveBeenCalledWith(secondFrameId);
  expect(browser.frames.size).toBe(0);
});

test("disables pointer lighting for reduced motion and coarse or touch input", () => {
  const browser = installBrowserMocks({ reducedMotion: true });
  render(<Material data-testid="material-surface">Surface</Material>);
  const surface = screen.getByTestId("material-surface");
  setElementBounds(surface);

  fireMouseMove(surface);
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();

  browser.setMedia("(prefers-reduced-motion: reduce)", false);
  firePointerMove(surface, {
    pointerType: "touch",
    clientX: 110,
    clientY: 0,
  });
  expect(window.requestAnimationFrame).not.toHaveBeenCalled();

  fireMouseMove(surface);
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  const pendingFrameId = [...browser.frames.keys()][0];
  browser.setMedia("(prefers-reduced-motion: reduce)", true);
  expect(window.cancelAnimationFrame).toHaveBeenCalledWith(pendingFrameId);
  expect(browser.frames.size).toBe(0);

  browser.setMedia("(prefers-reduced-motion: reduce)", false);
  browser.setMedia("(pointer: coarse)", true);
  fireMouseMove(surface);
  expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
});

test("falls back without canvas work when SVG backdrop filters are unsupported", () => {
  installBrowserMocks({ supportsRefraction: false, resizeObserver: true });
  const getContext = jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null);
  render(<Material data-testid="material-surface">Surface</Material>);

  const surface = screen.getByTestId("material-surface");
  expect(getContext).not.toHaveBeenCalled();
  expect(surface).toHaveAttribute("data-material-refraction", "fallback");
  expect(surface.style.getPropertyValue("--material-filter")).toBe("blur(8px)");
  expect(surface.querySelector("svg")).not.toBeInTheDocument();
  expect(surface.querySelector(".material-lens")).toBeInTheDocument();
  expect(surface.querySelector(".material-shine")).toBeInTheDocument();
});

test("falls back cleanly when canvas cannot encode a supported lens map", () => {
  const browser = installBrowserMocks({
    supportsRefraction: true,
    resizeObserver: true,
  });
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  render(<Material data-testid="material-surface">Surface</Material>);
  const surface = screen.getByTestId("material-surface");
  setElementBounds(surface);
  act(() => browser.observers[0].callback());

  expect(surface).toHaveAttribute("data-material-refraction", "fallback");
  expect(surface.style.getPropertyValue("--material-filter")).toBe("blur(8px)");
  expect(surface.querySelector("svg")).not.toBeInTheDocument();

  cleanup();
  expect(browser.observers[0].disconnect).toHaveBeenCalledTimes(1);
});
