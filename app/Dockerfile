FROM node:20-alpine AS base

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["node", "dist/main.js"]
