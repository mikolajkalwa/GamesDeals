FROM node:14.17.5-alpine as build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:14.17.5-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --production
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "./dist/index.js"]