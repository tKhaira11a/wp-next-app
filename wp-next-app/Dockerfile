# --- STAGE 1: Build the application ---
# HINWEIS: Dieser Build benötigt Zugriff auf WordPress GraphQL!
# Der Build muss entweder:
# 1. Mit --network=host ausgeführt werden, oder
# 2. Das Schema muss vorab generiert sein (src/gql/)
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Build-Argumente definieren
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_WORDPRESS_API_URL
ARG NEXT_PUBLIC_WORDPRESS_API_HOSTNAME
ARG HEADLESS_SECRET
ARG WP_USER
ARG WP_APP_PASS
ARG NOT_FOUND_ID
ARG RESEND_API_KEY

# Als Umgebungsvariablen für den Build verfügbar machen
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_WORDPRESS_API_URL=$NEXT_PUBLIC_WORDPRESS_API_URL
ENV NEXT_PUBLIC_WORDPRESS_API_HOSTNAME=$NEXT_PUBLIC_WORDPRESS_API_HOSTNAME
ENV HEADLESS_SECRET=$HEADLESS_SECRET
ENV WP_USER=$WP_USER
ENV WP_APP_PASS=$WP_APP_PASS
ENV NOT_FOUND_ID=$NOT_FOUND_ID
ENV RESEND_API_KEY=$RESEND_API_KEY

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy all necessary files
COPY . .
RUN chmod +x ./node_modules/.bin/graphql-codegen
RUN chmod +x node_modules/.bin/*

# Run build - Schema muss entweder vorab vorhanden sein oder WordPress erreichbar
RUN npm run build

# --- STAGE 2: Run the application ---
FROM node:20-alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S nodegroup && adduser -S nodeuser -u 1001 -G nodegroup

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules node_modules

# Expose port
EXPOSE 3000

# Use non-root user
USER nodeuser

# Start the app
CMD ["npm", "run", "start"]
