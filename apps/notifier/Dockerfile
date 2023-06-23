FROM node:18.16.1-bullseye-slim as base
RUN corepack enable && corepack prepare pnpm@8.6.3 --activate

FROM node:18.16.1-bullseye-slim as extractor
RUN npm install -g turbo@1.10.5
WORKDIR /usr/src/app
COPY . .
RUN turbo prune --scope=notifier --docker

FROM base AS builder
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init=1.2.5-1
COPY turbo.json turbo.json
COPY --from=extractor /usr/src/app/out/json/ .
COPY --from=extractor /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=extractor /usr/src/app/out/full/ .
RUN pnpm turbo run build --filter=notifier

FROM base as final
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
USER node
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app/package.json /usr/src/app/pnpm-*.yaml ./
COPY --from=builder --chown=node:node /usr/src/app/packages/gd-api-client ./packages/gd-api-client
COPY --from=builder --chown=node:node /usr/src/app/apps/notifier/package.json ./apps/notifier/
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder --chown=node:node /usr/src/app/apps/notifier/dist ./apps/notifier/dist
CMD ["dumb-init", "node", "./apps/notifier/dist/index.js"]

