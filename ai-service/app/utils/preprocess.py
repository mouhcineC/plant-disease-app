
from future import annotations

from io import BytesIO
from typing import Tuple


from PIL import Image

import numpy as np

SUPPORTED_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE_MB = (1024, 1024)
MIN_CONFIDENCE = 0.70

def open_image(image_bytes: bytes) -> Image.Image:
	"""Open uploaded image bytes and normalize them to RGB."""

	if not image_bytes:
		raise ValueError("Empty image file provided")

	try:
		with Image.open(BytesIO(image_bytes)) as img:
			img = img.convert("RGB")
			img.thumbnail(MAX_IMAGE_SIZE_MB)
			return img
	except Exception as exc:  # pragma: no cover - Pillow error types vary
		raise ValueError("Unsupported or corrupted image file") from exc


def image_stats(image: Image.Image) -> Tuple[float, float, float, float, float]:
	"""Return simple RGB-based statistics used by the heuristic predictor."""
	resized = image.resize((128, 128))
	pixels = np.array(resized)

	if not pixels:
		raise ValueError("Unable to analyze image pixels")

	total = float(len(pixels))
	red = sum(px[0] for px in pixels) / total
	green = sum(px[1] for px in pixels) / total
	blue = sum(px[2] for px in pixels) / total
	brightness = (red + green + blue) / 3.0
	green_dominance = green - ((red + blue) / 2.0)
	return red, green, blue, brightness, green_dominance

