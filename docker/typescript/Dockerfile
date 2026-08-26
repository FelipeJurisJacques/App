FROM alpine:latest

RUN  curl --proto '=https' --tlv1.2 -sSf https://rustup.rs | sh

RUN apk add --no-cache git bash npm nodejs
RUN npm install -g tsx
RUN npm install -g pnpm
RUN npm install -g typescript

WORKDIR /workspace/

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
