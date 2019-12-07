# Build the postgraphile image
FROM node:12

RUN mkdir /api
WORKDIR /api
COPY package.json /api
COPY package-lock.json /api
RUN npm install -g typescript
RUN npm install -g ts-node
RUN npm install

COPY src /api/src

CMD npx ts-node /api/src/main.js
