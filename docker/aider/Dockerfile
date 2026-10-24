FROM python:3.12

WORKDIR /workspace

RUN apt-get update
RUN apt-get install -y git
# RUN apt-get install -y openssh-client

RUN rm -rf /var/lib/apt/lists/*
RUN pip install --no-cache-dir aider-chat

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]