FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install

COPY prisma ./prisma
COPY tsconfig.json nest-cli.json ./
COPY src ./src

RUN pnpm run prisma:generate
RUN pnpm build

CMD ["pnpm", "start:prod"]
