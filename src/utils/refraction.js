export const REFRACTION_SCALE = 24;
export const MAX_MAP_WIDTH = 512;
export const MAX_MAP_HEIGHT = 160;
export const MAX_ENCODED_MAPS = 24;

const NEUTRAL_CHANNEL = 128;
const RIM_WIDTH = 16;
const MAX_INWARD_DISPLACEMENT = 8.5;
const encodedMapCache = new Map();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const finiteNonnegative = (value) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

const signFromCenter = (value, center) => (value < center ? -1 : 1);

const roundedRectangleDistance = (x, y, width, height, radius) => {
  const centerX = width / 2;
  const centerY = height / 2;
  const qx = Math.abs(x - centerX) - (width / 2 - radius);
  const qy = Math.abs(y - centerY) - (height / 2 - radius);
  const outsideX = Math.max(qx, 0);
  const outsideY = Math.max(qy, 0);
  const outsideLength = Math.hypot(outsideX, outsideY);
  const signedDistance = outsideLength + Math.min(Math.max(qx, qy), 0) - radius;

  let normalX = 0;
  let normalY = 0;
  if (outsideLength > 0) {
    normalX = (signFromCenter(x, centerX) * outsideX) / outsideLength;
    normalY = (signFromCenter(y, centerY) * outsideY) / outsideLength;
  } else if (qx > qy) {
    normalX = signFromCenter(x, centerX);
  } else {
    normalY = signFromCenter(y, centerY);
  }

  return { signedDistance, normalX, normalY };
};

/**
 * Build a small RG displacement field in logical surface coordinates. Pixels
 * outside the rounded rectangle and beyond its inner rim stay neutral gray.
 */
export const generateRefractionField = (width, height, cornerRadius = 0) => {
  const logicalWidth = finiteNonnegative(width);
  const logicalHeight = finiteNonnegative(height);
  if (logicalWidth === 0 || logicalHeight === 0) {
    return {
      width: 0,
      height: 0,
      logicalWidth,
      logicalHeight,
      cornerRadius: 0,
      pixels: new Uint8ClampedArray(0),
    };
  }

  const radius = clamp(
    finiteNonnegative(cornerRadius),
    0,
    Math.min(logicalWidth, logicalHeight) / 2,
  );
  const samplingScale = Math.min(
    1,
    MAX_MAP_WIDTH / logicalWidth,
    MAX_MAP_HEIGHT / logicalHeight,
  );
  const mapWidth = Math.max(
    1,
    Math.min(MAX_MAP_WIDTH, Math.ceil(logicalWidth * samplingScale)),
  );
  const mapHeight = Math.max(
    1,
    Math.min(MAX_MAP_HEIGHT, Math.ceil(logicalHeight * samplingScale)),
  );
  const pixels = new Uint8ClampedArray(mapWidth * mapHeight * 4);

  for (let yIndex = 0; yIndex < mapHeight; yIndex += 1) {
    const y = ((yIndex + 0.5) * logicalHeight) / mapHeight;
    for (let xIndex = 0; xIndex < mapWidth; xIndex += 1) {
      const x = ((xIndex + 0.5) * logicalWidth) / mapWidth;
      const offset = (yIndex * mapWidth + xIndex) * 4;
      let red = NEUTRAL_CHANNEL;
      let green = NEUTRAL_CHANNEL;

      const { signedDistance, normalX, normalY } = roundedRectangleDistance(
        x,
        y,
        logicalWidth,
        logicalHeight,
        radius,
      );
      const innerDepth = -signedDistance;
      if (innerDepth > 0 && innerDepth < RIM_WIDTH) {
        const displacement =
          MAX_INWARD_DISPLACEMENT *
          Math.sin((Math.PI * innerDepth) / RIM_WIDTH);
        const channelDelta = (displacement / REFRACTION_SCALE) * 255;
        // feDisplacementMap samples opposite the outward surface normal.
        red = clamp(
          Math.round(NEUTRAL_CHANNEL - normalX * channelDelta),
          0,
          255,
        );
        green = clamp(
          Math.round(NEUTRAL_CHANNEL - normalY * channelDelta),
          0,
          255,
        );
      }

      pixels[offset] = red;
      pixels[offset + 1] = green;
      pixels[offset + 2] = NEUTRAL_CHANNEL;
      pixels[offset + 3] = 255;
    }
  }

  return {
    width: mapWidth,
    height: mapHeight,
    logicalWidth,
    logicalHeight,
    cornerRadius: radius,
    pixels,
  };
};

const quantizeLogicalSize = (value) => Math.round(value * 2) / 2;

/** Encode and cache a field as a PNG data URL for SVG feImage. */
export const getRefractionMapDataUrl = (width, height, cornerRadius) => {
  const logicalWidth = quantizeLogicalSize(finiteNonnegative(width));
  const logicalHeight = quantizeLogicalSize(finiteNonnegative(height));
  const radius = Math.min(
    quantizeLogicalSize(finiteNonnegative(cornerRadius)),
    logicalWidth / 2,
    logicalHeight / 2,
  );
  if (logicalWidth === 0 || logicalHeight === 0) return null;

  const key = `${logicalWidth}:${logicalHeight}:${radius}`;
  const cached = encodedMapCache.get(key);
  if (cached) {
    encodedMapCache.delete(key);
    encodedMapCache.set(key, cached);
    return cached;
  }

  try {
    const field = generateRefractionField(logicalWidth, logicalHeight, radius);
    const canvas = document.createElement("canvas");
    canvas.width = field.width;
    canvas.height = field.height;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const image = context.createImageData(field.width, field.height);
    image.data.set(field.pixels);
    context.putImageData(image, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    encodedMapCache.set(key, dataUrl);
    if (encodedMapCache.size > MAX_ENCODED_MAPS) {
      const oldestKey = encodedMapCache.keys().next().value;
      encodedMapCache.delete(oldestKey);
    }
    return dataUrl;
  } catch {
    // Canvas encoding can be unavailable in restricted or unusual contexts.
    return null;
  }
};
