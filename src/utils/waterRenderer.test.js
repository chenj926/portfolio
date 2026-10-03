import { createWaterRenderer } from "./waterRenderer";

const makeGl = (options = {}) => {
  let nextId = 1;
  const state = {
    shaders: [],
    programs: [],
    buffers: [],
    deletedShaders: [],
    deletedPrograms: [],
    deletedBuffers: [],
    shaderSources: [],
    uniformLookups: [],
    uniformWrites: [],
    drawCalls: [],
    viewportCalls: [],
  };
  const gl = {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    ARRAY_BUFFER: 5,
    STATIC_DRAW: 6,
    FLOAT: 7,
    TRIANGLES: 8,
    createShader: jest.fn((type) => {
      const shader = { id: nextId++, type };
      state.shaders.push(shader);
      return shader;
    }),
    shaderSource: jest.fn((shader, source) => {
      state.shaderSources.push({ shader, source });
    }),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn(
      (shader) => shader.type !== options.failShaderType,
    ),
    deleteShader: jest.fn((shader) => state.deletedShaders.push(shader)),
    createProgram: jest.fn(() => {
      if (options.failProgramCreation) return null;
      const program = { id: nextId++ };
      state.programs.push(program);
      return program;
    }),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(() => !options.failLink),
    deleteProgram: jest.fn((program) => state.deletedPrograms.push(program)),
    createBuffer: jest.fn(() => {
      if (options.failBufferCreation) return null;
      const buffer = { id: nextId++ };
      state.buffers.push(buffer);
      return buffer;
    }),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(() => {
      if (options.failBufferData) throw new Error("buffer setup failed");
    }),
    deleteBuffer: jest.fn((buffer) => state.deletedBuffers.push(buffer)),
    useProgram: jest.fn(),
    clearColor: jest.fn(),
    getAttribLocation: jest.fn(() => 0),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    getUniformLocation: jest.fn((program, name) => {
      state.uniformLookups.push(name);
      if (name === options.missingUniform) return null;
      return { name };
    }),
    uniform1f: jest.fn((location, value) =>
      state.uniformWrites.push({ kind: "1f", name: location.name, value }),
    ),
    uniform2f: jest.fn((location, x, y) =>
      state.uniformWrites.push({
        kind: "2f",
        name: location.name,
        value: [x, y],
      }),
    ),
    uniform3fv: jest.fn((location, value) =>
      state.uniformWrites.push({ kind: "3fv", name: location.name, value }),
    ),
    viewport: jest.fn((x, y, width, height) =>
      state.viewportCalls.push([x, y, width, height]),
    ),
    drawArrays: jest.fn((mode, first, count) =>
      state.drawCalls.push([mode, first, count]),
    ),
  };
  return { gl, state };
};

const makeCanvas = (gl) => ({
  width: 300,
  height: 150,
  getContext: jest.fn(() => gl),
});

test("returns null when WebGL is unavailable or shader compilation fails cleanly", () => {
  const unavailableCanvas = makeCanvas(null);
  expect(createWaterRenderer(unavailableCanvas)).toBeNull();
  expect(unavailableCanvas.getContext).toHaveBeenCalledWith("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
    premultipliedAlpha: false,
  });

  const { gl, state } = makeGl({ failShaderType: 2 });
  expect(createWaterRenderer(makeCanvas(gl))).toBeNull();
  expect(state.deletedShaders).toEqual(state.shaders);
  expect(state.deletedPrograms).toHaveLength(0);
});

test.each([
  ["link", { failLink: true }],
  ["buffer creation", { failBufferCreation: true }],
  ["buffer upload", { failBufferData: true }],
  ["uniform lookup", { missingUniform: "u_resolution" }],
])("cleans up resources after %s initialization failure", (_name, options) => {
  const { gl, state } = makeGl(options);

  expect(createWaterRenderer(makeCanvas(gl))).toBeNull();
  expect(state.deletedShaders).toEqual(state.shaders);
  expect(state.deletedPrograms).toEqual(state.programs);
  expect(state.deletedBuffers).toEqual(state.buffers);
});

test("resizes with floored dimensions, DPR and area caps, and safely skips zero area", () => {
  const { gl, state } = makeGl();
  const canvas = makeCanvas(gl);
  const renderer = createWaterRenderer(canvas);

  renderer.resize(100, 40, 3);
  expect(canvas.width).toBe(125);
  expect(canvas.height).toBe(50);
  expect(state.viewportCalls.at(-1)).toEqual([0, 0, 125, 50]);

  renderer.resize(1000, 500, 2);
  expect(canvas.width).toBe(692);
  expect(canvas.height).toBe(346);
  expect(canvas.width * canvas.height).toBeLessThanOrEqual(240000);

  renderer.resize(0, 300, 1.25);
  expect(canvas.width).toBe(0);
  expect(canvas.height).toBe(0);
  renderer.draw();
  expect(state.drawCalls).toHaveLength(0);

  renderer.resize(0.5, 200000, 1.25);
  expect(canvas.width).toBe(0);
  expect(canvas.height).toBe(0);
  renderer.draw();
  expect(state.drawCalls).toHaveLength(0);
});

test("caches uniform locations and uploads the precomputed palette only on theme changes", () => {
  const { gl, state } = makeGl();
  const renderer = createWaterRenderer(makeCanvas(gl));
  renderer.resize(200, 80, 1);

  expect(state.uniformLookups).toHaveLength(10);
  renderer.draw({ time: 2, pointer: { x: 0.2, y: 0.8 }, rippleAge: 0.4 });
  const firstPaletteWrites = state.uniformWrites.filter(
    ({ name }) =>
      name.startsWith("u_alpha") ||
      name.startsWith("u_water") ||
      name === "u_bank" ||
      name === "u_glint",
  );
  expect(firstPaletteWrites).toHaveLength(6);
  expect(
    firstPaletteWrites.find(({ name }) => name === "u_water_a").value,
  ).toEqual(new Float32Array([179 / 255, 211 / 255, 196 / 255]));

  renderer.draw({ time: 3, theme: "light" });
  expect(state.uniformLookups).toHaveLength(10);
  expect(
    state.uniformWrites.filter(
      ({ name }) =>
        name.startsWith("u_alpha") ||
        name.startsWith("u_water") ||
        name === "u_bank" ||
        name === "u_glint",
    ),
  ).toHaveLength(6);

  renderer.draw({ time: 4, theme: "dark" });
  expect(
    state.uniformWrites.filter(
      ({ name }) =>
        name.startsWith("u_alpha") ||
        name.startsWith("u_water") ||
        name === "u_bank" ||
        name === "u_glint",
    ),
  ).toHaveLength(12);
  expect(state.drawCalls).toHaveLength(3);
});

test("dispose is idempotent and prevents later drawing or resizing", () => {
  const { gl, state } = makeGl();
  const canvas = makeCanvas(gl);
  const renderer = createWaterRenderer(canvas);
  renderer.resize(100, 50, 1);
  renderer.draw();
  renderer.dispose();
  const canvasSizeAtDispose = [canvas.width, canvas.height];

  renderer.dispose();
  renderer.resize(400, 200, 1.25);
  renderer.draw({ theme: "dark" });

  expect([canvas.width, canvas.height]).toEqual(canvasSizeAtDispose);
  expect(state.drawCalls).toHaveLength(1);
  expect(state.deletedShaders).toEqual(state.shaders);
  expect(state.deletedPrograms).toEqual(state.programs);
  expect(state.deletedBuffers).toEqual(state.buffers);
});
