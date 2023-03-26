#!/bin/sh
set -ex
pnpm turbo db:migrate
dumb-init node ./dist/main.js
