# Build
FROM node:18 AS build


WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
COPY src ./
 
# Run
FROM node:18

USER node

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app

EXPOSE 7764
CMD ["node", "."]
