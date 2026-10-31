# ==============================================================
# Dockerfile for Smart Campus Management System - Backend API
# Course: INT333 - DevOps Advanced Configuration Management
# ==============================================================

FROM node:20-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Install dependencies before copying code for better Docker caching
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose backend port
EXPOSE 5000

# Health check configuration for Docker daemon and orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start the Node.js server
CMD ["node", "server.js"]

