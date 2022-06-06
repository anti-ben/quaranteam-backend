FROM registry-jpe2.r-local.net/cc-tech-newgrad-h-quaranteam/node:lts

RUN mkdir -p /usr/src/quaranteam-backend/

WORKDIR /usr/src/quaranteam-backend/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD [ "npm", "run", "start:prod"]
