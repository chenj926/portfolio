import React, { createRef } from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import Material from "./Material";
import * as refraction from "../utils/refraction";

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
      act(() => window.matchMedia(media).dispatch(matches));
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
  expect(surface.style.getPropertyValue("--light-x")).toBe("32%");

  fireMouseMove(surface, 0, 80);
  expect(browser.frames.size).toBe(1);
  const secondFrameId = [...browser.frames.keys()][0];
  unmount();

  expect(window.cancelAnimationFrame).toHaveBeenCalledWith(secondFrameId);
  expect(browser.frames.size).toBe(0);
});

test("moves a directional highlight without tilting the surface", () => {
  const browser = installBrowserMocks();
  render(<Material data-testid="material-surface">Surface</Material>);
  const surface = screen.getByTestId("material-surface");
  setElementBounds(surface);

  firePointerMove(surface, { clientX: 110, clientY: 0 });
  const [updateHighlight] = browser.frames.values();
  act(() => updateHighlight());

  expect(surface.style.getPropertyValue("--light-x")).toBe("91.67%");
  expect(surface.style.getPropertyValue("--light-y")).toBe("0.00%");
  expect(surface.style.getPropertyValue("--pointer-x")).toBe("0.917");
  expect(surface.style.getPropertyValue("--pointer-y")).toBe("0.000");
  expect(
    parseFloat(surface.style.getPropertyValue("--glaze-angle")),
  ).toBeGreaterThan(180);
  expect(surface.style.getPropertyValue("--tilt-x")).toBe("");
  expect(surface.style.getPropertyValue("--tilt-y")).toBe("");
  fireEvent.pointerLeave(surface, { pointerType: "mouse" });
  expect(surface.style.getPropertyValue("--pointer-x")).toBe("");
  expect(surface.style.getPropertyValue("--glaze-angle")).toBe("");
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

test("disables pointer lighting when reduced transparency is requested", () => {
  installBrowserMocks({ reducedTransparency: true });
  render(<Material data-testid="material-surface">Surface</Material>);
  const surface = screen.getByTestId("material-surface");
  setElementBounds(surface);

  fireMouseMove(surface);

  expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  expect(surface).toHaveAttribute("data-material-refraction", "fallback");
});

test("does not allocate separate lens observers for controls inside a shell", () => {
  const browser = installBrowserMocks({
    supportsRefraction: true,
    resizeObserver: true,
  });
  render(
    <Material>
      <Material as="button" className="pressable">
        Control
      </Material>
      <Material role="menu">Menu</Material>
      <Material as="nav">Mobile menu</Material>
    </Material>,
  );

  // The shell and transient menu retain their own lenses. The nested control
  // shares the shell's backdrop and only lights up as an interactive target.
  expect(browser.observers).toHaveLength(3);
});

test("reuses its encoded lens map during pointer movement", () => {
  const browser = installBrowserMocks({
    supportsRefraction: true,
    resizeObserver: true,
  });
  const getContext = jest
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockImplementation(() => ({
      createImageData: (width, height) => ({
        data: new Uint8ClampedArray(width * height * 4),
      }),
      putImageData: jest.fn(),
    }));
  const toDataURL = jest
    .spyOn(HTMLCanvasElement.prototype, "toDataURL")
    .mockReturnValue("data:image/png;base64,lens-map");
  render(<Material data-testid="material-surface">Surface</Material>);
  const surface = screen.getByTestId("material-surface");
  setElementBounds(surface, 137, 81);
  act(() => browser.observers[0].callback());

  expect(getContext).toHaveBeenCalledTimes(1);
  expect(toDataURL).toHaveBeenCalledTimes(1);
  expect(surface).toHaveAttribute("data-material-refraction", "enabled");

  fireMouseMove(surface, 100, 15);
  act(() => [...browser.frames.values()][0]());
  fireMouseMove(surface, 25, 60);
  act(() => [...browser.frames.values()][0]());

  expect(getContext).toHaveBeenCalledTimes(1);
  expect(toDataURL).toHaveBeenCalledTimes(1);
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
  expect(surface.style.getPropertyValue("--material-filter")).toBe("blur(7px)");
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
  expect(surface.style.getPropertyValue("--material-filter")).toBe("blur(7px)");
  expect(surface.querySelector("svg")).not.toBeInTheDocument();

  cleanup();
  expect(browser.observers[0].disconnect).toHaveBeenCalledTimes(1);
});

test("press feedback reuses a finite lens animation and respects reduced motion", () => {
  const browser = installBrowserMocks({
    supportsRefraction: true,
    resizeObserver: true,
    coarsePointer: true,
  });
  jest
    .spyOn(refraction, "getRefractionMapDataUrl")
    .mockReturnValue("data:image/png;base64,fixture");
  const onPointerDown = jest.fn();
  const onKeyDown = jest.fn();
  render(
    <Material as="button" onPointerDown={onPointerDown} onKeyDown={onKeyDown}>
      Press glass
    </Material>,
  );
  const button = screen.getByRole("button", { name: "Press glass" });
  setElementBounds(button);
  act(() => browser.observers[0].callback());
  const animation = button.querySelector("animate");
  expect(animation).toHaveAttribute("begin", "indefinite");
  expect(animation).toHaveAttribute("repeatCount", "1");
  animation.beginElement = jest.fn();
  const pointer = new Event("pointerdown", { bubbles: true });
  Object.defineProperty(pointer, "button", { value: 0 });
  fireEvent(button, pointer);
  fireEvent.keyDown(button, { key: "Enter" });
  expect(animation.beginElement).toHaveBeenCalledTimes(2);
  expect(onPointerDown).toHaveBeenCalledTimes(1);
  expect(onKeyDown).toHaveBeenCalledTimes(1);
  expect(refraction.getRefractionMapDataUrl).toHaveBeenCalledTimes(1);
  act(() => browser.setMedia("(prefers-reduced-motion: reduce)", true));
  expect(button.querySelector("animate")).not.toBeInTheDocument();
  fireEvent.keyDown(button, { key: "Enter" });
  expect(animation.beginElement).toHaveBeenCalledTimes(2);
});

test("an independent menu owns its pulse while inset controls use the outer lens", () => {
  const onMenuAction = jest.fn();
  const browser = installBrowserMocks({
    supportsRefraction: true,
    resizeObserver: true,
  });
  jest
    .spyOn(refraction, "getRefractionMapDataUrl")
    .mockReturnValue("data:image/png;base64,nested-fixture");
  render(
    <Material data-testid="shell">
      <Material as="button">Inset control</Material>
      <Material role="menu" data-testid="menu">
        <button type="button" onClick={onMenuAction}>
          Menu action
        </button>
      </Material>
    </Material>,
  );
  const shell = screen.getByTestId("shell");
  const menu = screen.getByTestId("menu");
  setElementBounds(shell, 200, 80);
  setElementBounds(menu, 100, 70);
  act(() => browser.observers.forEach((observer) => observer.callback()));
  const outerAnimation = [...shell.children]
    .find((child) => child.tagName.toLowerCase() === "svg")
    .querySelector("animate");
  const innerAnimation = menu.querySelector("animate");
  outerAnimation.beginElement = jest.fn();
  innerAnimation.beginElement = jest.fn();
  fireEvent.keyDown(screen.getByRole("button", { name: "Menu action" }), {
    key: "Enter",
  });
  expect(innerAnimation.beginElement).toHaveBeenCalledTimes(1);
  expect(outerAnimation.beginElement).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Menu action" }));
  expect(onMenuAction).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(screen.getByRole("button", { name: "Inset control" }), {
    key: "Enter",
  });
  expect(outerAnimation.beginElement).toHaveBeenCalledTimes(1);
  expect(innerAnimation.beginElement).toHaveBeenCalledTimes(1);
});

test("buttons on a quiet reading panel retain an independent lens", () => {
  const browser = installBrowserMocks({
    supportsRefraction: true,
    resizeObserver: true,
  });
  render(
    <Material quiet>
      <Material as="button" className="pressable">
        Paper
      </Material>
    </Material>,
  );
  expect(browser.observers).toHaveLength(1);
});

const dispatchPointer = (element, type, pointerId = 1) => {
  const event = new Event(type, { bubbles: true });
  Object.defineProperties(event, {
    pointerId: { value: pointerId },
    button: { value: 0 },
  });
  fireEvent(element, event);
};

test("press deformation holds until its pointer releases, then settles once", () => {
  installBrowserMocks();
  render(
    <Material as="button" className="pressable">
      Spring
    </Material>,
  );
  const button = screen.getByRole("button", { name: "Spring" });
  const animations = [];
  button.animate = jest.fn(() => {
    const animation = { cancel: jest.fn() };
    animations.push(animation);
    return animation;
  });
  dispatchPointer(button, "pointerdown", 7);
  expect(button).toHaveAttribute("data-material-pressed");
  expect(button.animate).toHaveBeenCalledTimes(1);
  dispatchPointer(document, "pointerup", 8);
  expect(button.animate).toHaveBeenCalledTimes(1);
  dispatchPointer(document, "pointerup", 7);
  expect(button.animate).toHaveBeenCalledTimes(2);
  expect(animations[0].cancel).toHaveBeenCalled();
  expect(button).not.toHaveAttribute("data-material-pressed");
  dispatchPointer(document, "pointerup", 7);
  expect(button.animate).toHaveBeenCalledTimes(2);
});

test("active press work is cancelled on motion preference change and unmount", () => {
  const browser = installBrowserMocks();
  const view = render(
    <Material as="button" className="pressable">
      Spring
    </Material>,
  );
  const button = screen.getByRole("button", { name: "Spring" });
  const cancel = jest.fn();
  button.animate = jest.fn(() => ({ cancel }));
  dispatchPointer(button, "pointerdown");
  browser.setMedia("(prefers-reduced-motion: reduce)", true);
  expect(cancel).toHaveBeenCalled();
  expect(button).not.toHaveAttribute("data-material-pressed");
  dispatchPointer(document, "pointerup");
  expect(button.animate).toHaveBeenCalledTimes(1);
  browser.setMedia("(prefers-reduced-motion: reduce)", false);
  dispatchPointer(button, "pointerdown");
  view.unmount();
  dispatchPointer(document, "pointerup");
  expect(button.animate).toHaveBeenCalledTimes(2);
  expect(cancel).toHaveBeenCalledTimes(2);
});
