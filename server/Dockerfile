FROM node:20.10.0-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY tsconfig*.json ./

EXPOSE 4001

CMD ["npm", "run", "dev"]