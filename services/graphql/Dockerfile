# Build the postgraphile image
FROM node:12

# Install Postgraphile
RUN mkdir /graphql
COPY package.json /graphql
COPY package-lock.json /graphql
RUN npm --prefix /graphql install
