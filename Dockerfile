# Multi-stage: the toolchain never reaches the running image.
#
# Next's `output: "standalone"` traces the modules actually imported and emits
# a server that needs no node_modules, which is what makes the final stage a
# few hundred megabytes rather than well over a gigabyte.

# --- dependencies ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
# Only the manifests, so this layer is cached until a dependency changes
# rather than on every source edit.
COPY package.json package-lock.json ./
RUN npm ci

# --- build -----------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time only. `API_BASE_URL` is read at runtime by the server, but Next
# needs *something* present while prerendering.
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_MIXPANEL_TOKEN=""
ENV NEXT_PUBLIC_MIXPANEL_TOKEN=$NEXT_PUBLIC_MIXPANEL_TOKEN

RUN npm run build

# --- runtime ---------------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# A non-root user. Nothing here needs to write to the filesystem, and a
# container running as root is a container one bug away from being worse.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# `hostname` must be 0.0.0.0, not localhost: bound to localhost inside a
# container, nothing outside it can ever connect.
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
