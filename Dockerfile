# Lightweight Nginx Alpine Base Image (< 25MB)
FROM nginx:alpine

# Copy optimized custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all static website assets to Nginx web root
COPY . /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
