from __future__ import annotations

import json
import os
from pathlib import Path


def main() -> None:
    backend_dir = Path(__file__).resolve().parent
    checks = {
        "dockerfile_exists": (backend_dir / "Dockerfile").exists(),
        "cloudbuild_exists": (backend_dir / "cloudbuild.yaml").exists(),
        "requirements_exists": (backend_dir / "requirements.txt").exists(),
        "main_exists": (backend_dir / "main.py").exists(),
        "ocr_text_engine": os.environ.get("OCR_TEXT_ENGINE", "disabled"),
        "ocr_runtime_home": os.environ.get("OCR_RUNTIME_HOME", "/tmp/hkcampus-ocr"),
        "ocr_paddle_det_model": os.environ.get("OCR_PADDLE_DET_MODEL", "PP-OCRv4_mobile_det"),
        "ocr_paddle_rec_model": os.environ.get("OCR_PADDLE_REC_MODEL", "en_PP-OCRv4_mobile_rec"),
        "ocr_paddle_det_limit_side_len": os.environ.get("OCR_PADDLE_DET_LIMIT_SIDE_LEN", "512"),
        "ocr_paddle_rec_batch_size": os.environ.get("OCR_PADDLE_REC_BATCH_SIZE", "1"),
    }
    print(json.dumps(checks, indent=2))


if __name__ == "__main__":
    main()
