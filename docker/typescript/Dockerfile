FROM alpine:latest

RUN apk add --no-cache git
RUN apk add --no-cache npm
RUN apk add --no-cache bash
RUN apk add --no-cache nodejs

WORKDIR /workspace/

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
