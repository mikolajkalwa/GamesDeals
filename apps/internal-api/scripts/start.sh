#!/bin/sh
set -ex
pnpm prisma migrate deploy --schema=./apps/internal-api/prisma/schema.prisma
dumb-init node ./apps/internal-api/dist/main.js
