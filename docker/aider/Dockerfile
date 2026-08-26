FROM python:3.12

WORKDIR /workspace

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir aider-chat

CMD ["tail", "-f", "/dev/null"]