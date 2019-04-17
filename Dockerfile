FROM node:11.7

WORKDIR ./usr/app

COPY . .
RUN npm install --quiet
RUN npm run build
