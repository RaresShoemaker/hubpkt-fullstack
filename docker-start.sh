#!/bin/sh

# Wait for database to be ready (if using external PostgreSQL)
echo "Starting HubPKT application..."

# Generate Prisma client and run migrations
cd /app/server
npm run prisma:generate
npm run prisma:migrate:deploy

# Start nginx in background to serve client and uploads
nginx -g "daemon on;" -c /app/nginx-simple.conf

# Start the backend server in background
cd /app/server
npm start &

# Keep the container running by waiting
wait