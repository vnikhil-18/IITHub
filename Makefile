build:
	cd frontend && $(MAKE) build
	cd backend && $(MAKE) build

run:
	docker-compose up -d

stop:
	docker-compose down -v