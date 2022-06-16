FROM node:16-bullseye as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

FROM node:16-bullseye
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/assets/avatar.png ./assets/avatar.png
RUN npm ci --ignore-scripts --only=production && npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "./dist/index.js"]
