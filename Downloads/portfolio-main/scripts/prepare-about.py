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
from typing import NamedTuple
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT.parent / "art" / "about"
OUT = ROOT / "public" / "about"

WIDTH = 1100

class Job(NamedTuple):
    source: str
    target: str
    #: Degrees anticlockwise. A phone held over a desk writes no orientation
    #: tag worth trusting, so the correction lives here rather than in a
    #: re-saved original.
    rotate: int = 0
    #: Width / height the frame draws. None keeps the original proportion.
    aspect: float | None = None
    #: Where the crop keeps its material when the original is the wrong
    #: shape: 0 holds the top of the picture, 1 the bottom, 0.5 the middle.
    focus: float = 0.5


JOBS = [
    # Shot upright on a phone, far taller than the 3:4 frame: crop from the
    # top so the face keeps its headroom and the legs go, not the hair.
    Job("portrait.jpg", "portrait.jpg", aspect=3 / 4, focus=0.05),
    Job("academy-group.jpg", "academy.jpg"),
    Job("hackathon-winner.png", "hackathon.jpg"),
    Job("language-notes.png", "languages.jpg", rotate=180),
]


def reframe(image: Image.Image, aspect: float, focus: float) -> Image.Image:
    width, height = image.size
    if abs(width / height - aspect) < 0.005:
        return image
    if width / height > aspect:  # too wide: trim the sides evenly
        cropped = round(height * aspect)
        left = (width - cropped) // 2
        return image.crop((left, 0, left + cropped, height))
    cropped = round(width / aspect)  # too tall: trim around the focus
    top = round((height - cropped) * focus)
    return image.crop((0, top, width, top + cropped))


def convert(job: Job) -> None:
    image = Image.open(ART / job.source).convert("RGB")
    if job.rotate:
        image = image.rotate(job.rotate, expand=True)
    if job.aspect:
        image = reframe(image, job.aspect, job.focus)
    if image.width > WIDTH:
        image = image.resize((WIDTH, round(image.height * WIDTH / image.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    target = OUT / job.target
    image.save(target, quality=84, optimize=True, progressive=True)
    notes = []
    if job.rotate:
        notes.append(f"ruotata di {job.rotate}°")
    if job.aspect:
        notes.append("ritagliata")
    suffix = f"  ({', '.join(notes)})" if notes else ""
    print(f"  → public/about/{job.target}  {target.stat().st_size // 1024} KB  {image.size}{suffix}")


def main() -> None:
    missing = []
    for job in JOBS:
        if (ART / job.source).exists():
            print(job.source)
            convert(job)
        else:
            missing.append(job.source)

    if missing:
        print(f"\nNon trovate in {ART}:")
        for name in missing:
            print(f"  · {name}")


if __name__ == "__main__":
    main()
