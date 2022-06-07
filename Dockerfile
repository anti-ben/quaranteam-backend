FROM node:lts-alpine

RUN mkdir -p /usr/src/quaranteam-backend/

WORKDIR /usr/src/quaranteam-backend/

COPY package*.json ./

RUN npm i --production

COPY . .

EXPOSE 3001

ARG node_env=prod
ENV NODE_ENV=$node_env
CMD npm run ${NODE_ENV}

# docker build --build-arg node_env=prod -t hello-docker:0.1 .
