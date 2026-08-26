FROM node:latest

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y file
RUN apt-get install -y wget
RUN apt-get install -y libssl-dev
RUN apt-get install -y libxdo-dev
RUN apt-get install -y pkg-config
RUN apt-get install -y librsvg2-dev
RUN apt-get install -y build-essential
RUN apt-get install -y libwebkit2gtk-4.1-dev
RUN apt-get install -y libayatana-appindicator3-dev

RUN npm install -g pnpm

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /workspace/

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

CMD ["/usr/local/bin/entrypoint.sh"]
