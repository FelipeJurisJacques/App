FROM alpine:latest

RUN apk add --no-cache go git bash npm nodejs ffmpeg
RUN npm install -g tsx
RUN npm install -g typescript

ENV GOPATH=/go
ENV PATH=$PATH:$GOPATH/bin

WORKDIR /workspace/

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
