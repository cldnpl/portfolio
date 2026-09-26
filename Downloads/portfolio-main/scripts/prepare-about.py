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
import os
import sys

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python3 -m pip install Pillow")

ROOT = Path(__file__).resolve().parent.parent
# The originals stayed in dametterenelport when the working copy moved, and
# the site is built from two different folders: the path is spelt out rather
# than guessed from where this script happens to sit. ABOUT_ART overrides it.
ART = Path(os.environ.get("ABOUT_ART", Path.home() / "Desktop" / "dametterenelport" / "art" / "about"))
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
    #: The same for a picture that is too wide: 0 keeps the left edge.
    focus_x: float = 0.5
    #: Share of the original height to keep before framing, measured down
    #: from `top`. Below 1 it moves the camera in: a head-and-shoulders shot
    #: taken from across the room otherwise leaves the face a third of the
    #: frame.
    zoom: float = 1.0
    top: float = 0.0


JOBS = [
    # Against the pink wall, 2026. The original is nearly square with a lot of
    # wall above the fringe: come in to the top 83% and centre on the face,
    # which sits just right of the middle.
    Job("portrait-2026.webp", "portrait-2026.jpg", aspect=3 / 4, zoom=0.83, top=0.17, focus_x=0.55),
    # 2007, at the family computer. Already 4:3, the shape of the frame.
    Job("childhood-2007.jpg", "childhood-2007.jpg"),
    Job("academy-group.jpg", "academy.jpg"),
    Job("hackathon-winner.png", "hackathon.jpg"),
    Job("language-notes.png", "languages.jpg", rotate=180),
]


def reframe(image: Image.Image, aspect: float, focus: float, focus_x: float = 0.5) -> Image.Image:
    width, height = image.size
    if abs(width / height - aspect) < 0.005:
        return image
    if width / height > aspect:  # too wide: trim the sides around focus_x
        cropped = round(height * aspect)
        left = round((width - cropped) * focus_x)
        return image.crop((left, 0, left + cropped, height))
    cropped = round(width / aspect)  # too tall: trim around the focus
    top = round((height - cropped) * focus)
    return image.crop((0, top, width, top + cropped))


def convert(job: Job) -> None:
    image = Image.open(ART / job.source).convert("RGB")
    if job.rotate:
        image = image.rotate(job.rotate, expand=True)
    if job.zoom < 1:
        top = round(image.height * job.top)
        image = image.crop((0, top, image.width, top + round(image.height * job.zoom)))
    if job.aspect:
        image = reframe(image, job.aspect, job.focus, job.focus_x)
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
