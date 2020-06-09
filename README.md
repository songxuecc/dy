# dy_banjia-fe

> 抖音小店前端

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 线上部署
```
cd /p/src/hhother-fe
git pull
sudo sh release.sh
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

```
FAQ
Q: npm install 遇到报错 ChromeDriver installation failed Error with http(s) request: Error: connect ETIMEDOUT 172.217.24.208:443
A: 试试执行 npm install chromedriver --chromedriver_cdnurl=http://cdn.npm.taobao.org/dist/chromedriver
```

