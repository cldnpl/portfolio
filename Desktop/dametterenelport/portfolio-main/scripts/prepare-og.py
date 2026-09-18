#!/usr/bin/env python3
"""
Draws the card that other sites show when this one is linked.

There was an SVG here. Nothing that matters renders it: Google, LinkedIn,
WhatsApp, Slack and iMessage all want a raster image at 1200x630, and an SVG
og:image is simply dropped — the link then appears as a bare grey box, which
for a portfolio is the first impression it makes on somebody else's feed.

Fonts and the marble come from ../art, like the rest of the source material.

    python3 scripts/prepare-og.py
"""

from pathlib import Path
import sys

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT.parent / "art" / "fonts"
MARBLE = ROOT / "public" / "backgrounds" / "black-marble.jpg"
OUT = ROOT / "public" / "opengraph-image.jpg"

W, H = 1200, 630
CREAM = (243, 238, 228)
GOLD = (201, 168, 106)


def font(name: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / name), size)
    # Both files are variable fonts; without an explicit axis they render at
    # their thinnest master, which disappears against the stone.
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f


def main() -> None:
    for path in (FONTS / "PlayfairDisplay.ttf", FONTS / "JetBrainsMono.ttf", MARBLE):
        if not path.exists():
            sys.exit(f"manca {path}")

    # The marble, cropped to the card and pushed down so the text sits on
    # stone rather than on a vein.
    marble = Image.open(MARBLE).convert("RGB")
    scale = max(W / marble.width, H / marble.height)
    marble = marble.resize((round(marble.width * scale), round(marble.height * scale)), Image.LANCZOS)
    left = (marble.width - W) // 2
    top = (marble.height - H) // 2
    card = marble.crop((left, top, left + W, top + H))

    # Darken, so the type keeps its contrast at thumbnail size.
    card = Image.blend(card, Image.new("RGB", (W, H), (10, 8, 6)), 0.45)

    draw = ImageDraw.Draw(card)

    label = font("JetBrainsMono.ttf", 22, 300)
    name = font("PlayfairDisplay.ttf", 118, 500)
    role = font("JetBrainsMono.ttf", 26, 300)

    draw.text((80, 86), "P O R T F O L I O", font=label, fill=(243, 238, 228, 140))

    draw.text((80, 214), "Claudia", font=name, fill=CREAM)
    draw.text((80, 334), "Napolitano", font=name, fill=CREAM)

    draw.line([(80, 494), (176, 494)], fill=GOLD, width=2)
    draw.text((80, 522), "M O B I L E   D E V E L O P E R", font=role, fill=GOLD)

    card.save(OUT, quality=88, optimize=True, progressive=True)
    print(f"→ public/{OUT.name}  {OUT.stat().st_size // 1024} KB  {card.size}")


if __name__ == "__main__":
    main()
