# Railway: build the static site, serve dist/ with Caddy (plan O13).
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Railway passes service variables to a Dockerfile build only when they are declared as ARGs.
#   PUBLIC_ALLOW_INDEX=1  launch only (domain live, James approves): robots.txt allows indexing
ARG PUBLIC_ALLOW_INDEX
ENV PUBLIC_ALLOW_INDEX=$PUBLIC_ALLOW_INDEX
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
EXPOSE 8080
