# Use official Node image with Corepack (pnpm) available
FROM node:24-bookworm-slim

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# App build
WORKDIR /app

# Copy lockfiles first for better caching
COPY pnpm-lock.yaml package.json ./

# Enable and prepare pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest and build
COPY . .
RUN pnpm build

# Runtime env
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Start the application
CMD ["node", "build/index.js"]