# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Allow API URL to be injected at build time for Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:stable-alpine
# Use our custom nginx config (adds SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
