#!/bin/sh
# deploy.sh

docker compose -f docker-compose.deploy.yml down
docker stop $(docker ps --filter name=back* -q)
docker rmi -f $(docker images gnos28/wildcode-back -q)
# docker image prune -f
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
