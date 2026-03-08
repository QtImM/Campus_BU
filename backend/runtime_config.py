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
    os.environ.setdefault("FLAGS_enable_pir_api", "0")
    os.environ.setdefault("FLAGS_use_mkldnn", "0")
    os.environ.setdefault("OMP_NUM_THREADS", "1")
    os.environ.setdefault("MKL_NUM_THREADS", "1")
    os.environ.setdefault("CPU_NUM", "1")
