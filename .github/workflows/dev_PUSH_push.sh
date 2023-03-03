#!/bin/bash

echo boloss
docker images --format "{{.Repository}}:{{.Tag}}"
echo boloss
docker image push backend-wildcode_back:latest