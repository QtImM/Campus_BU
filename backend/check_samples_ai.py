from __future__ import annotations

import json
from pathlib import Path

from schedule_ocr_ai import extract_schedule_from_image


def main() -> None:
    sample_dir = Path(__file__).resolve().parent / "samples"
    for name in ("schedule_real_01.png", "schedule_real_02.png"):
        result = extract_schedule_from_image((sample_dir / name).read_bytes())
        print(json.dumps({"file": name, **result}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
