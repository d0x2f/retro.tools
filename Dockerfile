FROM node:latest AS build
WORKDIR /srv
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:latest
COPY --from=build /srv/public /usr/share/nginx/html