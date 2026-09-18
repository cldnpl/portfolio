#!/usr/bin/env python3
"""
Turns raw simulator captures into the images the work page ships.

Captures land in /tmp/caps as full-resolution device screenshots; this crops
nothing, scales them to a sane width and writes progressive JPEGs into
public/work/.
"""

from pathlib import Path
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
CAPS = Path("/tmp/caps")
# Shots taken by hand — from a real device, or from a simulator session that
# needed a login or a camera. Dropped in here, they win over any capture.
ART = ROOT.parent / "art"
OUT = ROOT / "public" / "work"

# A phone card is never drawn wider than ~380 CSS px, so 720 covers retina.
PHONE_WIDTH = 720
SPATIAL_WIDTH = 1280


def convert(source: Path, name: str, width: int) -> None:
    image = Image.open(source).convert("RGB")
    if image.width > width:
        image = image.resize((width, round(image.height * width / image.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / name
    image.save(target, quality=84, optimize=True, progressive=True)
    print(f"  → public/work/{name}  {target.stat().st_size // 1024} KB  {image.size}")


JOBS = [
    ("uzbelia-ios.png", "uzbelia-ios.jpg", PHONE_WIDTH),
    ("leyla-ios.png", "leyla-ios.jpg", PHONE_WIDTH),
    ("leyla-android.png", "leyla-android.jpg", PHONE_WIDTH),
    ("stikar-ios.png", "stikar-ios.jpg", PHONE_WIDTH),
    ("stikar-android.png", "stikar-android.jpg", PHONE_WIDTH),
    ("tourism-ios.png", "tourism-ios.jpg", PHONE_WIDTH),
    ("livechess-visionos.png", "livechess-visionos.jpg", SPATIAL_WIDTH),
]


# name in art/ → name in public/work/
HAND_SHOTS = [
    ("leyla-home.png", "leyla-home.jpg", PHONE_WIDTH),
    ("stikar-ar.png", "stikar-ar.jpg", PHONE_WIDTH),
    ("livechess-board.png", "livechess-visionos.jpg", SPATIAL_WIDTH),
]


def main() -> None:
    hand_done = set()
    for source_name, target_name, width in HAND_SHOTS:
        for candidate in (ART / source_name, ART / source_name.replace(".png", ".jpg")):
            if candidate.exists():
                print(f"{candidate.name}  (fornita a mano)")
                convert(candidate, target_name, width)
                hand_done.add(target_name)
                break

    missing = []
    for source_name, target_name, width in JOBS:
        if target_name in hand_done:
            continue
        source = CAPS / source_name
        if source.exists():
            print(source_name)
            convert(source, target_name, width)
        else:
            missing.append(source_name)

    if missing:
        print("\nnot captured yet:")
        for name in missing:
            print(f"  {name}")


if __name__ == "__main__":
    main()
