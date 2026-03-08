# Cloud Run OCR Plan

## Goal

Deploy the OCR backend as a public HTTPS API that:

- runs on Linux, not on a local Windows machine
- can scale to zero when unused
- is billed mainly by request time and resource usage
- is suitable for a very small early-stage user base

## Why Cloud Run

Cloud Run fits this project better than a fixed monthly VM because:

- it runs standard Linux containers
- FastAPI works well inside a container
- no request means the service can scale down to zero
- billing is usage-based rather than a permanently running machine
- HTTPS and public routing are built in

This is a better match for timetable OCR because screenshot uploads are low frequency and can tolerate a small cold start.

## Target Architecture

App flow:

1. app uploads screenshot or reads local image
2. app calls `EXPO_PUBLIC_OCR_API_URL`
3. Cloud Run serves `backend/main.py`
4. backend runs template detection and OCR
5. backend returns structured items
6. existing app import flow stores review items in Supabase

## Files Added For Deployment

- [backend/Dockerfile](/c:/Users/Tim/Documents/GitHub/CampusCopy/backend/Dockerfile)
- [backend/.dockerignore](/c:/Users/Tim/Documents/GitHub/CampusCopy/backend/.dockerignore)
- [backend/runtime_config.py](/c:/Users/Tim/Documents/GitHub/CampusCopy/backend/runtime_config.py)
- [backend/cloudbuild.yaml](/c:/Users/Tim/Documents/GitHub/CampusCopy/backend/cloudbuild.yaml)
- [backend/predeploy_check.py](/c:/Users/Tim/Documents/GitHub/CampusCopy/backend/predeploy_check.py)

## Minimal Runtime Strategy

Cloud Run instance settings for low cost:

- CPU: `1`
- Memory: `1Gi`
- Min instances: `0`
- Max instances: `3`
- Concurrency: `1`
- Timeout: `60s`

Why:

- `min-instances=0` avoids paying for idle time
- `concurrency=1` is safer for OCR model memory use
- `1Gi` is a realistic starting point for OCR workloads without overcommitting

## Suggested Deployment Commands

Assuming:

- project id: `YOUR_GCP_PROJECT`
- region: `asia-east1` or another nearby region
- service name: `hkcampus-ocr`

Build and deploy:

```bash
cd backend
python predeploy_check.py

gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions _SERVICE=hkcampus-ocr,_REGION=asia-east1,_OCR_TEXT_ENGINE=paddle
```

After deployment, copy the Cloud Run HTTPS URL into:

```env
EXPO_PUBLIC_OCR_API_URL=https://YOUR_CLOUD_RUN_URL
```

## Cost Control Notes

For a tiny launch, the main cost controls are:

- keep `min-instances=0`
- keep `max-instances` low
- avoid GPU
- start with CPU-only OCR
- keep request timeout short

This avoids paying a fixed monthly server fee.

## OCR Engine Plan

Recommended rollout:

1. keep current template geometry detection
2. run block OCR in Linux Cloud Run
3. test PaddleOCR there, not on local Windows
4. if cold starts become too slow, consider:
   - smaller OCR model
   - preloaded model image
   - moving to a different usage-based inference platform

Current engine switch:

- `OCR_TEXT_ENGINE=disabled`: geometry only, lowest cost and most stable
- `OCR_TEXT_ENGINE=tesseract`: fallback local option
- `OCR_TEXT_ENGINE=paddle`: preferred Linux production target

## What Still Needs To Be Done

- wire PaddleOCR into the production OCR path on Linux
- build and deploy the container
- point the app `.env` to the Cloud Run URL
- run end-to-end testing with real screenshots

## Practical Recommendation

Do not spend more time trying to stabilize PaddleOCR on local Windows.
Use local Windows for app development and geometry logic only.
Use Linux container deployment for the actual OCR runtime.
