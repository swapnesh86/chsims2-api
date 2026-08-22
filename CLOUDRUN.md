# Cloud Run test deployment (this branch only)

This branch (`cloudrun-experiment`) adds a `Dockerfile` so this API can be deployed
to Google Cloud Run's free tier as an independent test, side by side with the
existing Render deployment. Nothing here touches `main` or Render — Render only
ever deploys from `main`, and this branch isn't merged into it.

No application code changed. `server.js` already reads `process.env.PORT` with a
fallback, which is exactly what Cloud Run needs (it injects `PORT=8080` itself).

## One-time setup

1. Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install) and run `gcloud init`.
2. Pick/create a GCP project and make sure billing is enabled on the account (Cloud Run's
   free tier doesn't charge at this traffic level, but a billing account still has to be
   attached to the project).
3. Enable the required APIs once per project:
   ```
   gcloud services enable run.googleapis.com cloudbuild.googleapis.com
   ```

## Deploy this branch

From the `chsims2-api` directory, on this branch:

```
gcloud run deploy chsims2-api-test \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production \
  --set-env-vars DATABASE_URI="<value from your .env>" \
  --set-env-vars ACCESS_TOKEN_SECRET="<value from your .env>" \
  --set-env-vars REFRESH_TOKEN_SECRET="<value from your .env>" \
  --set-env-vars EMAIL_HOST="<value from your .env>" \
  --set-env-vars EMAIL_USER="<value from your .env>" \
  --set-env-vars EMAIL_PASS="<value from your .env>"
```

Notes:
- `--source .` has Cloud Build build the `Dockerfile` in this directory and deploy it —
  no local Docker install required, though `docker build .` works too if you want to
  test the image locally first.
- `--region asia-south1` (Mumbai) is the closest Cloud Run region to your MongoDB
  Atlas cluster/users; change it if your Atlas cluster is hosted elsewhere.
- Don't reuse the Render service's own values from `.env` blindly if you'd rather this
  test hit a separate database — but pointing it at the same Atlas cluster is fine too,
  it's the same data either way.
- This command intentionally isn't run from here — it needs your GCP login and touches
  your real cloud account, so it's yours to run.

The first deploy prints a `*.run.app` URL — that's your test API's base URL.

## Testing just the API

You can hit the deployed URL directly with curl/Postman (e.g. `POST /auth` to log in)
without touching the frontend at all.

## Testing the full app against it (optional)

To point the actual React frontend at this Cloud Run URL instead of Render:
1. In `chsims2/src/app/api/apiSlice.js`, temporarily set `baseUrl` to the `*.run.app` URL.
2. In `config/allowedOrigins.js` **on this branch**, add whatever origin the frontend is
   running from (e.g. `http://localhost:3000` for a local dev frontend) — Cloud Run's
   CORS behavior is otherwise identical to Render's, driven by this same file.

Don't carry either of those two changes back to `main`/Render.
