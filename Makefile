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
	docker-compose -f ./docker/docker-compose.e2e.yaml up --build --force-recreate --renew-anon-volumes --exit-code-from e2e-runner

test:
	npm run test
