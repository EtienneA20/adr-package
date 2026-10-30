import { describe, expect, it } from "vitest";

import { isImageFile } from "./is-image-file";

describe("isImageFile", () => {
  it.each([
    "couverture.jpg",
    "couverture.JPEG",
    "logo.png",
    "logo.svg",
    "photo.webp",
    "photo.avif",
    "photo.heic",
    "/uploads/anim.gif",
    "C:\\Images\\scan.tiff",
  ])("reconnaît l'image %j", (fileName) => {
    expect(isImageFile(fileName)).toBe(true);
  });

  it.each(["notice.pdf", "catalogue.xlsx", "video.mp4", "LISEZMOI", "", "jpg"])(
    "ne considère pas %j comme une image",
    (fileName) => {
      expect(isImageFile(fileName)).toBe(false);
    },
  );
});
