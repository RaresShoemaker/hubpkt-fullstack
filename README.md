# HubPKT - Fullstack Application

A modern fullstack React/Node.js application with PostgreSQL database, featuring content management, user authentication, and file uploads.

## Features

- **Frontend**: React 18 with TypeScript, TailwindCSS, Redux Toolkit
- **Backend**: Node.js with Express, Prisma ORM
- **Database**: PostgreSQL
- **File Storage**: Local filesystem with nginx serving
- **Authentication**: JWT-based auth system
- **Deployment**: Simple Docker setup

## Development vs Production

### Development Setup (Separate Ports)
For local development with hot reload and separate ports:

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up --build

# Access services:
# Frontend: http://localhost:5173 (React dev server with hot reload)
# Backend API: http://localhost:4001
# Uploads: http://localhost:8080
# Database: localhost:5432
```

### Production Setup (Single Port)  
For production deployment with everything on port 80:

```bash
# Start production environment  
docker compose up --build

# Access application:
# Everything: http://localhost (or your domain)
```

## Quick Deployment

### Prerequisites

- Docker and Docker Compose installed on your VPS
- A domain name pointed to your VPS (optional)

#### Install Docker on Linux (Ubuntu/Debian):

```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install -y docker.io docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Log out and back in for group changes to take effect

# Verify installation
docker --version
docker-compose --version
```

#### Install Docker on CentOS/RHEL:

```bash
# Install Docker
sudo yum install -y docker docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker-compose --version
```

### 1. Clone Repository

```bash
git clone [your-repository-url]
cd hubpkt-fullstack
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
POSTGRES_USER=hubpktadmin
POSTGRES_PASSWORD=your-secure-password-here
POSTGRES_DB=hubpkt
DATABASE_URL=postgres://hubpktadmin:your-secure-password-here@postgres:5432/hubpkt

# Security (generate secure random strings)
JWT_SECRET=your-super-long-jwt-secret-key-here-min-256-chars
API_KEY=your-api-key-here

# Client Configuration  
CLIENT_ORIGIN=http://your-domain.com  # or http://your-vps-ip
VITE_API_KEY=your-api-key-here
VITE_API_BASE_URL=http://your-domain.com/api  # or http://your-vps-ip/api

# App Settings
REGISTRATION_CODE=your-registration-code
```

### 3. Deploy

```bash
# If you added your user to docker group:
docker compose up --build

# Or with sudo:
sudo docker compose up --build

# Run in background (detached mode):
docker compose up --build -d
```

The application will be available at:
- **Main App**: http://your-domain.com (port 80)
- **API**: http://your-domain.com/api
- **Health Check**: http://your-domain.com/health

## Development

For local development with hot-reload:

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Start development servers
cd client && npm run dev    # Frontend on :5173
cd server && npm run dev    # Backend on :4001
```

## Configuration Options

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens (minimum 256 characters)
- `API_KEY`: API key for protected endpoints
- `CLIENT_ORIGIN`: Frontend URL for CORS
- `REGISTRATION_CODE`: Code required for user registration

### Optional Variables

- `VITE_JOTFORM_API_KEY`: JotForm integration
- `VITE_TRACKING_ID_GA`: Google Analytics tracking ID
- `MAX_FILE_SIZE`: Max upload size in bytes (default: 5MB)
- `ALLOWED_FILE_TYPES`: Comma-separated MIME types

## File Uploads

Files are stored locally and served via nginx:
- Upload path: `/app/uploads`
- Access via: `http://your-domain.com/uploads/filename`
- Organized by categories and types

## Database

The application uses PostgreSQL with Prisma ORM:
- Automatic migrations on startup
- Database schema in `server/prisma/schema.prisma`
- Admin interface available via Prisma Studio (development)

## Security

- Helmet.js for security headers
- Rate limiting (500 requests per 15 minutes)
- CORS protection
- API key authentication for protected endpoints
- File type and size restrictions

## Troubleshooting

### Common Issues

1. **Port 80 already in use**
   ```bash
   # Check what's using port 80
   sudo lsof -i :80
   # Stop conflicting service (e.g., Apache)
   sudo systemctl stop apache2
   ```

2. **Database connection failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL container is running
   - Verify credentials match

3. **File uploads not working**
   - Check MAX_FILE_SIZE and ALLOWED_FILE_TYPES
   - Verify uploads volume is mounted correctly

### Logs

```bash
# View application logs
docker compose logs app
# Or with sudo:
sudo docker compose logs app

# View database logs  
docker compose logs postgres

# Follow logs in real-time
docker compose logs -f

# View all logs
docker compose logs
```

### Rebuild and Restart

```bash
# Stop containers
docker compose down
# Or with sudo:
sudo docker compose down

# Rebuild and restart
docker compose up --build
# Or with sudo:
sudo docker compose up --build

# Run in background
docker compose up --build -d

# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up --build

# Check running containers
docker ps

# Check all containers (including stopped)
docker ps -a
```

### System Management

```bash
# Check Docker service status
sudo systemctl status docker

# Restart Docker service
sudo systemctl restart docker

# Clean up unused Docker resources
docker system prune -f

# Stop all running containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)
```

## Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐
│   React Client  │    │  Node.js API │    │ PostgreSQL  │
│   (Frontend)    │◄──►│   (Backend)  │◄──►│ (Database)  │
└─────────────────┘    └──────────────┘    └─────────────┘
         │                       │
         ▼                       ▼
┌─────────────────────────────────────────────────────────┐
│                nginx (Port 80)                         │
│  • Serves React build                                  │
│  • Proxies /api to backend                             │
│  • Serves uploads from /uploads                        │
└─────────────────────────────────────────────────────────┘
```

## Support

For issues or questions:
1. Check the logs using `docker compose logs`
2. Verify your `.env` configuration
3. Ensure all required environment variables are set
4. Check that your domain DNS is properly configured