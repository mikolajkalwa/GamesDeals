FROM node:14

WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn run tsc
CMD ["node", "./built/index.js"]