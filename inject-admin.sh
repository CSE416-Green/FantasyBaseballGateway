#!/usr/bin/env bash

echo "Injecting admin API configuration into Express Gateway..."

while IFS='=' read -r key value; do
  if [ -z "${!key}" ]; then
    export "$key=$value"
  fi
done < .env

eg user create -p 'username=admin' -p 'firstname=admin' -p 'lastname=admin'

eg scopes create admin

eg credentials create -c admin -t key-auth -p "keyId=${ADMIN_API_KEY_ID}" -p "keySecret=${ADMIN_API_KEY_SECRET}" -p "scopes=admin"

eg user create -p 'username=cse416-team-green' -p 'firstname=Hello' -p 'lastname=World'

eg credentials create -c cse416-team-green -t key-auth -p "keyId=keyId" -p "keySecret=keySecret"
