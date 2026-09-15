FROM alpine:latest

RUN apk add --no-cache go
RUN apk add --no-cache git
RUN apk add --no-cache npm
RUN apk add --no-cache bash
RUN apk add --no-cache ffmpeg

ENV GOPATH=/go
ENV PATH=$PATH:$GOPATH/bin

WORKDIR /workspace/
ENV GOCACHE=/workspace/go-modules/build/
ENV GOMODCACHE=/workspace/go-modules/mod/

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
