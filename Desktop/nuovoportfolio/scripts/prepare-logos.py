#!/usr/bin/env python3
"""
Logos for the platform strip under the hero, and the Kotlin logo for the
service tile.

- " iOS" and " Vision Pro": set the way Apple sets them, the Apple logo
  and the name in SF Pro (the system font), black on transparent.
- Android: the official logo (bugdroid + wordmark). The copy we had came with
  a transparency checkerboard painted into the pixels; it is un-blended here
  back to real transparency.
- Kotlin: the logo from ~/Downloads/kotlinlogo.png, white background removed.

    python3 scripts/prepare-logos.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "art/logos"
OUT = ROOT / "public/images/logos"
SF = "/System/Library/Fonts/SFNS.ttf"
APPLE = ""
HEIGHT = 120  # px of the saved logos; shown at ~30px, so crisp at 3x and beyond


def trim(img: Image.Image, pad: int = 2) -> Image.Image:
    box = img.split()[3].getbbox()
    return img.crop((max(box[0] - pad, 0), max(box[1] - pad, 0), box[2] + pad, box[3] + pad))


def lockup(text: str, weight: int) -> Image.Image:
    """Apple logo + name in SF Pro Display, black, trimmed to the ink."""
    size = 400
    font = ImageFont.truetype(SF, size)
    font.set_variation_by_axes([100, 96, 400, weight])  # width, optical size (Display), grade, weight
    canvas = Image.new("RGBA", (size * 8, size * 2), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).text((size // 4, size // 3), f"{APPLE} {text}", font=font, fill=(0, 0, 0, 255))
    return trim(canvas)


def wordmark(text: str, weight: int) -> Image.Image:
    """A current Apple wordmark (macOS, watchOS): the name alone in SF Pro.
    Cropped vertically to the same band as the Apple logo in lockup(), so at
    the same CSS height the letters match the ones of " iOS"."""
    size = 400
    font = ImageFont.truetype(SF, size)
    font.set_variation_by_axes([100, 96, 400, weight])
    apple = ImageFont.truetype(SF, size)
    apple.set_variation_by_axes([100, 96, 400, 500])
    canvas = Image.new("RGBA", (size * 8, size * 2), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).text((size // 4, size // 3), APPLE, font=apple, fill=(0, 0, 0, 255))
    top, bottom = canvas.split()[3].getbbox()[1], canvas.split()[3].getbbox()[3]
    canvas = Image.new("RGBA", (size * 8, size * 2), (0, 0, 0, 0))
    ImageDraw.Draw(canvas).text((size // 4, size // 3), text, font=font, fill=(0, 0, 0, 255))
    left, _, right, _ = canvas.split()[3].getbbox()
    return canvas.crop((left - 2, top - 2, right + 2, bottom + 2))


def unblend(img: Image.Image, colours) -> Image.Image:
    """Recover alpha from a logo flattened onto a 16px grey/white checkerboard,
    assuming every pixel is one of `colours` over the checker."""
    p = np.asarray(img.convert("RGB")).astype(float)
    h, w, _ = p.shape
    # rebuild the checkerboard: each cell takes the brightest neutral value found in it
    bg = np.full((h, w), 255.0)
    for y0 in range(2 - 16, h, 16):
        for x0 in range(2 - 16, w, 16):
            ys, xs = slice(max(y0, 0), y0 + 16), slice(max(x0, 0), x0 + 16)
            cell = p[ys, xs]
            neutral = cell[(cell.max(axis=2) - cell.min(axis=2) < 6) & (cell.min(axis=2) > 225)]
            parity = (((x0 - 2) // 16) + ((y0 - 2) // 16)) % 2
            bg[ys, xs] = np.median(neutral[:, 0]) if len(neutral) else (235.0 if parity else 255.0)
    b = np.repeat(bg[:, :, None], 3, axis=2)

    best_alpha = np.zeros((h, w))
    best_col = np.zeros((h, w, 3))
    best_err = np.full((h, w), np.inf)
    for c in colours:
        c = np.array(c, float)
        d = c[None, None, :] - b
        a = np.clip(((p - b) * d).sum(axis=2) / np.maximum((d * d).sum(axis=2), 1e-6), 0, 1)
        err = ((b + a[:, :, None] * d - p) ** 2).sum(axis=2)
        pick = err < best_err
        best_err[pick], best_alpha[pick] = err[pick], a[pick]
        best_col[pick] = c
    # what is left of the checker itself: light, colourless pixels
    lum = p.mean(axis=2)
    neutral = (p.max(axis=2) - p.min(axis=2)) < 10
    best_alpha[neutral & (lum > 212)] = 0
    best_alpha[best_alpha < 0.08] = 0
    rgba = np.dstack([best_col, best_alpha * 255]).astype(np.uint8)
    return trim(Image.fromarray(rgba, "RGBA"))


def unwhite(img: Image.Image) -> Image.Image:
    """Remove a flat white background, keeping soft edges."""
    p = np.asarray(img.convert("RGB")).astype(float)
    a = 1 - p.min(axis=2) / 255
    a[a < 0.03] = 0
    safe = np.maximum(a, 1e-6)[:, :, None]
    fg = np.clip((p - (1 - a[:, :, None]) * 255) / safe, 0, 255)
    return trim(Image.fromarray(np.dstack([fg, a * 255]).astype(np.uint8), "RGBA"))


def save(img: Image.Image, name: str, height: int = HEIGHT) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img = img.resize((round(img.width * height / img.height), height), Image.LANCZOS)
    img.save(OUT / f"{name}.png", optimize=True)
    print(f"logos/{name}.png {img.width}x{img.height}")


save(lockup("iOS", 500), "ios")
save(lockup("Vision Pro", 400), "vision-pro")
# The watchOS file she sent (art/logos/watchos-wikimedia.svg) is the 2015
# wordmark in Myriad; Apple's current ones are SF Pro, like the macOS she sent.
save(wordmark("macOS", 600), "macos")
save(wordmark("watchOS", 600), "watchos")
save(unblend(Image.open(SRC / "android-checker.png"), [(0, 0, 0), (61, 220, 132)]), "android")
# the source is a screenshot with a thin grey rule along its top and bottom edges
k = Image.open(SRC / "kotlin-2016.png")
kotlin = unwhite(k.crop((6, 6, k.width - 6, k.height - 6)))
kotlin.save(SRC / "kotlin-2016-clean.png")
print("art/logos/kotlin-2016-clean.png", kotlin.size)
