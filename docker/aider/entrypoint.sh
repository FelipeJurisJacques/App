#!/bin/bash
git config --global --add safe.directory /workspace
if [ ! -d '.git' ]; then
    git init
fi
git add .
aider