build:
	npm run build

run: build
	node dist/index.js

install:
	npm install

update:
	npx npm-check-updates -i

test: 
	npm run test

docker-build:
	docker build . -t mikolajkalwa/gamesdealsnotifier

docker-run:
	docker run --init -it --env-file=.env mikolajkalwa/gamesdealsnotifier
