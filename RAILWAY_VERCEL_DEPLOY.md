# Railway + Vercel Deployment (Monorepo)

This repo contains:
- Backend (Express): `campus-service-backend` (serves routes under `/api/*`)
- Frontend (Vite/React): `campus-frontend`

## Deploy Backend To Railway

1. Create a new Railway project from this GitHub repo.
2. Use the repository root as the service root (Railway will run the root `package.json`).
3. Set environment variables:
   `MONGODB_URI` (or `MONGO_URI`) = your Mongo connection string
   `JWT_SECRET` = strong random string
   `JWT_EXPIRES` = optional (default `1d`)
   `CORS_ORIGINS` = comma-separated allowed frontend origins
   Example: `https://your-app.vercel.app`
   Example (allow all Vercel preview domains): `*.vercel.app`
4. Deploy. Verify `GET https://<your-railway-domain>/health` returns JSON.
5. Verify `GET https://<your-railway-domain>/api/...` endpoints respond (auth required for most routes).

## Deploy Frontend To Vercel

1. Import the same GitHub repo into Vercel.
2. Set **Root Directory** to `campus-frontend`.
3. Set environment variable:
   `API_ORIGIN` = your Railway backend origin (do not include `/api`)
   Example: `https://<your-railway-domain>`
4. Deploy. The frontend calls same-origin `/api/*`, and Vercel proxies it to Railway via `campus-frontend/api/[...path].js`.

Optional:
Set `VITE_API_URL` if you want the frontend to call Railway directly (not recommended, requires CORS).

## Notes

- `POST /api/auth/register` is a public endpoint for **tenant** self-registration (role is forced to `tenant`).
- Admin user creation is via `POST /api/auth/create-user` (admin-only) or via `SEED_ADMIN=true` bootstrap on the backend.
