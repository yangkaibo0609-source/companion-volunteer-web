from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "src" / "assets" / "game" / "raw"
OUT = ROOT / "src" / "assets" / "game" / "characters"
OUT.mkdir(parents=True, exist_ok=True)

CROPS = {
    "user-boy-poses.png": {
        "boy-first-meet.png": (1051, 44, 1672, 927),
        "boy-overload.png": (52, 62, 822, 902),
        "boy-refuse.png": (0, 1025, 693, 1970),
        "boy-walk.png": (1013, 1064, 1681, 1958),
        "boy-piano.png": (1835, 1033, 2714, 1975),
    },
    "user-mixed-poses.png": {
        "boy-meal.png": (1060, 14, 1603, 636),
        "volunteer-prompt.png": (1068, 876, 1562, 1525),
    },
    "user-volunteer-boy.png": {
        "volunteer-observe.png": (0, 0, 1229, 1569),
    },
    "user-duo-poses.png": {
        "volunteer-strict.png": (1112, 0, 1818, 885),
        "volunteer-ignore.png": (2021, 21, 2672, 887),
        "volunteer-hug.png": (1480, 1024, 2258, 1871),
        "duo-drawing.png": (0, 31, 970, 913),
        "duo-comfort.png": (1480, 1024, 2258, 1871),
    },
}


def trim_transparent_edges(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        return image

    left, top, right, bottom = bbox
    pad = 18
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(image.width, right + pad)
    bottom = min(image.height, bottom + pad)
    return image.crop((left, top, right, bottom))


def main() -> None:
    for source_name, crops in CROPS.items():
        source = Image.open(RAW / source_name).convert("RGBA")
        for output_name, box in crops.items():
            cropped = source.crop(box)
            trimmed = trim_transparent_edges(cropped)
            output = OUT / output_name
            trimmed.save(output)
            print(f"created {output}")


if __name__ == "__main__":
    main()
