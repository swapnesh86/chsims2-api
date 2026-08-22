FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production

# Cloud Run sets $PORT at runtime (defaults to 8080); server.js already
# reads process.env.PORT with a fallback, so no code change was needed.
EXPOSE 8080

CMD ["node", "server.js"]
