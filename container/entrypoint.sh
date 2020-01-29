#!/bin/sh
set -x

export PORT=${PORT:-80}
envsubst < /srv/nginx.conf > /etc/nginx/conf.d/default.conf

"$@"
