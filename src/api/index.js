import Vue from 'vue'
import qs from 'qs'
import router from '@/router'
import store from '@/store/store'
import * as types from '@/store/types'

const post = (relativePath, data, headers, resolve, reject) => Vue.axios.post(relativePath, data, {headers}).then(response => {
  if (parseInt(response.status) === 200) {
    if (parseInt(response.data.code) === 0) {
      resolve(response.data.data)
    } else if ([200, 201, 202].includes(parseInt(response.data.code))) {
      store.commit(types.LOGOUT)
      router.push({
        path: '/'
      })
      reject(new Error(response.data.msg))
    } else {
      reject(new Error(response.data.msg))
    }
  } else {
    reject(new Error('服务接口出错'))
  }
}).catch(err => {
  console.error(err)
  reject(err)
})

/**
 * 发起get请求
 */
const get = (relativePath, headers, resolve, reject) => Vue.axios
  .get(relativePath, {headers})
  .then(response => {
    if (parseInt(response.status) === 200) {
      if (parseInt(response.data.code) === 0) {
        resolve(response.data.data)
      } else if ([200, 201, 202].includes(parseInt(response.data.code))) {
        store.commit(types.LOGOUT)
        router.push({
          path: '/'
        })
        reject(new Error(response.data.msg))
      } else {
        reject(new Error(response.data.msg))
      }
    } else {
      reject(new Error('服务接口出错'))
    }
  })
  .catch(err => {
    console.error(err)
    reject(err)
  })

/**
 * 构造get请求对象
 * @param relativePath
 * @param params
 * @returns {Promise<void>}
 */
const actionCreateGet = async (relativePath, params) => {
  params = params || {}
  // 遍历params构造请求路径
  for (let key in params) {
    relativePath += `${key}=${params[key]}&`
  }

  return new Promise(function (resolve, reject) {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    let token = localStorage.getItem('token')
    let fakeToken = localStorage.getItem('fake_token')
    if (token) {
      headers['token'] = token
    }
    if (fakeToken && relativePath !== '/api/fakeUser') {
      headers['fake-token'] = fakeToken
    }
    let changeShop = localStorage.getItem('change_shop')
    if (changeShop) {
      headers['change-shop'] = changeShop
    }

    get(relativePath, headers, resolve, reject)
  })
}

const actionCreatorPost = async (relativePath, params) => {
  params = params || {}
  return new Promise(function (resolve, reject) {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    let token = localStorage.getItem('token')
    let fakeToken = localStorage.getItem('fake_token')
    if (token) {
      headers['token'] = token
    }
    if (fakeToken && relativePath !== '/api/fakeUser') {
      headers['fake-token'] = fakeToken
    }
    let changeShop = localStorage.getItem('change_shop')
    if (changeShop) {
      headers['change-shop'] = changeShop
    }
    let data = qs.stringify(params, {arrayFormat: 'brackets'})
    post(relativePath, data, headers, resolve, reject)
  })
}

const actionCreatorJsonPost = async (relativePath, params) => {
  params = params || {}
  return new Promise(function (resolve, reject) {
    let headers = {
      'Content-Type': 'application/json; charset=UTF-8'
    }
    let token = localStorage.getItem('token')
    let fakeToken = localStorage.getItem('fake_token')
    if (token) {
      headers['token'] = token
    }
    if (fakeToken && relativePath !== '/api/fakeUser') {
      headers['fake-token'] = fakeToken
    }
    let changeShop = localStorage.getItem('change_shop')
    if (changeShop) {
      headers['change-shop'] = changeShop
    }
    post(relativePath, params, headers, resolve, reject)
  })
}

const actionCreatorDownload = async (relativePath, params) => {
  params = params || {}
  return new Promise(function (resolve, reject) {
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    let token = localStorage.getItem('token')
    let fakeToken = localStorage.getItem('fake_token')
    if (token) {
      headers['token'] = token
    }
    if (fakeToken && relativePath !== '/api/fakeUser') {
      headers['fake-token'] = fakeToken
    }
    let changeShop = localStorage.getItem('change_shop')
    if (changeShop) {
      headers['change-shop'] = changeShop
    }
    return Vue.axios.get(relativePath, {params, headers, responseType: 'blob'}).then(response => {
      const blob = new Blob([response.data], {type: response.data.type})
      if (response.data.type === 'application/json') {
        let fr = new FileReader()
        fr.onload = function () {
          let data = JSON.parse(this.result)
          if (parseInt(data.code) === 0) {
            resolve(data.data)
          } else if ([200, 201, 202].includes(parseInt(data.code))) {
            store.commit(types.LOGOUT)
            router.push({
              path: '/'
            })
            reject(new Error(data.msg))
          } else {
            reject(new Error(data.msg))
          }
        }
        fr.readAsText(blob)
        return
      }
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      let fileName = 'file'
      const contentDisposition = response.headers['content-disposition']
      if (contentDisposition) {
        const s = "filename*=utf-8''"
        const index = contentDisposition.indexOf(s)
        if (index !== -1) {
          fileName = contentDisposition.substr(index + s.length)
          fileName = decodeURIComponent(fileName)
        }
      }
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      resolve(fileName)
    }).catch(err => {
      console.error(err)
      reject(err)
    })
  })
}

export default {
  actionCreateGet,
  actionCreatorPost,
  actionCreatorJsonPost,
  actionCreatorDownload
}
