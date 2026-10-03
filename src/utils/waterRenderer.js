const MAX_PIXEL_AREA = 240000;
const MAX_PIXEL_RATIO = 1.25;
const EMPTY_OPTIONS = Object.freeze({});
const DEFAULT_POINTER = Object.freeze({ x: 0.5, y: 0.5 });
const QUAD_VERTICES = new Float32Array([
  -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
]);

const toRgb = (color) => new Float32Array(color.map((part) => part / 255));

const themes = {
  light: {
    alphaShallow: 0.16,
    alphaDeep: 0.79,
    waterA: toRgb([179, 211, 196]),
    waterB: toRgb([121, 172, 156]),
    bank: toRgb([143, 161, 143]),
    glint: toRgb([255, 255, 246]),
  },
  dark: {
    alphaShallow: 0.26,
    alphaDeep: 0.88,
    waterA: toRgb([69, 112, 105]),
    waterB: toRgb([20, 51, 61]),
    bank: toRgb([49, 78, 74]),
    glint: toRgb([187, 221, 214]),
  },
};

const vertexSource = `
          attribute vec2 a_position;
          varying vec2 v_uv;
          void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
          }
        `;

const fragmentSource = `
          precision highp float;
          uniform vec2 u_resolution;
          uniform vec2 u_pointer;
          uniform float u_time;
          uniform float u_ripple_age;
          uniform float u_alpha_shallow;
          uniform float u_alpha_deep;
          uniform vec3 u_water_a;
          uniform vec3 u_water_b;
          uniform vec3 u_bank;
          uniform vec3 u_glint;
          varying vec2 v_uv;

          float hash21(vec2 p) {
            // Integer-valued arithmetic keeps shared lattice corners identical
            // even when a GPU compiler fuses/reorders floating-point operations.
            p = mod(p, 256.0);
            float h = mod((p.x * 34.0 + 1.0) * p.x, 256.0);
            h += p.y;
            return mod((h * 34.0 + 1.0) * h, 256.0) / 255.0;
          }

          float noise2(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float a = hash21(i);
            float b = hash21(i + vec2(1.0, 0.0));
            float c = hash21(i + vec2(0.0, 1.0));
            float d = hash21(i + vec2(1.0, 1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
          }

          float fbm(vec2 p) {
            float sum = 0.0;
            float amp = 0.5;
            mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
            for (int i = 0; i < 4; i++) {
              sum += amp * noise2(p);
              p = turn * p + vec2(4.3, 1.7);
              amp *= 0.5;
            }
            return sum;
          }

          vec2 flowCoords(vec2 uv, float t) {
            // One eastward current carries every wave; warping travels with it.
            float span = clamp(u_resolution.x / u_resolution.y * 3.7, 9.0, 23.0);
            vec2 p = uv * vec2(span, 12.0) - vec2(t * 0.62, 0.0);
            float bendA = fbm(p * 0.28 + vec2(0.0, 1.4));
            float bendB = fbm(p * 0.32 + vec2(6.7, 0.0));
            return p + (vec2(bendA, bendB) - 0.5) * 2.4;
          }

          vec2 surfaceGradient(vec2 q, float t) {
            // Analytic slopes avoid four extra height samples per pixel.
            float broad = cos(q.y * 1.55 + sin(q.x * 0.85) * 1.14) * 0.060;
            float middle = cos(q.y * 3.9 + sin(q.x * 1.72) * 0.65) * 0.021;
            float fine = cos(q.y * 7.6 + sin(q.x * 2.65) * 0.50) * 0.006;
            float crossWave = cos(q.x * 1.32 + q.y * 2.75 - t * 0.08) * 0.018;
            return vec2(
              broad * cos(q.x * 0.85) * 1.14 * 0.85
                + middle * cos(q.x * 1.72) * 0.65 * 1.72
                + fine * cos(q.x * 2.65) * 0.50 * 2.65 + crossWave * 1.32,
              broad * 1.55 + middle * 3.9 + fine * 7.6 + crossWave * 2.75
            ) * vec2(8.0, 12.0);
          }

          void main() {
            vec2 uv = v_uv;
            float t = u_time;
            float lowBank = noise2(vec2(uv.x * 2.25 + 1.4, 1.8));
            float highBank = noise2(vec2(uv.x * 6.1 - 2.3, 5.1));
            float center = 0.53 + (lowBank - 0.5) * 0.43 + (highBank - 0.5) * 0.16;
            float breadth = 0.24 + (noise2(vec2(uv.x * 3.8 + 4.4, 10.8)) - 0.5) * 0.06;
            float side = uv.y - center;
            float bankBias = side > 0.0 ? 0.82 : 1.16;
            float taper = smoothstep(0.0, 0.12, uv.x) * (1.0 - smoothstep(0.88, 1.0, uv.x));
            float halfWidth = breadth * bankBias * mix(0.2, 1.0, taper);
            float edgeGrain = (noise2(vec2(uv.x * 14.0 + t * 0.025, 3.7)) - 0.5) * 0.016;
            float edgeDistance = halfWidth - abs(side) + edgeGrain;
            float endFade = smoothstep(0.0, 0.045, uv.x) * (1.0 - smoothstep(0.955, 1.0, uv.x));
            float waterMask = smoothstep(-0.010, 0.012, edgeDistance) * endFade;
            float depthLine = clamp(edgeDistance / max(0.04, halfWidth), 0.0, 1.0);
            float depthNoise = (fbm(uv * vec2(7.0, 17.0) + vec2(-t * 0.045, t * 0.018)) - 0.5) * 0.16;
            float depth = clamp(smoothstep(0.06, 0.9, depthLine) + depthNoise, 0.0, 1.0);
            float alpha = mix(u_alpha_shallow, u_alpha_deep, depth) * waterMask;

            vec3 water = mix(u_water_a, u_water_b, depth * 0.82);
            float sediment = fbm(uv * vec2(6.0, 19.0) + vec2(-t * 0.035, t * 0.012)) - 0.5;
            water += vec3(sediment * 0.09, sediment * 0.10, sediment * 0.075);

            vec2 q = flowCoords(uv, t);
            float ridgeA = sin(q.y * 2.3 + sin(q.x * 0.46) * 0.5 + fbm(q * 0.17) * 0.20);
            float ridgeB = sin(q.y * 4.6 + sin(q.x * 0.94) * 0.3 + fbm(q * 0.28 + 5.6) * 0.20);
            // Wider, pixel-aware highlights stay connected instead of sparkling.
            float band = clamp(10.0 / u_resolution.y, 0.035, 0.085);
            float strandA = 1.0 - smoothstep(0.0, band, abs(ridgeA));
            float strandB = 1.0 - smoothstep(0.0, band * 1.2, abs(ridgeB));
            float caustic = pow(max(0.0, (abs(ridgeA * ridgeB) - 0.45) / 0.55), 7.0);

            vec2 slope = surfaceGradient(q, t);
            vec3 normal = normalize(vec3(-slope * 0.28, 1.0));
            vec3 lightDir = normalize(vec3(-0.12, 0.34, 0.94));
            float specular = pow(max(dot(normal, lightDir), 0.0), 58.0);
            float fresnel = 0.025 + 0.22 * pow(1.0 - max(normal.z, 0.0), 3.0);

            float ripple = 0.0;
            if (u_ripple_age >= 0.0 && u_ripple_age < 1.5) {
              vec2 aspectPoint = (uv - u_pointer) * vec2(u_resolution.x / u_resolution.y, 1.0);
              float radius = length(aspectPoint);
              float age = u_ripple_age;
              float waveA = exp(-abs(radius - age * 0.27) * 52.0);
              float waveB = exp(-abs(radius - max(0.0, age - 0.16) * 0.27) * 48.0);
              ripple = (waveA + waveB * 0.34) * exp(-age * 2.45) * 0.09;
            }

            float brokenLight = smoothstep(0.20, 0.72, noise2(q * vec2(0.7, 0.4)));
            float reflectance = clamp(fresnel + specular * 0.92 + strandA * 0.18 * brokenLight + strandB * 0.08 + caustic * 0.18 + ripple, 0.0, 0.95);
            float skyShade = smoothstep(-0.24, 0.40, normal.y);
            water *= 0.65 + 0.40 * skyShade;
            water = mix(water, u_glint, reflectance * smoothstep(0.0, 0.48, depthLine));
            water = mix(water, u_bank, exp(-abs(edgeDistance) * 78.0) * 0.075);
            gl_FragColor = vec4(water, alpha);
          }
        `;

const getPixelSize = (cssWidth, cssHeight, devicePixelRatio) => {
  if (cssWidth === 0 || cssHeight === 0) return { width: 0, height: 0 };

  const cssArea = cssWidth * cssHeight;
  const areaRatio = Number.isFinite(cssArea)
    ? Math.sqrt(MAX_PIXEL_AREA / cssArea)
    : 0;
  const ratio = Math.min(devicePixelRatio, MAX_PIXEL_RATIO, areaRatio);
  let width = Math.floor(cssWidth * ratio);
  let height = Math.floor(cssHeight * ratio);

  if (width === 0 || height === 0) return { width: 0, height: 0 };
  if (width * height > MAX_PIXEL_AREA) {
    if (width >= height) width = Math.floor(MAX_PIXEL_AREA / height);
    else height = Math.floor(MAX_PIXEL_AREA / width);
  }

  return { width, height };
};

const safeDelete = (gl, method, resource) => {
  if (!resource) return;
  try {
    gl[method](resource);
  } catch {
    // A lost or partially initialized context may reject cleanup calls.
  }
};

const deleteResources = (gl, resources) => {
  safeDelete(gl, "deleteBuffer", resources.buffer);
  safeDelete(gl, "deleteProgram", resources.program);
  for (const shader of resources.shaders)
    safeDelete(gl, "deleteShader", shader);
};

/** Create a WebGL renderer for one water surface. */
export const createWaterRenderer = (canvas) => {
  let gl;
  try {
    gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
    });
  } catch {
    return null;
  }
  if (!gl) return null;

  const resources = { shaders: [], program: null, buffer: null };
  const cleanUp = () => deleteResources(gl, resources);

  try {
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      resources.shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      cleanUp();
      return null;
    }

    resources.program = gl.createProgram();
    if (!resources.program) {
      cleanUp();
      return null;
    }
    gl.attachShader(resources.program, vertex);
    gl.attachShader(resources.program, fragment);
    gl.linkProgram(resources.program);
    if (!gl.getProgramParameter(resources.program, gl.LINK_STATUS)) {
      cleanUp();
      return null;
    }

    resources.buffer = gl.createBuffer();
    if (!resources.buffer) {
      cleanUp();
      return null;
    }

    gl.useProgram(resources.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, resources.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, QUAD_VERTICES, gl.STATIC_DRAW);
    gl.clearColor(0, 0, 0, 0);

    const position = gl.getAttribLocation(resources.program, "a_position");
    if (position < 0) {
      cleanUp();
      return null;
    }
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name) => {
      const location = gl.getUniformLocation(resources.program, name);
      if (location === null || location === undefined) {
        throw new Error(`Missing water shader uniform: ${name}`);
      }
      return location;
    };

    const locations = {
      resolution: uniform("u_resolution"),
      pointer: uniform("u_pointer"),
      time: uniform("u_time"),
      rippleAge: uniform("u_ripple_age"),
      alphaShallow: uniform("u_alpha_shallow"),
      alphaDeep: uniform("u_alpha_deep"),
      waterA: uniform("u_water_a"),
      waterB: uniform("u_water_b"),
      bank: uniform("u_bank"),
      glint: uniform("u_glint"),
    };

    let disposed = false;
    let currentTheme = null;
    let lastCssWidth = -1;
    let lastCssHeight = -1;
    let lastDevicePixelRatio = -1;
    let pixelWidth = 0;
    let pixelHeight = 0;

    const resize = (cssWidth, cssHeight, devicePixelRatio = 1) => {
      if (disposed) return;

      const width = Number.isFinite(cssWidth) ? Math.max(0, cssWidth) : 0;
      const height = Number.isFinite(cssHeight) ? Math.max(0, cssHeight) : 0;
      const ratio =
        Number.isFinite(devicePixelRatio) && devicePixelRatio > 0
          ? Math.min(devicePixelRatio, MAX_PIXEL_RATIO)
          : 1;
      if (
        width === lastCssWidth &&
        height === lastCssHeight &&
        ratio === lastDevicePixelRatio
      ) {
        return;
      }

      lastCssWidth = width;
      lastCssHeight = height;
      lastDevicePixelRatio = ratio;
      const size = getPixelSize(width, height, ratio);
      pixelWidth = size.width;
      pixelHeight = size.height;

      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      if (pixelWidth > 0 && pixelHeight > 0) {
        gl.viewport(0, 0, pixelWidth, pixelHeight);
      }
    };

    const updateTheme = (themeName) => {
      if (themeName === currentTheme) return;
      const palette = themes[themeName];
      gl.uniform1f(locations.alphaShallow, palette.alphaShallow);
      gl.uniform1f(locations.alphaDeep, palette.alphaDeep);
      gl.uniform3fv(locations.waterA, palette.waterA);
      gl.uniform3fv(locations.waterB, palette.waterB);
      gl.uniform3fv(locations.bank, palette.bank);
      gl.uniform3fv(locations.glint, palette.glint);
      currentTheme = themeName;
    };

    const draw = (options = EMPTY_OPTIONS) => {
      if (disposed || pixelWidth === 0 || pixelHeight === 0) return;
      const safeOptions =
        options && typeof options === "object" ? options : EMPTY_OPTIONS;
      const {
        time = 0,
        theme = "light",
        pointer = DEFAULT_POINTER,
        rippleAge = -1,
      } = safeOptions;
      const themeName = theme === "dark" ? "dark" : "light";
      const safePointer =
        pointer && typeof pointer === "object" ? pointer : DEFAULT_POINTER;

      gl.uniform2f(locations.resolution, pixelWidth, pixelHeight);
      gl.uniform2f(
        locations.pointer,
        Number.isFinite(safePointer.x) ? safePointer.x : 0.5,
        Number.isFinite(safePointer.y) ? safePointer.y : 0.5,
      );
      gl.uniform1f(locations.time, Number.isFinite(time) ? time : 0);
      gl.uniform1f(
        locations.rippleAge,
        Number.isFinite(rippleAge) ? rippleAge : -1,
      );
      updateTheme(themeName);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      cleanUp();
    };

    return { resize, draw, dispose };
  } catch {
    cleanUp();
    return null;
  }
};
