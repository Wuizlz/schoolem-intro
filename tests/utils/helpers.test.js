import { jest } from "@jest/globals";

const imageCompression = jest.fn(async (file, _options) => file);

jest.unstable_mockModule("browser-image-compression", () => ({
  default: imageCompression,
}));

const { formatRelative, downscaleFile } =
  await import("../../src/utils/helpers.js");

describe("formatRelative", () => {
  const base = new Date("2026-03-06T12:00:00.000Z").getTime();

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValue(base);
  });

  afterEach(() => {
    Date.now.mockRestore();
  });

  test("returns now for <5 seconds", () => {
    const date = new Date(base - 3000).toISOString();
    expect(formatRelative(date)).toBe("now");
  });

  test("returns seconds, minutes, hours, days", () => {
    expect(formatRelative(new Date(base - 30_000).toISOString())).toBe("30s");
    expect(formatRelative(new Date(base - 2 * 60_000).toISOString())).toBe(
      "2m",
    );
    expect(formatRelative(new Date(base - 5 * 60 * 60_000).toISOString())).toBe(
      "5h",
    );
    expect(
      formatRelative(new Date(base - 2 * 24 * 60 * 60_000).toISOString()),
    ).toBe("2d");
  });
});

describe("downscaleFile", () => {
  test("calls browser-image-compression with expected options", async () => {
    const file = new File([new Uint8Array([1, 2, 3])], "photo.png", {
      type: "image/png",
    });

    await downscaleFile(file);

    expect(imageCompression).toHaveBeenCalledWith(
      file,
      expect.objectContaining({
        maxWidthOrHeight: 1400,
        maxSizeMB: 0.8,
        initialQuality: 0.75,
        fileType: "image/webp",
        useWebWorker: true,
      }),
    );
  });
});
