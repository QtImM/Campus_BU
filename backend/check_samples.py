from __future__ import annotations

import json
from pathlib import Path

from template_v1 import detect_schedule_blocks_with_layout


def main() -> None:
    sample_dir = Path(__file__).resolve().parent / "samples"
    for name in ("schedule_real_01.png", "schedule_real_02.png"):
        result = detect_schedule_blocks_with_layout((sample_dir / name).read_bytes())
        payload = {
            "file": name,
            "layout_mode": result.layout_mode,
            "count": len(result.blocks),
            "items": [
                {
                    "day": block.day_of_week,
                    "label": block.day_label,
                    "start": block.start_time,
                    "end": block.end_time,
                    "course_code": block.course_code,
                    "room": block.room,
                    "needs_review": block.needs_review,
                    "bbox": block.bbox,
                }
                for block in result.blocks
            ],
        }
        print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
