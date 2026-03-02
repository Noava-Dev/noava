# Build the docs
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
WORKDIR /app/docs
RUN npm install
RUN npm run build

# Serve static files
FROM nginx:alpine

COPY --from=build /app/docs/build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
