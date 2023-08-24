FROM node:18 as base

WORKDIR /back
COPY package*.json /back
EXPOSE 5000

FROM base as production
RUN npm install
COPY src /back/src
COPY tsconfig.json /back/
COPY tsconfig.build.json /back/
COPY .env /back/
RUN npm install -g typescript ts-node
# RUN npm install -g pm2
RUN npm run build
CMD ["node", "dist/index.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm install
COPY src /back/src
COPY .env /back/
COPY tsconfig.json /back/
COPY jest.config.js /back/
CMD ["ts-node-dev", "src/index.ts"]
