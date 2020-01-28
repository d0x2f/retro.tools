FROM node:latest AS build
WORKDIR /srv
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine
STOPSIGNAL SIGQUIT
COPY --from=build /srv/container/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /srv/public /usr/share/nginx/html