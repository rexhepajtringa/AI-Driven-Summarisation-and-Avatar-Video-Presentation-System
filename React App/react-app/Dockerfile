# Stage 1: Build the Vite application
FROM node:16 AS build

WORKDIR /react-app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the Vite application using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx web directory
COPY --from=build /react-app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
