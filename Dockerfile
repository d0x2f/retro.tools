FROM node:latest AS build
WORKDIR /srv
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine
RUN sed -i '/^    #error_page  404.*/a \ \ \ \ error_page 404 /;' /etc/nginx/conf.d/default.conf
STOPSIGNAL SIGQUIT
COPY --from=build /srv/public /usr/share/nginx/html