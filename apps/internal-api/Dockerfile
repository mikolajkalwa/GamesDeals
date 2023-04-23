FROM node:18.16.0-bullseye-slim as base
RUN corepack enable && corepack prepare pnpm@8.3.1 --activate

FROM node:18.16.0-bullseye-slim as extractor
RUN npm install -g turbo@1.8.7
WORKDIR /usr/src/app
COPY . .
RUN turbo prune --scope=internal-api --docker

FROM base AS builder
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init=1.2.5-1
COPY turbo.json turbo.json
COPY --from=extractor /usr/src/app/out/json/ .
COPY --from=extractor /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=extractor /usr/src/app/out/full/ .
RUN pnpm -C apps/internal-api exec prisma generate && pnpm turbo run build --filter=internal-api

FROM base as final
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app/package.json /usr/src/app/.npmrc /usr/src/app/pnpm-*.yaml ./
COPY --from=builder --chown=node:node /usr/src/app/apps/internal-api/package.json ./apps/internal-api/
COPY --from=builder --chown=node:node /usr/src/app/apps/internal-api/scripts ./apps/internal-api/scripts
COPY --from=builder --chown=node:node /usr/src/app/apps/internal-api/prisma ./apps/internal-api/prisma
RUN pnpm install --prod --frozen-lockfile && pnpm -C apps/internal-api exec prisma generate
COPY --from=builder --chown=node:node /usr/src/app/apps/internal-api/dist ./apps/internal-api/dist
ENTRYPOINT ["sh", "./apps/internal-api/scripts/start.sh"]
