FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache python3 make g++ postgresql-client nginx

WORKDIR /app

# Copy server dependencies and install
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
WORKDIR /app/server
RUN npm ci --production=false

# Copy client dependencies and install  
WORKDIR /app
COPY client/package*.json ./client/
WORKDIR /app/client
RUN npm ci

# Copy all source code
WORKDIR /app
COPY server ./server/
COPY client ./client/
COPY nginx-simple.conf ./

# Build client
WORKDIR /app/client
RUN npm run build

# Rebuild server dependencies after copying source (fixes bcrypt)
WORKDIR /app/server
RUN rm -rf node_modules && npm ci --production=false

# Build server
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/uploads

WORKDIR /app

# Copy startup script
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

EXPOSE 4001 80

CMD ["./docker-start.sh"]