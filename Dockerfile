FROM node:18 as base

WORKDIR /src
COPY package*.json /
EXPOSE 5000

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["node", "src/index.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["ts-node-dev", "src/index.ts"]
