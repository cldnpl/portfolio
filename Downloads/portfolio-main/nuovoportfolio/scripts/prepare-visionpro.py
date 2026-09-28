#!/usr/bin/env python3
"""
LiveChess preview for the home page: the capture inside an Apple Vision Pro
seen from the front, on a transparent background (like the iPhones).

The headset outline is the `visionpro` SF Symbol (rendered by
scripts/render-symbols.swift): its ring becomes the aluminium-and-glass
frame, its hole the curved display where the capture goes.

    python3 scripts/prepare-visionpro.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "art"
OUT = ROOT / "public/images/work/livechess"
CAPTURE = ART / "lc-room.jpg"
VARIANTS = (640, 1200, 1800)


def headset(width: int, capture: Image.Image) -> Image.Image:
    ring = Image.open(ART / "symbols/visionpro.png").split()[3]
    ring = ring.crop(ring.getbbox())
    scale = width / ring.width
    ring = ring.resize((width, round(ring.height * scale)), Image.LANCZOS)
    w, h = ring.size

    # body = the ring with its hole filled; display = the hole
    solid = np.asarray(ring) > 127
    body = ndimage.binary_fill_holes(solid)
    hole = body & ~solid
    body_m = Image.fromarray((body * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    hole_m = Image.fromarray((hole * 255).astype(np.uint8))
    # the glass reaches a little under the frame, so no hairline shows between them
    screen_m = hole_m.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(0.8))

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))

    # frame: dark graphite, lighter along the top like brushed aluminium
    frame = Image.new("RGB", (w, h))
    top, bottom = np.array([112, 116, 126]), np.array([22, 23, 27])
    ramp = np.linspace(0, 1, h)[:, None, None] ** 0.7
    frame = Image.fromarray((top + (bottom - top) * ramp).repeat(w, axis=1).astype(np.uint8))
    out.paste(frame, (0, 0), body_m)

    # a bright rim on the outer edge, strongest at the top
    edge = ImageChops.subtract(body_m, body_m.filter(ImageFilter.MinFilter(9)))
    fade = Image.fromarray((255 * (1 - np.linspace(0, 1, h)) ** 1.5).astype(np.uint8)[:, None].repeat(w, axis=1))
    out.paste(Image.new("RGB", (w, h), (230, 233, 240)), (0, 0), ImageChops.multiply(edge, fade))

    # the display: the capture, cover-cropped to the hole's box
    x0, y0, x1, y1 = hole_m.getbbox()
    bw, bh = x1 - x0, y1 - y0
    # The board sits at the bottom centre of the capture, exactly where the
    # nose bridge is: zoom in a little and lift it so its front edge
    # (95% down the capture) lands at 70% of the display, above the bridge.
    zoom = 1.3
    k = max(bw / capture.width, bh / capture.height) * zoom
    shot = capture.resize((round(capture.width * k), round(capture.height * k)), Image.LANCZOS)
    left = (shot.width - bw) // 2
    top_px = min(max(round(shot.height * 0.95 - bh * 0.70), 0), shot.height - bh)
    shot = shot.crop((left, top_px, left + bw, top_px + bh))
    layer = Image.new("RGB", (w, h))
    layer.paste(shot, (x0, y0))

    # curved glass: darker towards the edges, a soft reflection across the top
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    d = np.sqrt(((xx - cx) / (bw / 2)) ** 2 + ((yy - cy) / (bh / 2)) ** 2)
    vignette = np.clip(1 - 0.35 * np.clip(d - 0.55, 0, 1) ** 1.4, 0, 1)
    arr = np.asarray(layer).astype(float) * vignette[:, :, None]
    shine = np.clip(1 - (yy - y0) / (bh * 0.45), 0, 1) ** 2 * 0.16
    arr = arr + (255 - arr) * shine[:, :, None]
    layer = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    out.paste(layer, (0, 0), screen_m)

    # glass edge: a thin dark line where the display meets the frame
    inner = ImageChops.subtract(hole_m.filter(ImageFilter.MaxFilter(7)), hole_m.filter(ImageFilter.MinFilter(3)))
    out.paste(Image.new("RGB", (w, h), (8, 8, 10)), (0, 0), inner.point(lambda a: a * 0.8))
    return out


def place(canvas_size, device: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    canvas.alpha_composite(device, ((canvas_size[0] - device.width) // 2, (canvas_size[1] - device.height) // 2))
    return canvas


def save(img: Image.Image, name: str) -> None:
    path = OUT / f"{name}.webp"
    img.save(path, "WEBP", quality=90, method=6)
    for w in VARIANTS:
        small = img if w >= img.width else img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
        small.save(OUT / f"{name}-{w}.webp", "WEBP", quality=90, method=6)
    print(f"work/livechess/{name}.webp {img.width}x{img.height}")


capture = Image.open(CAPTURE).convert("RGB")
save(place((2400, 1350), headset(2150, capture)), "cover")      # home preview, 16:9
save(place((1600, 2000), headset(1500, capture)), "portrait")   # "next project", 4:5
