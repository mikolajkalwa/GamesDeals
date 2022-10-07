FROM node:18.10.0-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:18.10.0-alpine
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
RUN npm ci --ignore-scripts --only=production && npm cache clean --force
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
USER node
CMD ["node", "./dist/index.js"]
