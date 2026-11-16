#!/usr/bin/env python3
"""
Builds every image the site serves from the original captures.

The reference layout wants landscape covers (16:9) and 4:5 gallery frames,
while the apps are phone screens, so each cover is composed here: one or two
captures inside an iPhone, on a transparent background. The site background,
white marble with gold veins, comes from art/marble-gold.jpg.

Sources (outside this folder, override with the env vars):
  WORK_SRC   ~/Downloads/portfolio-main/public/work    720px captures
  ART_SRC    ~/Desktop/dametterenelport/art            larger originals

    python3 scripts/prepare-images.py
"""
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

HOME = Path.home()
WORK = Path(os.environ.get("WORK_SRC", HOME / "Downloads/portfolio-main/public/work"))
ART = Path(os.environ.get("ART_SRC", HOME / "Desktop/dametterenelport/art"))
ABOUT = HOME / "Downloads/portfolio-main/public/about"
OUT = Path(__file__).resolve().parent.parent / "public/images"

# Prefer the larger original when there is one.
BIGGER = {
    "farnesina-ios.jpg": ART / "farnesina-home.png",
    "farnesina-country.jpg": ART / "farnesina-country.png",
    "asti-login.jpg": ART / "asti-login.png",
    "asti-pin.jpg": ART / "asti-pin.png",
    "leyla-home.jpg": ART / "leyla-home.png",
    "livechess-board.jpg": ART / "livechess-board.webp",
}


def load(name: str) -> Image.Image:
    src = BIGGER.get(name)
    path = src if src and src.exists() else WORK / name
    return Image.open(path).convert("RGB")


SF_PRO = "/System/Library/Fonts/SFNS.ttf"


def modern_status_bar(screen: Image.Image, time: str, clear_to: int) -> Image.Image:
    """The Banca di Asti captures come from the bank's guide, shot on a phone
    with the old centred status bar (plus the mockup's corners). Inside an
    iPhone with a Dynamic Island that bar would sit under the island, so the
    top is cleared and redrawn the modern way: time left, signal and battery
    right, both centred on the island."""
    img = screen.copy()
    w, h = img.size
    pt = w / 393  # iPhone 15 points
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, w, clear_to), fill=img.getpixel((w // 2, clear_to + 2)))
    mid = round(h * 0.0125 + w * 0.093 / 2)
    ink = (0, 0, 0)

    font = ImageFont.truetype(SF_PRO, round(17 * pt))
    font.set_variation_by_name("Semibold")
    draw.text((w * 0.17, mid), time, font=font, fill=ink, anchor="mm")

    right = w - w * 0.17
    bw, bh, r = 25 * pt, 12 * pt, 3.8 * pt
    bx, by = right - bw / 2 + 8 * pt, mid - bh / 2
    draw.rounded_rectangle((bx, by, bx + bw, by + bh), r, outline=(120, 120, 120), width=max(1, round(pt)))
    inset = 2 * pt
    draw.rounded_rectangle((bx + inset, by + inset, bx + inset + (bw - 2 * inset) * 0.77, by + bh - inset), r * 0.6, fill=ink)
    draw.rounded_rectangle((bx + bw + pt, mid - 2 * pt, bx + bw + 2.5 * pt, mid + 2 * pt), pt, fill=(120, 120, 120))

    sx = bx - 7 * pt - 17 * pt
    for i in range(4):
        bar_h = (4 + i * 2.4) * pt
        x0 = sx + i * 4.6 * pt
        draw.rounded_rectangle((x0, mid + 5.5 * pt - bar_h, x0 + 3 * pt, mid + 5.5 * pt), pt, fill=ink)
    return img


def device(screen: Image.Image, screen_h: int, scale: int = 3) -> Image.Image:
    """The capture inside an iPhone: titanium rim, black bezel, Dynamic Island,
    side buttons. Drawn at `scale`x and reduced, for clean edges."""
    sh = screen_h * scale
    sw = round(sh * screen.width / screen.height)
    bezel = round(sw * 0.051)
    bw, bh = sw + 2 * bezel, sh + 2 * bezel
    radius = round(bw * 0.165)
    pad = round(bw * 0.014)
    img = Image.new("RGBA", (bw + 2 * pad, bh), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    button = (44, 44, 46, 255)
    nub = round(bw * 0.012)
    for y0, y1 in ((0.190, 0.228), (0.268, 0.345), (0.370, 0.447)):
        draw.rounded_rectangle((pad - nub, bh * y0, pad + nub * 3, bh * y1), nub, fill=button)
    draw.rounded_rectangle((pad + bw - nub * 3, bh * 0.316, pad + bw + nub, bh * 0.434), nub, fill=button)

    rim = max(2, round(bw * 0.009))
    draw.rounded_rectangle((pad, 0, pad + bw - 1, bh - 1), radius, fill=(92, 92, 96, 255))
    draw.rounded_rectangle((pad + rim, rim, pad + bw - 1 - rim, bh - 1 - rim), radius - rim, fill=(30, 30, 32, 255))
    inner = round(bezel * 0.32)
    draw.rounded_rectangle(
        (pad + inner, inner, pad + bw - 1 - inner, bh - 1 - inner), radius - inner, fill=(6, 6, 6, 255)
    )

    shot = screen.resize((sw, sh), Image.LANCZOS)
    mask = Image.new("L", (sw, sh), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, sw - 1, sh - 1), radius - bezel, fill=255)
    img.paste(shot, (pad + bezel, bezel), mask)

    iw, ih = round(sw * 0.318), round(sw * 0.093)
    ix, iy = pad + bezel + (sw - iw) // 2, bezel + round(sh * 0.0125)
    draw.rounded_rectangle((ix, iy, ix + iw, iy + ih), ih // 2, fill=(0, 0, 0, 255))
    lens = round(ih * 0.26)
    cx, cy = ix + iw - ih // 2, iy + ih // 2
    draw.ellipse((cx - lens, cy - lens, cx + lens, cy + lens), fill=(16, 20, 34, 255))
    glint = max(1, lens // 3)
    draw.ellipse((cx - glint, cy - lens // 2 - glint, cx + glint, cy - lens // 2 + glint), fill=(40, 52, 84, 255))

    return img.resize((round(img.width / scale), round(img.height / scale)), Image.LANCZOS)


def compose(screens, size, fill=0.74) -> Image.Image:
    """Just the phones, on a transparent canvas: no wall, no shadow. The fill
    leaves room for the gallery parallax, which crops up to ~8% top and bottom."""
    w, h = size
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    height = round(h * fill)
    layers = [device(s, round(height / 1.1)) for s in screens]
    gap = round(height * 0.10)
    total = sum(l.width for l in layers) + gap * (len(layers) - 1)
    x = (w - total) // 2
    for i, layer in enumerate(layers):
        # a small stagger between the phones
        shift = round(layer.height * 0.04) * (1 if i % 2 else -1) if len(layers) > 1 else 0
        canvas.alpha_composite(layer, (x, (h - layer.height) // 2 + shift))
        x += layer.width + gap
    return canvas


def cover_crop(img: Image.Image, size) -> Image.Image:
    w, h = size
    scale = max(w / img.width, h / img.height)
    resized = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = (resized.width - w) // 2
    top = (resized.height - h) // 2
    return resized.crop((left, top, left + w, top + h))


# Narrower copies for src/lib/imageLoader.ts, so a phone never decodes a
# 2400px cover. Every width exists for every image (a copy when the original
# is already narrower), so the loader never points at a missing file.
VARIANTS = (640, 1200, 1800)


def save(img: Image.Image, rel: str, quality=84) -> None:
    path = OUT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "WEBP", quality=quality, method=6)
    print(f"{rel:48s} {img.size[0]}x{img.size[1]}  {path.stat().st_size // 1024} KB")
    for w in VARIANTS:
        small = img if w >= img.width else img.resize((w, round(img.height * w / img.width)), Image.LANCZOS)
        small.save(path.with_name(f"{path.stem}-{w}.webp"), "WEBP", quality=quality, method=6)


COVER = (2400, 1350)
FRAME = (1600, 2000)

# Each project lists the images to build. On a project page every capture
# appears once: "stage" (two phones) and "trio" (three) or the "frame-*" pair
# (4:5, one phone each). "cover" is the home-page preview, phones as large as
# the 16:9 box allows; "portrait" is the one-phone image of "next project".
PROJECTS = {
    "viaggiare-sicuri": {
        "cover": ["vs-home.png", "vs-country.png"],
        "stage": ["vs-home.png", "vs-country.png"],
        "trio": ["vs-countries.png", "vs-map.png", "vs-alerts.png"],
        "portrait": ["vs-home.png"],
    },
    "banca-di-asti": {
        "cover": ["asti-login.jpg", "asti-pin.jpg"],
        "frame-1": ["asti-login.jpg"],
        "frame-2": ["asti-pin.jpg"],
        "portrait": ["asti-login.jpg"],
    },
    "leyla": {
        "cover": ["leyla-ios.jpg", "leyla-home.png"],
        "stage": ["leyla-ios.jpg", "leyla-home.png"],
        "trio": ["leyla-games.png", "leyla-journal.png", "leyla-quiz.png"],
        "portrait": ["leyla-home.png"],
    },
}

# Full-resolution iPhone captures kept with the project.
LOCAL = Path(__file__).resolve().parent.parent / "art"
MARBLE = LOCAL / "marble-gold.jpg"
STATUS_BAR = {"asti-login.jpg": "10:25", "asti-pin.jpg": "10:26"}


def capture(name: str) -> Image.Image:
    if (LOCAL / name).exists():
        return Image.open(LOCAL / name).convert("RGB")
    img = load(name)
    if name in STATUS_BAR:
        img = modern_status_bar(img, STATUS_BAR[name], clear_to=round(img.height * 0.078))
    return img


for slug, images in PROJECTS.items():
    for out, names in images.items():
        screens = [capture(n) for n in names]
        if out == "portrait":
            img = compose(screens, FRAME, fill=0.86)
        elif out.startswith("frame"):
            img = compose(screens, FRAME, fill=0.72)
        elif out == "cover":
            # home preview: no parallax crop inside the box, so it can be fuller
            img = compose(screens, COVER, fill=0.95)
        else:
            # gallery rows: the parallax crops up to ~8% top and bottom
            img = compose(screens, COVER, fill=0.74)
        save(img, f"work/{slug}/{out}.webp", quality=90)

# The whole site sits on white marble with gold veins.
save(Image.open(MARBLE).convert("RGB"), "marble.webp", quality=82)

# LiveChess runs on Apple Vision Pro: the captures are already landscape.
# (the home-page cover, the capture inside a Vision Pro, is made by
# scripts/prepare-visionpro.py, not here)
LIVECHESS = {
    "room": "lc-room.jpg",
    "lobby": "lc-lobby.jpg",
    "pieces": "lc-pieces.jpg",
    "virtual": "lc-virtual.jpg",
}
for out, name in LIVECHESS.items():
    save(cover_crop(capture(name), COVER), f"work/livechess/{out}.webp", quality=86)

# The portrait on the pink wall, cut to the 2:3 frame the hero uses.
portrait = Image.open(ART / "about/portrait-2026.webp").convert("RGB")
crop_w = round(portrait.height * 2 / 3)
left = (portrait.width - crop_w) // 2
portrait = portrait.crop((left, 0, left + crop_w, portrait.height))
save(portrait, "portrait.webp", quality=88)
# (the link preview is public/images/og-hero.jpg, a capture of the hero; the old
# portrait-og.jpg holds the same picture for apps that cached its address)

# Photos in About (the Academy) and next to the services text (the hackathon).
LOCAL_ABOUT = LOCAL / "about"
save(Image.open(LOCAL_ABOUT / "academy-group.jpg").convert("RGB"), "about/academy.webp", quality=86)
# her crop: the banner in full, little room above the head
save(Image.open(LOCAL_ABOUT / "hackathon-crop.png").convert("RGB"), "about/hackathon.webp", quality=88)
# the other two hackathons, from her iPhone photos (HEIC, rotated and cut to
# the same ratio as the Naples one by hand: art/about/trieste.jpg, stockholm.jpg)
save(Image.open(LOCAL_ABOUT / "trieste.jpg").convert("RGB"), "about/trieste.webp", quality=86)
save(Image.open(LOCAL_ABOUT / "stockholm.jpg").convert("RGB"), "about/stockholm.webp", quality=86)

# The service tiles are made by scripts/prepare-tiles.py, not here.
