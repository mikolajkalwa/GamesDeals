FROM node:14-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/avatar.png ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=build /usr/src/app/built ./built
CMD ["node", "--max-old-space-size=3072", "./built/index.js"]