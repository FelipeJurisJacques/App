FROM debian:stable-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV JAVA_HOME=/root/.sdkman/candidates/java/current
ENV GRADLE_HOME=/root/.sdkman/candidates/gradle/current
ENV PATH="${JAVA_HOME}/bin:${GRADLE_HOME}/bin:${PATH}"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        tar curl bash unzip zip sed grep \
        binaryen libz-dev zlib1g-dev build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace/

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
