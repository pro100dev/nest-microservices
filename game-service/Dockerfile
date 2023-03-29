FROM node:18.14.2 as dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install

COPY --chown=node:node . .

RUN yarn build
USER node

FROM node:18.14.2 as prod

ARG NODE_ENV=production
FROM node:18.14.2 as dev

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn

COPY --chown=node:node . .

RUN yarn build

USER node
