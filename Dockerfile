FROM node:lts-alpine

RUN apk add dumb-init

ENV NODE_ENV production

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node ["package.json", "yarn.lock", "./"]

USER node

RUN yarn install --frozen-lockfile --prod

COPY --chown=node:node . .

CMD ["dumb-init", "node", "server.js"]
