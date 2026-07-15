#!/bin/bash

rm -rf /root/.npm/_logs/*
mkdir -p /workspace/build/
mkdir -p /workspace/public/
mkdir -p /workspace/assets/
mkdir -p /workspace/source/
mkdir -p /workspace/resources/

if [ ! -f /workspace/go.sum ]; then
    cd /workspace/
    go mod init app
    go mod tidy
fi

tail -f /dev/null