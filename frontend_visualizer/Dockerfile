# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

ENV NODE_ENV production
# Start the app
CMD [ "npx", "serve", "build" ]