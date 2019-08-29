FROM node:latest

RUN apt-get update

RUN mkdir -p /app
WORKDIR /app

ADD ./package.json /app/package.json
RUN yarn install --no-lockfile --silent

ADD src /app/src
ADD public /app/public

RUN apt-get clean
CMD ["yarn", "dev"]