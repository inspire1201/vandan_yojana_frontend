# # # # Step 1 — Build stage
# # # FROM node:18-alpine AS build

# # # # Set working directory
# # # WORKDIR /app

# # # # Copy package files first (for caching)
# # # COPY package*.json ./

# # # # Install dependencies
# # # RUN npm install

# # # # Copy the rest of your source code
# # # COPY . .

# # # # Build the app for production
# # # RUN npm run build


# # # # Step 2 — Serve stage
# # # FROM nginx:alpine

# # # # Copy built files from build stage to nginx html folder
# # # COPY --from=build /app/dist /usr/share/nginx/html

# # # # Expose port 80 (nginx default)
# # # EXPOSE 80

# # # # Start NGINX
# # # CMD ["nginx", "-g", "daemon off;"]


# # # Step 1 — Build stage
# # FROM node:18-alpine AS build
# # WORKDIR /app
# # COPY package*.json ./
# # RUN npm install
# # COPY . .
# # RUN npm run build

# # # Step 2 — Serve stage
# # FROM nginx:alpine
# # COPY --from=build /app/dist /usr/share/nginx/html
# # COPY nginx.conf /etc/nginx/conf.d/default.conf
# # EXPOSE 80
# # CMD ["nginx", "-g", "daemon off;"]




# # Step 1 — Build stage
# FROM node:18-alpine AS build

# WORKDIR /app

# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source code
# COPY . .

# # Build the Vite app with build-time env
# ARG VITE_API_BASE_URL
# RUN VITE_API_BASE_URL=$VITE_API_BASE_URL npm run build

# # Step 2 — Serve stage
# FROM nginx:alpine

# # Copy build output to Nginx
# COPY --from=build /app/dist /usr/share/nginx/html

# # Copy optimized Nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]



# Step 1 — Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Build vite app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Step 2 — NGINX deploy
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
