build:
	npm run build

run: build
	npm run start:prod

install:
	npm install

update:
	npx npm-check-updates -i

lint:
	npm run lint

docker-build:
	docker build . -t mikolajkalwa/gamesdealsbot

docker-run:
	docker run --init -it --env-file=.env mikolajkalwa/gamesdealsbot
