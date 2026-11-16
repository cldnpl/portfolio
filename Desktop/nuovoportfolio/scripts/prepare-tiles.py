#!/usr/bin/env python3
"""
The four service tiles (Swift, Kotlin, visionOS, UX): glossy "inflated"
rounded squares, like the ones on butter.video. They sit inside the service
titles and fly into the dark panel below them.

The SF Symbols come from `swift scripts/render-symbols.swift art/symbols`;
the Kotlin logo from `scripts/prepare-logos.py`.

    python3 scripts/prepare-tiles.py
"""
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SYMBOLS = ROOT / "art/symbols"
OUT = ROOT / "public/images/services"
SIZE = 720
SS = 2  # supersampling


def rgb(value: str) -> tuple:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def gradient(size, stops, angle="vertical") -> Image.Image:
    """Linear gradient through (position, colour) stops."""
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    cols = [(p, rgb(c)) for p, c in stops]
    for y in range(h):
        for x in range(w):
            t = y / (h - 1) if angle == "vertical" else (x / (w - 1) + (1 - y / (h - 1))) / 2
            for (p0, c0), (p1, c1) in zip(cols, cols[1:]):
                if p0 <= t <= p1:
                    k = (t - p0) / (p1 - p0 or 1)
                    px[x, y] = tuple(round(a + (b - a) * k) for a, b in zip(c0, c1))
                    break
    return img


def rounded_mask(size, radius) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


def inflate(base: Image.Image) -> Image.Image:
    """Soft 3D: light from the top left, shade at the bottom, a thin rim."""
    s = base.size[0]
    tile = base.convert("RGBA")
    mask = rounded_mask(base.size, round(s * 0.24))

    glow = Image.new("L", base.size, 0)
    ImageDraw.Draw(glow).ellipse((-s * 0.25, -s * 0.35, s * 0.85, s * 0.55), fill=150)
    glow = glow.filter(ImageFilter.GaussianBlur(s * 0.12))
    tile = Image.composite(Image.new("RGBA", base.size, (255, 255, 255, 255)), tile, glow.point(lambda a: a * 0.55))

    shade = Image.new("L", base.size, 0)
    ImageDraw.Draw(shade).rectangle((0, s * 0.62, s, s), fill=120)
    shade = shade.filter(ImageFilter.GaussianBlur(s * 0.14))
    tile = Image.composite(Image.new("RGBA", base.size, (0, 0, 0, 255)), tile, shade.point(lambda a: a * 0.4))

    # inner rim: bright top edge, dark bottom edge
    edge = mask.filter(ImageFilter.GaussianBlur(s * 0.02))
    inner = ImageChops.subtract(mask, edge)
    top = Image.new("L", base.size, 0)
    ImageDraw.Draw(top).rectangle((0, 0, s, s * 0.5), fill=255)
    top = top.filter(ImageFilter.GaussianBlur(s * 0.15))
    tile = Image.composite(Image.new("RGBA", base.size, (255, 255, 255, 255)), tile, ImageChops.multiply(inner, top).point(lambda a: a * 0.9))
    bottom = ImageChops.invert(top)
    tile = Image.composite(Image.new("RGBA", base.size, (0, 0, 0, 255)), tile, ImageChops.multiply(inner, bottom).point(lambda a: a * 0.5))

    tile.putalpha(mask)
    return tile


def place_symbol(tile: Image.Image, symbol: Image.Image, scale: float, colour=(255, 255, 255), dy=0.0) -> Image.Image:
    s = tile.size[0]
    alpha = symbol.split()[3]
    bbox = alpha.getbbox()
    alpha = alpha.crop(bbox)
    k = s * scale / max(alpha.size)
    alpha = alpha.resize((round(alpha.width * k), round(alpha.height * k)), Image.LANCZOS)
    x = (s - alpha.width) // 2
    y = (s - alpha.height) // 2 + round(s * dy)
    shadow = Image.new("RGBA", tile.size, (0, 0, 0, 0))
    shadow.paste(Image.new("RGBA", alpha.size, (0, 0, 0, 90)), (x, y + round(s * 0.02)), alpha)
    out = tile.copy()
    out.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(s * 0.02)))
    out.paste(Image.new("RGBA", alpha.size, colour + (255,)), (x, y), alpha)
    return out


def save(img: Image.Image, name: str) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img = img.resize((SIZE, SIZE), Image.LANCZOS)
    img.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6)
    print(f"services/{name}.webp {SIZE}x{SIZE}")


S = SIZE * SS
sym = lambda n: Image.open(SYMBOLS / f"{n}.png").convert("RGBA")

swift = inflate(gradient((S, S), [(0, "#FB9B3F"), (1, "#F2362A")]))
save(place_symbol(swift, sym("swift"), 0.56, dy=0.01), "ios")

# Kotlin: the logo she chose (art/logos/kotlin-2016-clean.png, made by
# prepare-logos.py), on a white tile like the one it was designed for.
kotlin = inflate(gradient((S, S), [(0, "#FFFFFF"), (1, "#DADCE3")]))
logo = Image.open(ROOT / "art/logos/kotlin-2016-clean.png").convert("RGBA")
side = round(S * 0.5)
logo = logo.resize((side, round(side * logo.height / logo.width)), Image.LANCZOS)
kotlin.alpha_composite(logo, ((S - logo.width) // 2, (S - logo.height) // 2))
save(kotlin, "android")

vision = inflate(gradient((S, S), [(0, "#F4F4F7"), (1, "#C9CAD2")]))
save(place_symbol(vision, sym("visionpro"), 0.62, colour=(28, 28, 32)), "spatial")

ux = inflate(gradient((S, S), [(0, "#F7B6DA"), (0.5, "#C9B4F6"), (1, "#9FD3F6")], angle="diagonal"))
save(place_symbol(ux, sym("brain.head.profile"), 0.54), "ux")
