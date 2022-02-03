FROM node:16-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod

FROM node:16-alpine
EXPOSE 3000/tcp
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY --from=build /usr/src/app/dist ./dist
CMD ["node", "./dist/main.js"]
