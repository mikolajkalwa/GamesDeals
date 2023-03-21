#!/bin/sh
set -ex
npx prisma migrate deploy
node ./dist/main.js
