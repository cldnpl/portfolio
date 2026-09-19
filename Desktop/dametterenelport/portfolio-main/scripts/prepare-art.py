#!/usr/bin/env python3
"""
Turns the raw art (marble backdrop, phone lock screen wallpapers) into the
files the site actually ships.

Drop the originals here, then run `python3 scripts/prepare-art.py`:

    ~/Desktop/dametterenelport/art/marble.jpg      the 4K black-and-gold marble
    ~/Desktop/dametterenelport/art/lock-ios.jpg    iPhone lock screen wallpaper
    ~/Desktop/dametterenelport/art/lock-android.jpg  Android lock screen wallpaper

The marble is darkened and desaturated here rather than in CSS: a live
filter() on a fixed, full-viewport layer forces a full re-rasterisation on
every scroll frame, which is the difference between a smooth page and a
stuttering one.
"""

from pathlib import Path
import sys

try:
    from PIL import Image, ImageEnhance
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT.parent / "art"
BACKGROUNDS = ROOT / "public" / "backgrounds"
LOCKSCREENS = ROOT / "public" / "lockscreens"


def save(image: Image.Image, path: Path, quality: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, quality=quality, optimize=True, progressive=True)
    print(f"  → {path.relative_to(ROOT)}  {path.stat().st_size // 1024} KB  {image.size}")


def prepare_marble(source: Path) -> None:
    print(f"marble: {source.name}")
    image = Image.open(source).convert("RGB")

    # Keep the full width the source gives us, up to 2560 — beyond that the
    # file cost outweighs what anyone can see behind a vignette.
    if image.width > 2560:
        image = image.resize((2560, round(image.height * 2560 / image.width)), Image.LANCZOS)

    # Tuned for the marble currently in art/: black stone with one wide,
    # bright rose-gold vein. Left at the values the previous, finer marble
    # used, that vein sat on top of the contact form and the small mono
    # labels stopped being readable. Saturation comes down further than
    # brightness because the stone is pink and the page's accent is bronze:
    # muting the pink is what makes the two agree.
    image = ImageEnhance.Color(image).enhance(0.62)
    image = ImageEnhance.Brightness(image).enhance(0.56)
    image = ImageEnhance.Contrast(image).enhance(1.06)

    save(image, BACKGROUNDS / "black-marble.jpg", 86)
    small = image.resize((1280, round(image.height * 1280 / image.width)), Image.LANCZOS)
    save(small, BACKGROUNDS / "black-marble-sm.jpg", 82)


def prepare_lockscreen(source: Path, name: str) -> None:
    print(f"lock screen: {source.name}")
    image = Image.open(source).convert("RGB")

    # Match the screen texture exactly (720×1560). These are lock screen
    # captures, not wallpapers, so they are used as the whole display —
    # upscaling past the canvas would only cost bytes and sharpness.
    target_w, target_h = 720, 1560
    scale = max(target_w / image.width, target_h / image.height)
    resized = image.resize((round(image.width * scale), round(image.height * scale)), Image.LANCZOS)
    left = (resized.width - target_w) // 2
    top = (resized.height - target_h) // 2
    save(resized.crop((left, top, left + target_w, top + target_h)), LOCKSCREENS / name, 84)


def main() -> None:
    jobs = [
        (ART / "marble.jpg", lambda p: prepare_marble(p)),
        (ART / "lock-ios.jpg", lambda p: prepare_lockscreen(p, "ios.jpg")),
        (ART / "lock-android.jpg", lambda p: prepare_lockscreen(p, "android.jpg")),
    ]

    missing = [path for path, _ in jobs if not path.exists()]
    for path, run in jobs:
        if path.exists():
            run(path)

    if missing:
        print("\nnot found yet (the site falls back gracefully for these):")
        for path in missing:
            print(f"  {path}")


if __name__ == "__main__":
    main()
