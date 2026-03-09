import os

import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from runtime_config import configure_runtime_environment
from schedule_ocr_ai import extract_schedule_from_image

configure_runtime_environment()

app = FastAPI(title="HKCampus AI OCR Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/extract/schedule")
async def extract_schedule(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        file_bytes = await file.read()
        result = extract_schedule_from_image(file_bytes)
        raw_response = result.get("raw_response")
        if isinstance(raw_response, dict):
            raw_response.setdefault("filename", file.filename)
            raw_response.setdefault("content_type", file.content_type)
            raw_response.setdefault("file_size", len(file_bytes))
        return result
    except Exception as exc:
        print(f"Extraction error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "ocr-space-deepseek",
        "ocr_text_engine": os.environ.get("OCR_TEXT_ENGINE", "ocr_space"),
        "deepseek_base_url": os.environ.get("DEEPSEEK_BASE_URL", os.environ.get("EXPO_PUBLIC_DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))
