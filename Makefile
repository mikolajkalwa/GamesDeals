build:
	npm run build

run: build
	node dist/index.js

install:
	npm install

update:
	npx npm-check-updates -i
