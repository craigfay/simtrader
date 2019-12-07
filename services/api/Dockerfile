# Build the postgraphile image
FROM node:12

RUN mkdir /api
COPY package.json /api
COPY package-lock.json /api
COPY build-deps.sh /api
RUN npm --prefix /api install
RUN npm --prefix /api install -g typescript
RUN npm --prefix /api run buildDeps

COPY src /api/src
