FROM node:20-alpine

# Install build tools required for argon2
RUN apk add --no-cache g++ make python3

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Environment variables will come from docker-compose
ENV NODE_ENV=production

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 3001

CMD ["node", "server.js"]