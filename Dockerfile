FROM node:18.12.1-bullseye-slim as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:18.12.1-bullseye-slim
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
RUN npm ci --ignore-scripts --omit=dev && npm cache clean --force
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
USER node
CMD ["node", "./dist/index.js"]
