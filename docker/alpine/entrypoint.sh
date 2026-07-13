#!/bin/bash

rm -rf /root/.npm/_logs/*
mkdir -p /workspace/app/build/
mkdir -p /workspace/app/public/
mkdir -p /workspace/app/assets/
mkdir -p /workspace/app/source/
mkdir -p /workspace/app/resources/

tail -f /dev/null