"""Prepare authorized investigation media for the web build."""

from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image, ImageOps


RESOURCE_ROOT = Path(r"C:\Users\yangkaibo666\Desktop\资源")
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ASSET_ROOT = PROJECT_ROOT / "src" / "assets" / "investigation"


def save_webp(source: Path, destination: Path, max_size: tuple[int, int], quality: int = 84) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)


def prepare_photos() -> None:
    photo_dir = RESOURCE_ROOT / "真实图片"
    for index, source in enumerate(sorted(photo_dir.glob("*")), start=1):
        if not source.is_file():
            continue
        save_webp(source, ASSET_ROOT / "photos" / f"photo-{index:02d}.webp", (1920, 1600), 82)


def prepare_avatars() -> None:
    source = RESOURCE_ROOT / "微信图片_20260716104840_2240_24.png"
    destination = ASSET_ROOT / "avatars"
    destination.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as original:
        sheet = original.convert("RGBA")
        cell_width = sheet.width / 4
        cell_height = sheet.height / 2

        for index in range(8):
            column = index % 4
            row = index // 4
            bounds = (
                round(column * cell_width),
                round(row * cell_height),
                round((column + 1) * cell_width),
                round((row + 1) * cell_height),
            )
            cell = sheet.crop(bounds)
            alpha = cell.getchannel("A")
            content_bounds = alpha.point(lambda value: 255 if value > 8 else 0).getbbox()
            portrait = cell.crop(content_bounds) if content_bounds else cell
            side = max(portrait.width, portrait.height)
            canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
            canvas.alpha_composite(portrait, ((side - portrait.width) // 2, (side - portrait.height) // 2))
            canvas.thumbnail((520, 520), Image.Resampling.LANCZOS)
            canvas.save(destination / f"avatar-{index + 1:02d}.webp", "WEBP", quality=88, method=6)


def prepare_story_images() -> None:
    source_dir = RESOURCE_ROOT / "拟人照片"
    mapping = {
        "微信图片_20260703183152_1904_24.png": "story-01-voice.webp",
        "微信图片_20260703183150_1903_24.png": "story-02-carry.webp",
        "微信图片_20260703183149_1902_24.png": "story-03-walk.webp",
        "微信图片_20260703183147_1901_24.png": "story-04-stadium.webp",
        "微信图片_20260703183145_1900_24.png": "story-05-quiet.webp",
        "微信图片_20260703183126_1898_24.png": "story-06-hug.webp",
    }
    for source_name, destination_name in mapping.items():
        save_webp(source_dir / source_name, ASSET_ROOT / "stories" / destination_name, (1200, 1800), 86)


def copy_audio() -> None:
    voice_mapping = {
        "01 语音1.mp3": "voice-01-1.mp3",
        "01 语音2.mp3": "voice-01-2.mp3",
        "02 语音.mp3": "voice-02-1.mp3",
        "03 语音.mp3": "voice-03-1.mp3",
        "04 语音1.mp3": "voice-04-1.mp3",
        "04 语音2.mp3": "voice-04-2.mp3",
        "05 语音.mp3": "voice-05-1.mp3",
        "06 语音1.mp3": "voice-06-1.mp3",
        "06 语音2.mp3": "voice-06-2.mp3",
        "07 语音.mp3": "voice-07-1.mp3",
    }
    story_mapping = {
        "01 有声故事(1).mp3": "story-01.mp3",
        "02 有声故事 (1).mp3": "story-02.mp3",
        "03 自由职业者(1).mp3": "story-03.mp3",
        "04 有声故事(1).mp3": "story-04.mp3",
        "05 有声故事(1).mp3": "story-05.mp3",
        "06 有声故事(1).mp3": "story-06.mp3",
    }

    voice_destination = ASSET_ROOT / "audio" / "voices"
    story_destination = ASSET_ROOT / "audio" / "stories"
    voice_destination.mkdir(parents=True, exist_ok=True)
    story_destination.mkdir(parents=True, exist_ok=True)

    for source_name, destination_name in voice_mapping.items():
        shutil.copy2(RESOURCE_ROOT / "照片墙后语言" / source_name, voice_destination / destination_name)
    for source_name, destination_name in story_mapping.items():
        shutil.copy2(RESOURCE_ROOT / "有声故事-票根" / source_name, story_destination / destination_name)


if __name__ == "__main__":
    prepare_photos()
    prepare_avatars()
    prepare_story_images()
    copy_audio()
