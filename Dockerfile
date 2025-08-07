# DVulnDB Solana-Only Deployment Container
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    git \
    python3 \
    make \
    g++ \
    libc6-compat

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Solana CLI
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked --tag v0.30.1

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY .yarnrc.yml ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Build stage
FROM base AS builder

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run build verification
RUN yarn build:check

# Build Anchor programs
RUN anchor build

# Build Next.js application
RUN yarn build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Anchor build artifacts
COPY --from=builder /app/anchor/target ./anchor/target
COPY --from=builder /app/Anchor.toml ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]