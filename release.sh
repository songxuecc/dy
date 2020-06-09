#!/bin/bash
npm install --no-save --unsafe-perm=true
npm run build
mkdir -p /var/www/html/hhother-fe/dist
cp -rf dist/* /var/www/html/hhother-fe/dist
