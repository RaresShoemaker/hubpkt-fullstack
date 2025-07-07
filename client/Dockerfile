FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./

RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]