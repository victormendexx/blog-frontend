# ---- Build stage: compila os assets estáticos do React ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# As variáveis VITE_* são "assadas" no bundle em tempo de build — o Vite
# não lê variáveis de ambiente em runtime, então isso precisa ser um ARG.
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---- Production stage: serve os arquivos estáticos via Nginx ----
# Variante "unprivileged" (não roda como root) — mesma preocupação de
# segurança que já aplicamos no Dockerfile do back-end.
FROM nginxinc/nginx-unprivileged:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]