from pathlib import Path
import os

from PIL import Image

from template_v1 import _get_paddle_ocr_config, _prepare_block_for_ocr


def main() -> None:
    cache_dir = Path(".paddlex_cache").resolve()
    cache_dir.mkdir(parents=True, exist_ok=True)
    os.environ["HOME"] = str(cache_dir)
    os.environ["USERPROFILE"] = str(cache_dir)
    os.environ["XDG_CACHE_HOME"] = str(cache_dir)
    os.environ["PADDLE_PDX_CACHE_HOME"] = str(cache_dir)
    os.environ["PADDLE_HOME"] = str(cache_dir)
    os.environ["PADDLE_DATA_HOME"] = str(cache_dir / "dataset")
    os.environ["PADDLE_PDX_DISABLE_MODEL_SOURCE_CHECK"] = "True"
    os.environ["FLAGS_enable_pir_api"] = "0"
    os.environ["FLAGS_use_mkldnn"] = "0"

    from paddleocr import PaddleOCR

    config = _get_paddle_ocr_config()
    print(f"Paddle config: {config}")
    ocr = PaddleOCR(**config)
    image = Image.open(Path("samples/schedule_real_01.png")).convert("RGB")
    crop = _prepare_block_for_ocr(image, (793, 95, 927, 259))
    crop_path = Path("samples/_debug_crop.png")
    crop.save(crop_path)
    result = ocr.predict(str(crop_path))
    print(result)


if __name__ == "__main__":
    main()
