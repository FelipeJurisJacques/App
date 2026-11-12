#!/bin/bash
curl -s "https://get.sdkman.io?ci=true" | bash

ls -la $HOME/.sdkman/bin/ || (echo "SDKMAN not at HOME"; find / -name "sdkman-init.sh" 2>/dev/null)

source "$HOME/.sdkman/bin/sdkman-init.sh" && \
    LATEST_GRAAL=$(sdk list java | grep -oE '[0-9]+\.[0-9]+\.[0-9]+-graalce' | head -n 1) && \
    sdk install java "${LATEST_GRAAL}" && \
    sdk install gradle

source "$HOME/.sdkman/bin/sdkman-init.sh"

cd /workspace/backend/
gradle wrapper
./gradlew teavmWasm
