FROM node:latest

RUN apt-get update

RUN mkdir -p /app
WORKDIR /app

ADD ./package.json /app/package.json
ADD db /app/db
ADD auth.js /app/auth.js
ADD index.js /app/index.js
ADD wait-for-it.sh /app/wait-for-it.sh

RUN yarn install --no-lockfile --silent

RUN apt-get clean