from __future__ import annotations

import base64
from dataclasses import dataclass
from datetime import datetime, timedelta
from io import BytesIO
import json
import os
import re
from urllib import error as urllib_error
from urllib import parse as urllib_parse
from urllib import request as urllib_request
from collections.abc import Mapping
from typing import Iterable

from PIL import Image, ImageFilter, ImageOps
from runtime_config import load_project_env

load_project_env()

try:
    import numpy as np
except ImportError:  # pragma: no cover - optional runtime dependency
    np = None


TIME_LABELS = [
    "08:30",
    "09:30",
    "10:30",
    "11:30",
    "12:30",
    "13:30",
    "14:30",
    "15:30",
    "16:30",
    "17:30",
    "18:30",
    "19:30",
    "20:30",
    "21:30",
]

DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


@dataclass
class DetectedBlock:
    day_of_week: int
    day_label: str
    start_time: str
    end_time: str
    bbox: tuple[int, int, int, int]
    confidence: float
    source_text: str
    course_code: str
    room: str
    needs_review: bool


def _cluster_positions(positions: Iterable[int], max_gap: int = 2) -> list[tuple[int, int]]:
    sorted_positions = sorted(set(positions))
    if not sorted_positions:
        return []

    groups: list[tuple[int, int]] = []
    start = prev = sorted_positions[0]
    for pos in sorted_positions[1:]:
        if pos - prev <= max_gap:
            prev = pos
            continue
        groups.append((start, prev))
        start = prev = pos
    groups.append((start, prev))
    return groups


def _group_centers(groups: list[tuple[int, int]]) -> list[int]:
    return [int((start + end) / 2) for start, end in groups]


def _find_vertical_boundaries(image: Image.Image) -> list[int]:
    width, height = image.size
    pixels = image.load()
    dark_columns: list[int] = []

    for x in range(width):
        dark_count = 0
        for y in range(height):
            r, g, b = pixels[x, y]
            if (r + g + b) / 3 < 150:
                dark_count += 1
        if dark_count >= height * 0.55:
            dark_columns.append(x)

    return _group_centers(_cluster_positions(dark_columns))


def _find_horizontal_boundaries(image: Image.Image) -> list[int]:
    width, height = image.size
    pixels = image.load()
    dark_rows: list[int] = []

    for y in range(height):
        dark_count = 0
        for x in range(width):
            r, g, b = pixels[x, y]
            if (r + g + b) / 3 < 155:
                dark_count += 1
        if dark_count >= width * 0.45:
            dark_rows.append(y)

    return _group_centers(_cluster_positions(dark_rows))


def _build_block_mask(image: Image.Image) -> list[list[bool]]:
    width, height = image.size
    pixels = image.load()
    mask = [[False for _ in range(width)] for _ in range(height)]

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            brightness = (r + g + b) / 3
            if 110 <= brightness <= 215 and b >= r + 12 and b >= g + 6:
                mask[y][x] = True

    return mask


def _connected_components(mask: list[list[bool]]) -> list[tuple[int, int, int, int, int]]:
    height = len(mask)
    width = len(mask[0]) if height else 0
    visited = [[False for _ in range(width)] for _ in range(height)]
    components: list[tuple[int, int, int, int, int]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y][x] or visited[y][x]:
                continue

            stack = [(x, y)]
            visited[y][x] = True
            min_x = max_x = x
            min_y = max_y = y
            area = 0

            while stack:
                current_x, current_y = stack.pop()
                area += 1
                min_x = min(min_x, current_x)
                max_x = max(max_x, current_x)
                min_y = min(min_y, current_y)
                max_y = max(max_y, current_y)

                for next_x, next_y in (
                    (current_x + 1, current_y),
                    (current_x - 1, current_y),
                    (current_x, current_y + 1),
                    (current_x, current_y - 1),
                ):
                    if next_x < 0 or next_x >= width or next_y < 0 or next_y >= height:
                        continue
                    if visited[next_y][next_x] or not mask[next_y][next_x]:
                        continue
                    visited[next_y][next_x] = True
                    stack.append((next_x, next_y))

            components.append((min_x, min_y, max_x, max_y, area))

    return components


def _snap_to_boundary(value: float, boundaries: list[int]) -> int:
    return min(range(len(boundaries)), key=lambda index: abs(boundaries[index] - value))


def _time_at_index(index: int) -> str:
    base = datetime.strptime(TIME_LABELS[0], "%H:%M")
    return (base + timedelta(hours=index)).strftime("%H:%M")


def _infer_grid(image: Image.Image) -> tuple[list[int], list[int]]:
    vertical_boundaries = _find_vertical_boundaries(image)
    horizontal_boundaries = _find_horizontal_boundaries(image)

    if len(vertical_boundaries) < 8:
        raise ValueError(f"Expected at least 8 vertical boundaries, got {len(vertical_boundaries)}")
    if len(horizontal_boundaries) < 15:
        raise ValueError(f"Expected at least 15 horizontal boundaries, got {len(horizontal_boundaries)}")

    return vertical_boundaries[:8], horizontal_boundaries[:15]


def _normalize_confidence(block_width: int, block_height: int, column_width: int, row_height: int) -> float:
    width_score = min(1.0, block_width / max(column_width * 0.78, 1))
    height_score = min(1.0, block_height / max(row_height * 0.9, 1))
    confidence = 0.45 + width_score * 0.25 + height_score * 0.30
    return round(min(confidence, 0.99), 4)


def _prepare_block_for_paddle_ocr(image: Image.Image, bbox: tuple[int, int, int, int]) -> Image.Image:
    min_x, min_y, max_x, max_y = bbox
    crop = image.crop((min_x, min_y, max_x + 1, max_y + 1)).convert("RGB")
    enlarged = crop.resize((crop.width * 3, crop.height * 3))
    contrasted = ImageOps.autocontrast(enlarged, cutoff=2)
    sharpened = contrasted.filter(ImageFilter.SHARPEN)
    return sharpened


def _normalize_ocr_lines(text: str) -> str:
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return "\n".join(lines)


def _getenv_int(name: str, default: int) -> int:
    raw_value = os.environ.get(name)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError:
        return default


def _get_ocr_space_config() -> dict[str, object]:
    return {
        "url": os.environ.get("OCR_SPACE_API_URL", "https://api.ocr.space/parse/image").strip(),
        "api_key": os.environ.get("OCR_SPACE_API_KEY", "").strip(),
        "language": os.environ.get("OCR_SPACE_LANGUAGE", "eng").strip() or "eng",
        "engine": _getenv_int("OCR_SPACE_ENGINE", 2),
        "timeout": _getenv_int("OCR_SPACE_TIMEOUT", 30),
        "overlay_required": os.environ.get("OCR_SPACE_OVERLAY_REQUIRED", "false").strip().lower() == "true",
        "debug": os.environ.get("OCR_DEBUG", "false").strip().lower() == "true",
    }


def _image_to_data_url(image: Image.Image) -> str:
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def _build_ocr_space_request_body(data_url: str) -> bytes:
    config = _get_ocr_space_config()
    return urllib_parse.urlencode({
        "base64Image": data_url,
        "language": str(config["language"]),
        "OCREngine": str(config["engine"]),
        "isOverlayRequired": "true" if bool(config["overlay_required"]) else "false",
        "scale": "true",
        "isTable": "false",
    }).encode("utf-8")


def _extract_ocr_space_text(payload: object) -> str:
    if isinstance(payload, Mapping):
        is_error = payload.get("IsErroredOnProcessing")
        if is_error:
            return ""

        parsed_results = payload.get("ParsedResults")
        if isinstance(parsed_results, list):
            parts: list[str] = []
            for result in parsed_results:
                if not isinstance(result, Mapping):
                    continue
                text = result.get("ParsedText")
                if isinstance(text, str) and text.strip():
                    parts.append(text)
            if parts:
                return _normalize_ocr_lines("\n".join(parts))

    return ""


def _extract_ocr_space_error(payload: object) -> str:
    if not isinstance(payload, Mapping):
        return ""

    messages: list[str] = []
    for key in ("ErrorMessage", "ErrorDetails", "SearchablePDFURL"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            messages.append(value.strip())
        elif isinstance(value, list):
            messages.extend(str(item).strip() for item in value if str(item).strip())

    return " | ".join(messages)


def _ocr_block_text_ocr_space(image: Image.Image, bbox: tuple[int, int, int, int]) -> str:
    config = _get_ocr_space_config()
    url = str(config["url"])
    api_key = str(config["api_key"])
    debug = bool(config["debug"])
    if not url or not api_key:
        return ""

    prepared = _prepare_block_for_paddle_ocr(image, bbox)
    request_body = _build_ocr_space_request_body(_image_to_data_url(prepared))
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "apikey": api_key,
    }

    request = urllib_request.Request(url, data=request_body, headers=headers, method="POST")

    try:
        with urllib_request.urlopen(request, timeout=int(config["timeout"])) as response:
            response_body = response.read().decode("utf-8")
    except urllib_error.HTTPError as exc:
        details = exc.read().decode("utf-8", errors="ignore")
        print(f"OCR.Space OCR failed for bbox={bbox}: HTTP {exc.code} {details}")
        return ""
    except Exception as exc:
        print(f"OCR.Space OCR failed for bbox={bbox}: {exc}")
        return ""

    try:
        parsed = json.loads(response_body)
    except json.JSONDecodeError:
        if debug:
            print(f"OCR.Space non-JSON response for bbox={bbox}: {response_body[:400]}")
        return _normalize_ocr_lines(response_body)

    text = _extract_ocr_space_text(parsed)
    if text:
        if debug:
            print(f"OCR.Space text for bbox={bbox}: {text[:200]}")
        return text

    error_details = _extract_ocr_space_error(parsed)
    if debug or error_details:
        print(
            f"OCR.Space empty text for bbox={bbox}: "
            f"errors={error_details or 'none'} response={json.dumps(parsed, ensure_ascii=False)[:600]}"
        )
    return ""


def _ocr_block_text(image: Image.Image, bbox: tuple[int, int, int, int]) -> str:
    engine = os.environ.get("OCR_TEXT_ENGINE", "ocr_space").strip().lower()
    if engine == "ocr_space":
        return _ocr_block_text_ocr_space(image, bbox)
    return ""


def _parse_course_code(source_text: str) -> str:
    if not source_text:
        return ""
    match = re.search(r"\b([A-Z]{4}\d{4})\b", source_text.upper())
    return match.group(1) if match else ""


def _parse_room(source_text: str) -> str:
    if not source_text:
        return ""
    lines = [line.strip() for line in source_text.splitlines() if line.strip()]
    if not lines:
        return ""

    first_line = lines[0]
    if len(lines) == 1:
        room_candidate = re.sub(r"\b[A-Z]{4}\d{4}\b", "", first_line.upper())
        room_candidate = re.sub(r"\(\d{5}\)", "", room_candidate)
        room_candidate = re.sub(r"\s+", " ", room_candidate).strip(" ,")
        return room_candidate

    joined = ", ".join(lines[1:]).strip(" ,")
    joined = re.sub(r"\s*,\s*", ", ", joined)
    joined = re.sub(r"(,\s*){2,}", ", ", joined)
    return joined.strip(" ,")


def _needs_review(course_code: str, room: str, source_text: str) -> bool:
    return not course_code or not room or not source_text


def detect_schedule_blocks(image_bytes: bytes) -> list[DetectedBlock]:
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    vertical_boundaries, horizontal_boundaries = _infer_grid(image)

    time_column_right = vertical_boundaries[1]
    day_boundaries = vertical_boundaries[1:]
    header_bottom = horizontal_boundaries[1]
    time_boundaries = horizontal_boundaries[1:]
    row_height = max(1, int(sum(time_boundaries[i + 1] - time_boundaries[i] for i in range(len(time_boundaries) - 1)) / (len(time_boundaries) - 1)))

    mask = _build_block_mask(image)
    components = _connected_components(mask)

    detected: list[DetectedBlock] = []
    for min_x, min_y, max_x, max_y, area in components:
        if area < 1500:
            continue
        if min_x <= time_column_right or min_y <= header_bottom:
            continue

        width = max_x - min_x + 1
        height = max_y - min_y + 1
        if width < 40 or height < 40:
            continue

        center_x = (min_x + max_x) / 2
        day_index = None
        for idx in range(len(day_boundaries) - 1):
            if day_boundaries[idx] <= center_x <= day_boundaries[idx + 1]:
                day_index = idx
                break

        if day_index is None or day_index >= len(DAY_LABELS):
            continue

        top_index = _snap_to_boundary(min_y, time_boundaries)
        bottom_index = _snap_to_boundary(max_y, time_boundaries)
        if bottom_index <= top_index:
            bottom_index = min(top_index + 1, len(time_boundaries) - 1)

        start_time = _time_at_index(top_index)
        end_time = _time_at_index(bottom_index)
        column_width = day_boundaries[day_index + 1] - day_boundaries[day_index]
        confidence = _normalize_confidence(width, height, column_width, row_height)
        source_text = _ocr_block_text(image, (min_x, min_y, max_x, max_y))
        course_code = _parse_course_code(source_text)
        room = _parse_room(source_text)

        detected.append(
            DetectedBlock(
                day_of_week=day_index + 1,
                day_label=DAY_LABELS[day_index],
                start_time=start_time,
                end_time=end_time,
                bbox=(min_x, min_y, max_x, max_y),
                confidence=confidence,
                source_text=source_text,
                course_code=course_code,
                room=room,
                needs_review=_needs_review(course_code, room, source_text),
            )
        )

    detected.sort(key=lambda item: (item.day_of_week, item.start_time, item.bbox[1]))
    return detected
