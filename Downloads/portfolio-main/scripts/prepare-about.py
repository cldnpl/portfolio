#!/usr/bin/env python3
"""
Turns the photographs behind the about page into the files the site ships.

Originals live in ../art/about — phone captures, a few megabytes each, at
whatever size the camera wrote them. The about frames are never drawn wider
than ~520 CSS px, so 1100 covers retina with room to spare; anything past
that is weight the reader pays for and never sees.

    python3 scripts/prepare-about.py
"""

from pathlib import Path
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT.parent / "art" / "about"
OUT = ROOT / "public" / "about"

WIDTH = 1100

# name in art/about → name in public/about, plus the rotation the original
# needs. A phone held over a desk writes no orientation tag worth trusting,
# so the correction lives here rather than in a re-saved original.
JOBS = [
    ("claudia-mirror.png", "portrait.jpg", 0),
    ("academy-group.jpg", "academy.jpg", 0),
    ("hackathon-winner.png", "hackathon.jpg", 0),
    ("language-notes.png", "languages.jpg", 180),
]


def convert(source: Path, name: str, rotate: int) -> None:
    image = Image.open(source).convert("RGB")
    if rotate:
        image = image.rotate(rotate, expand=True)
    if image.width > WIDTH:
        image = image.resize((WIDTH, round(image.height * WIDTH / image.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / name
    image.save(target, quality=84, optimize=True, progressive=True)
    turned = f"  ruotata di {rotate}°" if rotate else ""
    print(f"  → public/about/{name}  {target.stat().st_size // 1024} KB  {image.size}{turned}")


def main() -> None:
    missing = []
    for source_name, target_name, rotate in JOBS:
        source = ART / source_name
        if source.exists():
            print(source_name)
            convert(source, target_name, rotate)
        else:
            missing.append(source_name)

    if missing:
        print(f"\nNon trovate in {ART}:")
        for name in missing:
            print(f"  · {name}")


if __name__ == "__main__":
    main()
