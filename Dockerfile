# Dockerfile
FROM node:22
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# dependencias de sistema necesarias para Chromium / Puppeteer
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates wget gnupg fonts-liberation \
  libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxi6 \
  libxrandr2 libxss1 libxtst6 libcups2 libatk1.0-0 libgtk-3-0 \
  libasound2 libnss3 libgbm1 \
  && rm -rf /var/lib/apt/lists/*

COPY . .

# instalar dependencias del monorepo con pnpm
RUN pnpm -w install --no-frozen-lockfile
# instalar dependencias de todos los workspaces
RUN pnpm install --no-frozen-lockfile

# Fuerza instalación de Chromium en build
RUN npx puppeteer browsers install chrome

# ejecutar el instalador de navegador dentro del paquete hipatia
RUN pnpm --filter @harvest/hipatia run install-browsers

RUN pnpm exec puppeteer browsers install chrome

ENV PORT=8080
EXPOSE 8080

CMD ["pnpm", "--filter", "api", "start"]
