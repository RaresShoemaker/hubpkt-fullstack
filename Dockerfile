FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache python3 make g++ postgresql-client nginx

WORKDIR /app

# Copy server dependencies and install
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma/
WORKDIR /app/server
RUN npm ci --omit=dev

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

# Build client with environment variables
WORKDIR /app/client
ARG VITE_API_BASE_URL
ARG VITE_API_KEY
ARG VITE_JOTFORM_API_KEY
ARG VITE_JOTFORM_FORM_ID
ARG VITE_JOTFORM_FORM_CREATORS_ID
ARG VITE_TRACKING_ID_GA
ARG VITE_ENV_TYPE
ARG NODE_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_KEY=$VITE_API_KEY
ENV VITE_JOTFORM_API_KEY=$VITE_JOTFORM_API_KEY
ENV VITE_JOTFORM_FORM_ID=$VITE_JOTFORM_FORM_ID
ENV VITE_JOTFORM_FORM_CREATORS_ID=$VITE_JOTFORM_FORM_CREATORS_ID
ENV VITE_TRACKING_ID_GA=$VITE_TRACKING_ID_GA
ENV VITE_ENV_TYPE=$VITE_ENV_TYPE
ENV NODE_ENV=$NODE_ENV
RUN npm run build

# Rebuild server dependencies after copying source (fixes bcrypt)
WORKDIR /app/server
RUN rm -rf node_modules && npm ci

# Build server
RUN npm run build

# Remove dev dependencies after build
RUN rm -rf node_modules && npm ci --omit=dev

# Create uploads directory
RUN mkdir -p /app/uploads

WORKDIR /app

# Copy startup script
COPY docker-start.sh ./
RUN chmod +x docker-start.sh

EXPOSE 4001 80

CMD ["./docker-start.sh"]