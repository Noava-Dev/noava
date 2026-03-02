# Build the docs
FROM node:20-alpine AS docs-build

WORKDIR /app/docs

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve static files
FROM nginx:alpine

COPY --from=docs-build /app/docs/build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
