FROM node:18.15.0-bullseye-slim as base
RUN corepack enable && corepack prepare pnpm@7.30.3 --activate

FROM node:18.15.0-bullseye-slim as extractor
RUN npm install -g turbo@1.8.5
WORKDIR /usr/src/app
COPY . .
RUN turbo prune --scope=notifier --docker

FROM base AS builder
WORKDIR /usr/src/app
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init=1.2.5-1
COPY .gitignore .gitignore
COPY --from=extractor /usr/src/app/out/json/ .
COPY --from=extractor /usr/src/app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install
COPY --from=extractor /usr/src/app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=notifier

FROM base as final
WORKDIR /usr/src/app
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder /usr/src/app/ .
RUN pnpm install --prod --frozen-lockfile
USER node
CMD ["dumb-init", "node", "./apps/notifier/dist/index.js"]

