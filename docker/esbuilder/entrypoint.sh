#!/bin/bash
set -e

mkdir -p /workspace/web/build/
mkdir -p /workspace/web/public/
mkdir -p /workspace/web/assets/
mkdir -p /workspace/web/source/
mkdir -p /workspace/web/resources/

if [ "$1" = "install" ]; then
    if [ ! -f /workspace/go.sum ]; then
        go mod init app
        go mod tidy
    fi
    npm install --legacy-peer-deps
elif [ "$1" = "build" ]; then
    go run build.go build
else
    exec "$@"
fi