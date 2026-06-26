FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Generate Prisma client with the SQLite schema (build-time)
RUN npx prisma generate

EXPOSE 3001

# At container start:
# 1. Patch provider sqlite → mysql (or postgresql via DATABASE_PROVIDER env)
# 2. Re-generate Prisma client for the target DB
# 3. Push schema to DB (creates/migrates tables)
# 4. Seed initial roles + admin user (non-fatal if already seeded)
# 5. Start the server
CMD ["sh", "-c", "\
  DB_PROVIDER=${DATABASE_PROVIDER:-mysql} && \
  sed -i \"s/provider = \\\"sqlite\\\"/provider = \\\"${DB_PROVIDER}\\\"/\" prisma/schema.prisma && \
  npx prisma generate && \
  npx prisma db push --accept-data-loss && \
  node prisma/seed.js ; \
  node src/app.js \
"]
