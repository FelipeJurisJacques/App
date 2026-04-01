FROM node:alpine

RUN apk add --no-cache bash ffmpeg
RUN npm install -g tsx
RUN npm install -g typescript

EXPOSE 9005
WORKDIR /workspace/

CMD ["tail", "-f", "/dev/null"]