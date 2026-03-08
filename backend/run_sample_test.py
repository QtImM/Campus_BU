from pathlib import Path
import json

from template_v1 import detect_schedule_blocks


def main() -> None:
    sample_path = Path("samples/schedule_real_01.png")
    blocks = detect_schedule_blocks(sample_path.read_bytes())
    print(json.dumps(
        {
            "count": len(blocks),
            "items": [
                {
                    "day": block.day_of_week,
                    "label": block.day_label,
                    "start": block.start_time,
                    "end": block.end_time,
                    "course_code": block.course_code,
                    "room": block.room,
                    "needs_review": block.needs_review,
                    "source_text": block.source_text,
                    "bbox": block.bbox,
                    "confidence": block.confidence,
                }
                for block in blocks
            ],
        },
        ensure_ascii=False,
        indent=2,
    ))


if __name__ == "__main__":
    main()
