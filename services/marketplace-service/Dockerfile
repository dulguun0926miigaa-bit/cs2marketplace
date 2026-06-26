FROM node:20-alpine

WORKDIR /app

RUN mkdir -p uploads

# Install deps first (layer cache)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Generate Prisma client for SQLite (used locally / build-time check)
RUN npx prisma generate

EXPOSE 3002

CMD ["sh", "-c", "\
  DB_PROVIDER=${DATABASE_PROVIDER:-mysql} && \
  sed -i \"s/provider = \\\"sqlite\\\"/provider = \\\"${DB_PROVIDER}\\\"/\" prisma/schema.prisma && \
  npx prisma generate && \
  npx prisma db push --accept-data-loss && \
  node prisma/seed.js ; \
  node src/app.js \
"]
