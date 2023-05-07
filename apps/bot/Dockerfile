FROM node:18.16.0-bullseye-slim as base
RUN corepack enable && corepack prepare pnpm@8.4.0 --activate

FROM node:18.16.0-bullseye-slim as extractor
RUN npm install -g turbo@1.9.3
WORKDIR /usr/src/app
COPY . .
RUN turbo prune --scope=bot --docker

FROM base AS builder
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init=1.2.5-1
COPY --from=extractor /usr/src/app/out/json/ .
COPY --from=extractor /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=extractor /usr/src/app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=bot

FROM base as final
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app/package.json /usr/src/app/pnpm-*.yaml ./
COPY --from=builder --chown=node:node /usr/src/app/apps/bot/package.json ./apps/bot/
COPY --from=builder --chown=node:node /usr/src/app/apps/bot/assets ./apps/bot/assets
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder --chown=node:node /usr/src/app/apps/bot/dist ./apps/bot/dist
CMD ["dumb-init", "node", "--max-old-space-size=6144", "./apps/bot/dist/index.js"]

