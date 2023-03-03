#!/bin/bash

docker image push $(docker images --format "{{.Repository}}:{{.Tag}}")