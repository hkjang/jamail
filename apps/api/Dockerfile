FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/api/prisma ./apps/api/prisma

RUN npm ci

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Re-generate prisma client in builder stage to ensure it's there (sometimes needed if node_modules are copied but artifacts are not)
# Actually, copying node_modules from deps should include the generated client if it was generated into node_modules
# But let's be safe and generate it again or ensure the copy includes it.
# Standard prisma generate outputs to node_modules/@prisma/client
# So copying node_modules is sufficient.

RUN npm run build --workspace=apps/api

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built assets
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
# Copy prisma schema for migrations if needed, or just for reference
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

USER nestjs

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
