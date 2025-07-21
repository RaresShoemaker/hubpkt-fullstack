FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache python3 make g++ postgresql-client nginx

WORKDIR /app

# Copy server dependencies and install
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
WORKDIR /app/server
RUN npm ci

# Copy client dependencies and install  
WORKDIR /app
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci

# Copy all source code
WORKDIR /app
COPY server ./server/
COPY client ./client/
COPY nginx ./nginx/
COPY nginx-simple.conf ./

# Build client
WORKDIR /app/client
RUN npm run build

# Build server
WORKDIR /app/server
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/uploads

WORKDIR /app

# Copy startup script
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

EXPOSE 4001 80

CMD ["./docker-start.sh"]