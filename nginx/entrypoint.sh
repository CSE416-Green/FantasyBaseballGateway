#!/bin/sh
set -e

# Generate nginx.conf from template using envsubst
export GATEWAY_URL=${GATEWAY_URL:-http://host.docker.internal:8080}
export PLAYER_STATS_API_URL=${PLAYER_STATS_API_URL:-http://host.docker.internal:3000}

envsubst '${GATEWAY_URL},${PLAYER_STATS_API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start nginx
nginx -g 'daemon off;'
