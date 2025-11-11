# Step 1 — Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your source code
COPY . .

# Build the app for production
RUN npm run build


# Step 2 — Serve stage
FROM nginx:alpine

# Copy built files from build stage to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
