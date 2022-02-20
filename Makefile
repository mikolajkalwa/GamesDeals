build:
	npm run build

run: build
	npm run start:prod

install:
	npm install

update:
	npx npm-check-updates -i

setup: build
	node dist/scripts/setupInteractions.js
