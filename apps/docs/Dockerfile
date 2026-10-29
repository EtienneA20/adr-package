# syntax=docker/dockerfile:1
#
# Image de la documentation (Docusaurus servi par nginx).
# Contexte de build : la RACINE du dépôt.
#   docker build -f apps/docs/Dockerfile -t adr-docs .
#   docker run --rm -p 8080:8080 adr-docs

ARG NODE_VERSION=22

# --- Base : Node + pnpm (version lue dans le champ packageManager via corepack) -------------
FROM node:${NODE_VERSION}-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    HUSKY=0 \
    CI=true
RUN corepack enable
WORKDIR /repo

# --- Prune : sous-ensemble du monorepo nécessaire à @etiennea20/docs ----------------------
FROM base AS pruner
COPY . .
RUN pnpm dlx turbo@2.11.10 prune @etiennea20/docs --docker

# --- Build : installation (en cache tant que les manifestes ne changent pas) puis build ----
FROM base AS builder
COPY --from=pruner /repo/out/json/ .
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile
COPY --from=pruner /repo/out/full/ .
# Chemins racine hors workspace, ignorés par turbo prune : tsconfig.base.json (étendu par chaque
# tsconfig) et scripts/ (install-skills.mjs, appelé par le script build:skills des packages).
COPY --from=pruner /repo/tsconfig.base.json ./
COPY --from=pruner /repo/scripts ./scripts
RUN pnpm turbo run build --filter=@etiennea20/docs

# --- Runtime : fichiers statiques servis par nginx, utilisateur non-root ------------------
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runner
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /repo/apps/docs/build /usr/share/nginx/html
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1
