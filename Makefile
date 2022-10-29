.PHONY: test

build:
	npm run build

run:
	npm run start:dev

install:
	npm install

update:
	npx npm-check-updates -i

e2e:
	docker compose -f ./docker/compose.e2e.yaml up --build --force-recreate --exit-code-from e2e-runner

test:
	npm run test

db-run:
	docker run --name games-deals-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:alpine

db-setup:
	npx prisma migrate dev

db-reset:
	npx prisma migrate reset --force

docker-build:
	docker build . -t mikolajkalwa/gamesdealsapi

docker-run:
	docker run --init -it -p 3000:3000 --env-file=.env mikolajkalwa/gamesdealsapi
