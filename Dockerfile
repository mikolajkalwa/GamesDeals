FROM node:16-alpine as tsc-build
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:16-alpine as install-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache python3 make g++ && npm ci --ignore-scripts --only=production


FROM node:16-alpine
WORKDIR /usr/src/app
COPY --chown=node:node --from=tsc-build /usr/src/app/package*.json ./
COPY --chown=node:node --from=tsc-build /usr/src/app/assets/avatar.png ./assets/avatar.png
COPY --chown=node:node --from=install-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=tsc-build /usr/src/app/dist ./dist
USER node
CMD ["node", "./dist/index.js"]
