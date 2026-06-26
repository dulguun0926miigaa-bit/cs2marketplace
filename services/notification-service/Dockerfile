FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3003
CMD ["sh", "-c", "sed -i 's/provider = \"sqlite\"/provider = \"mysql\"/' prisma/schema.prisma && npx prisma generate && npx prisma db push --accept-data-loss && node src/app.js"]
