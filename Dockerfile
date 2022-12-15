FROM node:18.12.1-bullseye-slim as build
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init=1.2.5-1
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:18.12.1-bullseye-slim
COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
COPY --chown=node:node --from=build /usr/src/app/assets/avatar.png ./assets/avatar.png
RUN npm ci --ignore-scripts --omit=dev
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
USER node
CMD ["dumb-init", "node", "--max-old-space-size=6144", "./dist/index.js"]

