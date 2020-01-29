FROM node:latest AS build
WORKDIR /srv
COPY . .
RUN yarn install
RUN yarn build

FROM nginx:alpine
STOPSIGNAL SIGQUIT
WORKDIR /srv
RUN apk --no-cache add gettext
COPY --from=build /srv/container/ /srv/
COPY --from=build /srv/public /usr/share/nginx/html
ENTRYPOINT ["/srv/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]