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

# name in art/about → name in public/about
JOBS = [
    ("claudia-mirror.png", "portrait.jpg"),
    ("academy-group.jpg", "academy.jpg"),
    ("hackathon-winner.png", "hackathon.jpg"),
    ("language-notes.png", "languages.jpg"),
]


def convert(source: Path, name: str) -> None:
    image = Image.open(source).convert("RGB")
    if image.width > WIDTH:
        image = image.resize((WIDTH, round(image.height * WIDTH / image.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / name
    image.save(target, quality=84, optimize=True, progressive=True)
    print(f"  → public/about/{name}  {target.stat().st_size // 1024} KB  {image.size}")


def main() -> None:
    missing = []
    for source_name, target_name in JOBS:
        source = ART / source_name
        if source.exists():
            print(source_name)
            convert(source, target_name)
        else:
            missing.append(source_name)

    if missing:
        print(f"\nNon trovate in {ART}:")
        for name in missing:
            print(f"  · {name}")


if __name__ == "__main__":
    main()
