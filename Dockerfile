FROM node:16-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build:prod

FROM node:16-alpine
EXPOSE 3000/tcp
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --ignore-scripts --only=production && npm cache clean --force
COPY --from=build /usr/src/app/scripts ./scripts
COPY --from=build /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma
COPY --from=build /usr/src/app/prisma/migrations ./prisma/migrations
COPY --from=build /usr/src/app/dist ./dist
RUN npx prisma generate
CMD ["/bin/sh", "./scripts/start.sh"]
