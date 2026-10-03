import {
  generateRefractionField,
  MAX_MAP_HEIGHT,
  MAX_MAP_WIDTH,
} from "./refraction";

const channelAt = (field, x, y, channel) =>
  field.pixels[(y * field.width + x) * 4 + channel];

test("keeps the interior center and rounded-corner exterior neutral", () => {
  const field = generateRefractionField(160, 100, 20);

  expect(channelAt(field, 80, 50, 0)).toBe(128);
  expect(channelAt(field, 80, 50, 1)).toBe(128);
  expect(channelAt(field, 0, 0, 0)).toBe(128);
  expect(channelAt(field, 0, 0, 1)).toBe(128);
});

test("encodes inward sampling symmetrically along opposite edges", () => {
  const field = generateRefractionField(160, 100, 20);
  const leftRed = channelAt(field, 3, 50, 0);
  const rightRed = channelAt(field, 156, 50, 0);
  const topGreen = channelAt(field, 80, 3, 1);
  const bottomGreen = channelAt(field, 80, 96, 1);

  expect(leftRed).toBeGreaterThan(128);
  expect(rightRed).toBeLessThan(128);
  expect(leftRed + rightRed).toBe(256);
  expect(topGreen).toBeGreaterThan(128);
  expect(bottomGreen).toBeLessThan(128);
  expect(topGreen + bottomGreen).toBe(256);
});

test("concentrates a bounded bend near the rim and clears before the center", () => {
  const field = generateRefractionField(160, 100, 20);
  const outerRim = channelAt(field, 0, 50, 0);
  const strongestRim = channelAt(field, 10, 50, 0);
  const innerRim = channelAt(field, 138, 50, 0);

  expect(Math.abs(strongestRim - 128)).toBeGreaterThan(
    Math.abs(outerRim - 128),
  );
  expect(Math.abs(strongestRim - 128)).toBeGreaterThan(
    Math.abs(innerRim - 128),
  );
  expect(channelAt(field, 80, 50, 0)).toBe(128);
  expect(channelAt(field, 80, 50, 1)).toBe(128);

  const maxChannelOffset = field.pixels.reduce((maximum, value, index) => {
    if (index % 4 > 1) return maximum;
    return Math.max(maximum, Math.abs(value - 128));
  }, 0);
  expect((maxChannelOffset * 24) / 255).toBeLessThanOrEqual(11.1);
});

test("bounds map buffers and returns an empty field for zero-sized surfaces", () => {
  const largeField = generateRefractionField(10000, 5000, 24);
  expect(largeField.width).toBeLessThanOrEqual(MAX_MAP_WIDTH);
  expect(largeField.height).toBeLessThanOrEqual(MAX_MAP_HEIGHT);
  expect(largeField.pixels).toHaveLength(
    largeField.width * largeField.height * 4,
  );

  const zeroField = generateRefractionField(0, 80, 12);
  expect(zeroField.width).toBe(0);
  expect(zeroField.height).toBe(0);
  expect(zeroField.pixels).toHaveLength(0);
});
