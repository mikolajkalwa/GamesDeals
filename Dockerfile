FROM node:14.15.1 as build

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:14.15.1-alpine
EXPOSE 3000/tcp
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/yarn.lock ./
RUN yarn install --frozen-lockfile --production
COPY --from=build /usr/src/app/built ./built
CMD ["node", "./built/main.js"]