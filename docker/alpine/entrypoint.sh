#!/bin/bash

rm -rf /root/.npm/_logs/*
mkdir -p /workspace/.build/
mkdir -p /workspace/public/
mkdir -p /workspace/assets/
mkdir -p /workspace/source/
mkdir -p /workspace/resources/
mkdir -p /workspace/production/application/
mkdir -p /workspace/development/application/

tail -f /dev/null