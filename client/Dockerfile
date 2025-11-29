# Build stage
FROM node:20-alpine as build
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .


# Environment Variables
ARG VITE_API_URL
ARG VITE_GRAPHQL_URL
ARG VITE_PUBLIC_PATH
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GRAPHQL_URL=$VITE_GRAPHQL_URL
ENV VITE_PUBLIC_PATH=$VITE_PUBLIC_PATH

ENV NODE_ENV=production

# Build the app
RUN npm run build

# Ensure public files are copied to dist
RUN cp -r public/* dist/ || true

# Serve stage
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Fix permissions
RUN chmod -R 755 /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]