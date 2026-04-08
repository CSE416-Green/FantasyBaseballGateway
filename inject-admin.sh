#!/usr/bin/env bash

echo "Injecting admin API configuration into Express Gateway..."

export $(cat .env | xargs) 

eg user create -p 'username=admin' -p 'firstname=admin' -p 'lastname=admin'

eg scopes create admin

eg credentials create -c admin -t key-auth -p "scopes=admin"