#!/bin/bash

mkdir -p /workspace/web/build/
mkdir -p /workspace/web/public/
mkdir -p /workspace/web/assets/
mkdir -p /workspace/web/source/
mkdir -p /workspace/web/resources/

if [ ! -f /workspace/go.sum ]; then
    go mod init app
    go mod tidy
fi
if [ ! -f /workspace/package-lock.json ]; then
    npm install
fi

go run build.go build