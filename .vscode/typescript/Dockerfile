FROM node:alpine

WORKDIR /workspace/

COPY ./package.json /workspace/package.json
COPY ./tsconfig.json /workspace/tsconfig.json
COPY ./rollup.config.js /workspace/rollup.config.js

CMD ["tail", "-f", "/dev/null"]