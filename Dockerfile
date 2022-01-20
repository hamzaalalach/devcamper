FROM node:14.16.1

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node ["package.json", "yarn.lock", "./"]

USER node

RUN yarn

COPY --chown=node:node . .

CMD ["yarn", "start"]
