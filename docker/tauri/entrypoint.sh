#!/bin/bash

rm -rf /root/.npm/_logs/*

pnpm tauri dev --config /workspace/desktop/tauri.conf.json