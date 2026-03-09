import os

import uvicorn
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from runtime_config import configure_runtime_environment
from template_v1 import detect_schedule_blocks_with_layout

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
        detection = detect_schedule_blocks_with_layout(file_bytes)
        blocks = detection.blocks

        if not blocks:
            return {
                "status": "success",
                "raw_response": {
                    "mode": f"template_v1_{detection.layout_mode}_no_blocks",
                    "layout_mode": detection.layout_mode,
                    "filename": file.filename,
                    "content_type": file.content_type,
                    "file_size": len(file_bytes),
                },
                "items": [
                    {
                        "course_name": "",
                        "course_code": "",
                        "teacher": "",
                        "room": "",
                        "day_of_week": None,
                        "start_time": "",
                        "end_time": "",
                        "start_period": None,
                        "end_period": None,
                        "week_text": "",
                        "source_block": "未匹配到课表模板中的课程块。请上传完整的标准课表截图，或改用手动确认导入。",
                        "confidence": 0.0,
                        "needs_review": True,
                    }
                ],
                "engine": "template-v1-unmatched",
            }

        return {
            "status": "success",
            "raw_response": {
                "mode": f"template_v1_{detection.layout_mode}_geometry",
                "layout_mode": detection.layout_mode,
                "filename": file.filename,
                "content_type": file.content_type,
                "file_size": len(file_bytes),
                "detected_blocks": len(blocks),
            },
            "items": [
                {
                    "course_name": "",
                    "course_code": block.course_code,
                    "teacher": "",
                    "room": block.room,
                    "day_of_week": block.day_of_week,
                    "start_time": block.start_time,
                    "end_time": block.end_time,
                    "start_period": None,
                    "end_period": None,
                    "week_text": "",
                    "source_block": block.source_text or f"Detected block on {block.day_label} {block.start_time}-{block.end_time}",
                    "confidence": block.confidence,
                    "needs_review": block.needs_review,
                }
                for block in blocks
            ],
            "engine": f"template-v1-{detection.layout_mode}-geometry",
        }
    except Exception as e:
        print(f"Extraction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "template-v1-geometry",
        "ocr_text_engine": os.environ.get("OCR_TEXT_ENGINE", "disabled"),
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", "8000")))
