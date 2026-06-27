# ── Stage 1: Build ──────────────────────────────────────
FROM node:24.0.0-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .

ARG VITE_SPOONACULAR_API_KEY
ENV VITE_SPOONACULAR_API_KEY=$VITE_SPOONACULAR_API_KEY

RUN npm run build

# ── Stage 2: Deploy to S3 ────────────────────────────────
FROM amazon/aws-cli

WORKDIR /deploy

COPY --from=builder /app/dist ./dist

CMD ["s3", "sync", "dist/", "s3://recipe-app-2024/", "--delete"]
