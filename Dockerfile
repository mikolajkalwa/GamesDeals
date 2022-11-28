FROM node:18.12.1-bullseye-slim as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build:prod

FROM node:18.12.1-bullseye-slim
ENV NODE_ENV production
EXPOSE 3000/tcp
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/package*.json ./
RUN npm ci --ignore-scripts --omit=dev && npm cache clean --force
COPY --chown=node:node --from=build /usr/src/app/scripts ./scripts
COPY --chown=node:node --from=build /usr/src/app/prisma/schema.prisma ./prisma/schema.prisma
COPY --chown=node:node --from=build /usr/src/app/prisma/migrations ./prisma/migrations
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
RUN npx prisma generate
USER node
CMD ["/bin/sh", "/usr/src/app/scripts/start.sh"]
