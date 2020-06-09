#!/bin/bash
cd "$( dirname "$BASH_SOURCE[0]" )" && pwd
export PATH="$PATH:"/usr/local/bin/
npm config set registry https://registry.npm.taobao.org
npm config set puppeteer_download_host=https://npm.taobao.org/mirrors
npm i --no-save --unsafe-perm=true
npm run build:stag
