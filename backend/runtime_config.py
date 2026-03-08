from __future__ import annotations

import os
from pathlib import Path


def configure_runtime_environment() -> None:
    """
    Normalize writable cache/data directories for local dev and Cloud Run.
    Cloud Run containers should write transient model caches under /tmp.
    """
    base_dir = Path(os.environ.get("OCR_RUNTIME_HOME", "/tmp/hkcampus-ocr")).resolve()
    base_dir.mkdir(parents=True, exist_ok=True)

    dataset_dir = base_dir / "dataset"
    dataset_dir.mkdir(parents=True, exist_ok=True)

    os.environ.setdefault("HOME", str(base_dir))
    os.environ.setdefault("XDG_CACHE_HOME", str(base_dir))
    os.environ.setdefault("PADDLE_PDX_CACHE_HOME", str(base_dir / "paddlex"))
    os.environ.setdefault("PADDLE_HOME", str(base_dir / "paddle"))
    os.environ.setdefault("PADDLE_DATA_HOME", str(dataset_dir))
    os.environ.setdefault("PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK", "True")

